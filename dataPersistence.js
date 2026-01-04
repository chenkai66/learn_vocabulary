const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Load all vocabulary sets from the data directory
 */
async function loadAllVocabularySets(dataDir, username = null) {
  try {
    // If username is provided, use user-specific directory
    const userDir = username ? path.join(dataDir, username) : dataDir;

    // Create user directory if it doesn't exist
    if (username) {
      if (!await fileExists(userDir)) {
        await fs.mkdir(userDir, { recursive: true });
      }
    }

    const files = await fs.readdir(userDir);
    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    const vocabularySets = [];
    for (const file of jsonFiles) {
      const filePath = path.join(userDir, file);
      const content = await fs.readFile(filePath, 'utf8');

      try {
        const data = JSON.parse(content);
        vocabularySets.push(data);
      } catch (parseError) {
        console.warn(`Warning: Could not parse JSON file ${file}:`, parseError.message);
      }
    }

    // Sort by timestamp, newest first
    vocabularySets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return vocabularySets;
  } catch (error) {
    console.error('Error loading vocabulary sets:', error);
    throw error;
  }
}

/**
 * Save a vocabulary set to the data directory
 */
async function saveVocabularySet(dataDir, vocabularyData, username = null) {
  try {
    // Validate data structure
    if (!vocabularyData.id) {
      vocabularyData.id = `${vocabularyData.type || 'vocabulary'}-${uuidv4()}`;
    }

    if (!vocabularyData.timestamp) {
      vocabularyData.timestamp = new Date().toISOString();
    }

    // Create a filename based on the theme if it's a vocabulary set, otherwise use ID
    let fileName;
    if (vocabularyData.type === 'vocabulary_set' && vocabularyData.theme) {
      // Sanitize theme for use in filename
      const sanitizedTheme = vocabularyData.theme
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .substring(0, 50) // Limit length
        .toLowerCase();

      // Check if the theme is too generic or contains placeholder text
      const genericThemePattern = /(unique-identifier|thematic connection|placeholder|timestamp|example|with-timestamp)/i;
      if (sanitizedTheme && !genericThemePattern.test(sanitizedTheme)) {
        fileName = `${sanitizedTheme}_${vocabularyData.id.replace(/[^a-zA-Z0-9-]/g, '_')}.json`;
      } else {
        // If theme is generic, use a random hash
        const randomHash = Math.random().toString(36).substring(2, 10);
        fileName = `vocabulary_set_${randomHash}_${vocabularyData.id.replace(/[^a-zA-Z0-9-]/g, '_')}.json`;
      }
    } else {
      // If no theme is provided (for vocabulary sets), generate a random hash as filename
      if (vocabularyData.type === 'vocabulary_set') {
        const randomHash = Math.random().toString(36).substring(2, 10);
        fileName = `vocabulary_set_${randomHash}_${vocabularyData.id.replace(/[^a-zA-Z0-9-]/g, '_')}.json`;
      } else {
        fileName = `${vocabularyData.id.replace(/[^a-zA-Z0-9-]/g, '_')}.json`;
      }
    }

    // If username is provided, save to user-specific directory
    const userDir = username ? path.join(dataDir, username) : dataDir;

    // Create user directory if it doesn't exist
    if (username) {
      if (!await fileExists(userDir)) {
        await fs.mkdir(userDir, { recursive: true });
      }
    }

    const filePath = path.join(userDir, fileName);

    // Write the data to the file
    await fs.writeFile(filePath, JSON.stringify(vocabularyData, null, 2), 'utf8');

    return filePath;
  } catch (error) {
    console.error('Error saving vocabulary set:', error);
    throw error;
  }
}

/**
 * Load a specific vocabulary set by ID
 */
