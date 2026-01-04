const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Default data directory
let DATA_DIR = './data';

// Parse command line arguments for --data-dir flag
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--data-dir' && args[i + 1]) {
    DATA_DIR = args[i + 1];
    i++; // Skip the next argument since it's the value
  }
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log(`Data directory: ${DATA_DIR}`);

// Import data persistence and AI integration functions
const {
  loadData,
  saveData,
  loadAllVocabularySets,
  saveVocabularySet,
  loadVocabularySetById,
  updateVocabularySummary,
  loadVocabularySummary,
  getWordsForTheme,
  getAllThemes
} = require('./dataPersistence');

const {
  generateVocabulary,
  validateVocabularyData
} = require('./aiIntegration');

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Load all vocabulary sets
app.get('/api/vocabulary', async (req, res) => {
  try {
    // Use a default user directory (e.g., 'default_user') for non-authenticated access
    const username = 'default_user';
    const vocabularySets = await loadAllVocabularySets(DATA_DIR, username);
    res.json(vocabularySets);
  } catch (error) {
    console.error('Error loading vocabulary sets:', error);
    res.status(500).json({ error: 'Failed to load vocabulary sets' });
  }
});

// Get a specific vocabulary set by ID
app.get('/api/vocabulary/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Use a default user directory (e.g., 'default_user') for non-authenticated access
    const username = 'default_user';
    const vocabularySet = await loadVocabularySetById(DATA_DIR, id, username);

    if (!vocabularySet) {
      return res.status(404).json({ error: 'Vocabulary set not found' });
    }

    res.json(vocabularySet);
  } catch (error) {
    console.error('Error loading vocabulary set:', error);
    res.status(500).json({ error: 'Failed to load vocabulary set' });
  }
});

// Save a new vocabulary set
app.post('/api/vocabulary', async (req, res) => {
  try {
    const vocabularyData = req.body;
    // Use a default user directory (e.g., 'default_user') for non-authenticated access
    const username = 'default_user';

    // Validate required fields
    if (!vocabularyData.type || !vocabularyData.id) {
      return res.status(400).json({ error: 'Invalid vocabulary data: missing type or id' });
    }

    const savedPath = await saveVocabularySet(DATA_DIR, vocabularyData, username);
    res.status(201).json({
      message: 'Vocabulary set saved successfully',
      path: savedPath
    });
  } catch (error) {
    console.error('Error saving vocabulary set:', error);
    res.status(500).json({ error: 'Failed to save vocabulary set' });
  }
});