async function loadVocabularySetById(dataDir, id, username = null) {
  try {
    // If username is provided, use user-specific directory
    const userDir = username ? path.join(dataDir, username) : dataDir;

    // Create user directory if it doesn't exist
    if (username) {
      if (!await fileExists(userDir)) {
        await fs.mkdir(userDir, { recursive: true });
      }
    }

    const files = await fs.readdir(userDir);

    // Do a full scan of all JSON files to find the matching ID
    // This is the most reliable method since filename parsing can be tricky
    for (const file of files) {
      if (path.extname(file) === '.json') {
        try {
          const filePath = path.join(userDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const data = JSON.parse(content);

          if (data.id === id) {
            return data;
          }
        } catch (parseError) {
          // Skip files that can't be parsed as JSON
          console.warn(`Warning: Could not parse JSON file ${file}:`, parseError.message);
          continue;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error loading vocabulary set by ID:', error);
    throw error;
  }
}

/**
 * Load data from a specific file
 */
async function loadData(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

/**
 * Save data to a specific file
 */
async function saveData(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

/**
 * Find the file path for a vocabulary set by ID
 * This function can be used for update and delete operations
 */
async function findVocabularySetFilePathById(dataDir, id) {
  try {
    const files = await fs.readdir(dataDir);

    // Do a full scan of all JSON files to find the matching ID
    // This is the most reliable method since filename parsing can be tricky
    for (const file of files) {
      if (path.extname(file) === '.json') {
        try {
          const filePath = path.join(dataDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const data = JSON.parse(content);

          if (data.id === id) {
            return filePath;
          }
        } catch (parseError) {
          // Skip files that can't be parsed as JSON
          console.warn(`Warning: Could not parse JSON file ${file}:`, parseError.message);
          continue;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding vocabulary set file path by ID:', error);
    throw error;
  }
}

/**
 * Maintains a long-term summary of all vocabulary sets
 * Creates a consolidated dictionary with themes, words, and definitions
 */
async function updateVocabularySummary(dataDir, username = null) {
  try {
    // Load all vocabulary sets for the specific user
    const allVocabularySets = await loadAllVocabularySets(dataDir, username);

    // If username is provided, use user-specific directory
    const userDir = username ? path.join(dataDir, username) : dataDir;

    // Create a consolidated summary
    const summary = {
      timestamp: new Date().toISOString(),
      totalVocabularySets: allVocabularySets.length,
      themes: {},
      wordCount: 0
    };

    // Process each vocabulary set
    for (const vocabSet of allVocabularySets) {
      const theme = vocabSet.theme || 'Uncategorized';
      const setId = vocabSet.id;

      // Initialize theme in summary if not exists
      if (!summary.themes[theme]) {
        summary.themes[theme] = {
          id: setId,
          vocabularySets: [],
          words: []
        };
      }

      // Add vocabulary set to this theme
      summary.themes[theme].vocabularySets.push({
        id: setId,
        timestamp: vocabSet.timestamp
      });

      // Add words from this set to the theme
      if (Array.isArray(vocabSet.words)) {
        for (const wordObj of vocabSet.words) {
          // Add word to theme's word list
          summary.themes[theme].words.push({
            word: wordObj.word,
            partOfSpeech: wordObj.partOfSpeech,
            chineseDefinition: wordObj.chineseDefinition,
            memoryAid: wordObj.memoryAid,
            examples: wordObj.examples,
            fromSet: setId
          });
          summary.wordCount++;
        }
      }
    }

    // Save the summary to a file
    const summaryPath = path.join(userDir, 'vocabulary_summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

    return summaryPath;
  } catch (error) {
    console.error('Error updating vocabulary summary:', error);
    throw error;
  }
}

/**
 * Load the vocabulary summary
 */
async function loadVocabularySummary(dataDir, username = null) {
  try {
    // If username is provided, use user-specific directory
    const userDir = username ? path.join(dataDir, username) : dataDir;

    const summaryPath = path.join(userDir, 'vocabulary_summary.json');

    if (!await fileExists(summaryPath)) {
      // If summary doesn't exist, create it
      await updateVocabularySummary(dataDir, username);
    }

    const content = await fs.readFile(summaryPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading vocabulary summary:', error);
    // If there's an error, try to create a new summary
    await updateVocabularySummary(dataDir, username);
    const content = await fs.readFile(path.join(userDir, 'vocabulary_summary.json'), 'utf8');
    return JSON.parse(content);
  }
}

/**
 * Helper function to check if a file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all words for a specific theme to prevent duplicates
 */
async function getWordsForTheme(dataDir, theme, username = null) {
  try {
    const summary = await loadVocabularySummary(dataDir, username);

    if (summary.themes && summary.themes[theme]) {
      return summary.themes[theme].words.map(wordObj => wordObj.word);
    }

    return [];
  } catch (error) {
    console.error('Error getting words for theme:', error);
    return [];
  }
}

/**
 * Get all available themes
 */
async function getAllThemes(dataDir, username = null) {
  try {
    const summary = await loadVocabularySummary(dataDir, username);

    if (summary.themes) {
      return Object.keys(summary.themes);
    }

    return [];
  } catch (error) {
    console.error('Error getting all themes:', error);
    return [];
  }
}

module.exports = {
  loadData,
  saveData,
  loadAllVocabularySets,
  saveVocabularySet,
  loadVocabularySetById,
  findVocabularySetFilePathById,
  updateVocabularySummary,
  loadVocabularySummary,
  getWordsForTheme,
  getAllThemes
};