// Generate new vocabulary via AI
app.post('/api/generate', async (req, res) => {
  try {
    const { userInput } = req.body;
    // Use a default user directory (e.g., 'default_user') for non-authenticated access
    const username = 'default_user';

    if (!userInput) {
      return res.status(400).json({ error: 'Missing userInput in request body' });
    }

    // Check if the user is looking up a single word and if it already exists in the user's data
    const allVocabularySets = await loadAllVocabularySets(DATA_DIR, username);
    const existingWordBreakdown = allVocabularySets.find(set =>
      set.type === 'word_breakdown' &&
      set.word &&
      set.word.toLowerCase() === userInput.toLowerCase()
    );

    if (existingWordBreakdown) {
      // If the word already exists, return the existing data
      console.log(`Found existing word breakdown for: ${userInput}`);
      return res.status(200).json({
        message: 'Existing word breakdown found',
        data: existingWordBreakdown,
        path: 'existing'
      });
    }

    // Check if this is a request to generate vocabulary based on theme/keywords
    let existingWords = [];
    let theme = null;

    if (userInput === "Learn Some Words" || userInput === "new") {
      // For general requests, generate a random theme to maintain consistency
      // First, get all available themes to potentially select from or create a new one
      const allThemes = await getAllThemes(DATA_DIR, username);

      // If we have existing themes, we can select one randomly or create a new specific one
      // For now, let's generate a random specific theme
      const primaryCategories = [
        "Computer Science", "Biological Sciences", "Physical Sciences",
        "Social Sciences", "Health Sciences", "Engineering",
        "Business & Economics", "Arts & Humanities", "Environmental Sciences",
        "Mathematics & Statistics", "Psychology & Cognitive Science",
        "Law & Justice", "Education", "Medicine", "Agriculture & Food Sciences"
      ];

      const randomPrimary = primaryCategories[Math.floor(Math.random() * primaryCategories.length)];
      const randomSubThemes = [
        "Advanced Algorithms", "Quantum Computing", "Molecular Biology",
        "Behavioral Economics", "Climate Modeling", "Neural Networks",
        "Genetic Engineering", "Cognitive Psychology", "Renewable Energy",
        "Data Structures", "Immunology", "Social Dynamics", "Financial Markets",
        "Machine Learning", "Ecology", "Linguistics", "Robotics", "Virology"
      ];

      const randomSub = randomSubThemes[Math.floor(Math.random() * randomSubThemes.length)];
      theme = `${randomPrimary}: ${randomSub}`;

      existingWords = await getWordsForTheme(DATA_DIR, theme, username);
    } else if (userInput.startsWith("Learn Some Words: ") || userInput.startsWith("学习: ")) {
      // Extract theme from user input
      theme = userInput.includes(": ") ? userInput.split(": ")[1] : userInput;

      // Get words for the exact theme
      existingWords = await getWordsForTheme(DATA_DIR, theme, username);

      // Additionally, get words from related themes to avoid similar words across similar topics
      const themeWords = allVocabularySets
        .filter(set => set.type === 'vocabulary_set' && set.theme && set.words)
        .filter(set => {
          // Check if the set's theme is related to the requested theme
          // For example, if requesting "Environmental Sciences: Ecosystems and Biodiversity"
          // we want to avoid words from "Environmental Sciences: Biodiversity and Conservation"
          const setPrimaryCategory = set.theme.split(':')[0]; // Get primary category before first colon
          const requestedPrimaryCategory = theme.split(':')[0]; // Get primary category from request
          return setPrimaryCategory === requestedPrimaryCategory; // Match on primary category
        })
        .flatMap(set => set.words.map(wordObj => wordObj.word));

      // Combine exact theme words with related theme words
      existingWords = [...new Set([...existingWords, ...themeWords])]; // Use Set to avoid duplicates
    }

    // Try to generate valid vocabulary data with retries
    let generatedVocabulary = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;

      try {
        // Generate vocabulary using AI with existing words to avoid duplicates
        generatedVocabulary = await generateVocabulary(userInput, existingWords);

        // Validate the generated data
        if (validateVocabularyData(generatedVocabulary)) {
          break; // Success, exit the retry loop
        } else {
          console.log(`Attempt ${attempts}: Generated vocabulary data is invalid, retrying...`);
          if (attempts >= maxAttempts) {
            return res.status(400).json({ error: 'Generated vocabulary data is invalid after multiple attempts' });
          }
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error.message);
        if (attempts >= maxAttempts) {
          return res.status(500).json({ error: `Failed to generate vocabulary after ${maxAttempts} attempts: ${error.message}` });
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    // Save the generated vocabulary
    const savedPath = await saveVocabularySet(DATA_DIR, generatedVocabulary, username);

    // Update the vocabulary summary in the background
    updateVocabularySummary(DATA_DIR, username).catch(err => {
      console.error('Error updating vocabulary summary:', err);
    });

    res.status(201).json({
      message: 'Vocabulary generated and saved successfully',
      data: generatedVocabulary,
      path: savedPath
    });
  } catch (error) {
    console.error('Error generating vocabulary:', error);
    res.status(500).json({ error: 'Failed to generate vocabulary' });
  }
});

// API route to serve philosophical quotes from Excel file
app.get('/api/quotes', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'philosophical_quotes.xlsx');

    if (!fs.existsSync(filePath)) {
      // If the file doesn't exist, return an empty array
      return res.json({ quotes: [] });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const quotes = XLSX.utils.sheet_to_json(worksheet);

    res.json({ quotes });
  } catch (error) {
    console.error('Error reading quotes Excel file:', error);
    res.status(500).json({ error: 'Failed to read quotes file' });
  }
});

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Data directory: ${DATA_DIR}`);
  });
}

module.exports = app;