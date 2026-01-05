require('dotenv').config();

// Initialize Qwen client
let qwenClient;
// Use the existing environment variables you have set
const apiKey = process.env.DASHSCOPE_API_KEY || process.env.OPENAI_API_KEY || process.env.QWEN_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || process.env.OPENAI_ENDPOINT || "https://dashscope.aliyuncs.com/compatible-mode/v1";

if (apiKey && process.env.NODE_ENV !== 'test') {
  // For Qwen API, using the modern OpenAI client
  const { OpenAI } = require("openai");

  qwenClient = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });
} else {
  // For testing or missing API key, create a mock client
  qwenClient = {
    chat: {
      completions: {
        create: async () => {
          if (process.env.NODE_ENV === 'test') {
            // Return a mock response for testing
            return {
              choices: [{
                message: {
                  content: JSON.stringify({
                    type: "vocabulary_set",
                    id: "test-vocabulary-123",
                    timestamp: new Date().toISOString(),
                    theme: "Advanced Technology and Innovation",
                    words: [
                      {
                        word: "serendipity",
                        partOfSpeech: "noun",
                        chineseDefinition: "意外发现",
                        memoryAid: "Finding good things by chance",
                        examples: [
                          {
                            sentence: "Finding this book was pure serendipity.",
                            chineseTranslation: "发现这本书完全是意外之喜。"
                          }
                        ]
                      }
                    ],
                    story: {
                      english: "Serendipity led her to the perfect book.",
                      chinese: "意外之喜让她找到了完美的书。"
                    },
                    reviewStatus: "new"
                  })
                }
              }]
            };
          } else {
            throw new Error('API key not set. Please set DASHSCOPE_API_KEY, OPENAI_API_KEY, or QWEN_API_KEY environment variable.');
          }
        }
      }
    }
  };
}

/**
 * Generate vocabulary set based on user request
 * @param {string} userInput - User's input (e.g., "Learn Some Words", "new", or specific word)
 * @param {Array} existingWords - Array of existing words to avoid duplicates
 * @param {string} language - Target language for generation (default: 'en')
 * @returns {Promise<Object>} Generated vocabulary data
 */
async function generateVocabulary(userInput, existingWords = [], language = 'en') {
  try {
    // Determine the type of request
    let prompt;

    // Define language-specific instructions
    let languageInstruction = '';
    let languageExample = '';
    let languageDefinitionField = 'chineseDefinition';
    let languageStoryField = 'chinese';
    let languageTranslationField = 'chineseTranslation';
    let languageBreakdownFields = {
      definition: 'chinese',
      example: 'chineseTranslation',
      etymology: '词源与构词分析',
      memoryTips: '记忆技巧',
      collocation: '中文注解',
      distinction: '与原词的区别'
    };

    switch(language) {
      case 'es':
        languageInstruction = 'IMPORTANT: Generate vocabulary in Spanish context. The English words should remain as they are, and example sentences should be in Spanish. However, all definitions, memory aids, and explanations should be in Chinese. The story should also be in Chinese.';
        languageExample = 'Spanish example sentence';
        languageDefinitionField = 'chineseDefinition';
        languageStoryField = 'chinese';
        languageTranslationField = 'spanishTranslation';
        languageBreakdownFields = {
          definition: 'chinese',
          example: 'spanishTranslation',
          etymology: '词源与构词分析',
          memoryTips: '记忆技巧',
          collocation: '中文注解',
          distinction: '与原词的区别'
        };
        break;
      case 'ja':
        languageInstruction = 'IMPORTANT: Generate vocabulary in Japanese context. The English words should remain as they are, and example sentences should be in Japanese. However, all definitions, memory aids, and explanations should be in Chinese. The story should also be in Chinese.';
        languageExample = 'Japanese example sentence';
        languageDefinitionField = 'chineseDefinition';
        languageStoryField = 'chinese';
        languageTranslationField = 'japaneseTranslation';
        languageBreakdownFields = {
          definition: 'chinese',
          example: 'japaneseTranslation',
          etymology: '词源与构词分析',
          memoryTips: '记忆技巧',
          collocation: '中文注解',
          distinction: '与原词的区别'
        };
        break;
      default: // English
        languageInstruction = 'IMPORTANT: Generate vocabulary in English context. The definitions, memory aids, and examples should be in Chinese.';
        languageExample = 'Academic context English example sentence';
        languageDefinitionField = 'chineseDefinition';
        languageStoryField = 'chinese';
        languageTranslationField = 'chineseTranslation';
        languageBreakdownFields = {
          definition: 'chinese',
          example: 'chineseTranslation',
          etymology: '词源与构词分析',
          memoryTips: '记忆技巧',
          collocation: '中文注解',
          distinction: '与原词的区别'
        };
    }

    if (userInput === "Learn Some Words" || userInput === "new") {
      // Generate a new vocabulary set
      const existingWordsText = existingWords.length > 0 ? `IMPORTANT: DO NOT include the following words that have already been generated for this theme: ${existingWords.join(', ')}. ` : '';
      prompt = `You are an advanced vocabulary tutor that generates structured JSON data for vocabulary learning applications. Your task is to generate a vocabulary set in the specified JSON format.

${languageInstruction}
${existingWordsText}Generate a new set of 10 advanced vocabulary words with a highly specific and focused theme. The words should be tightly connected within a narrow domain and serve distinct but complementary roles (not synonyms). Choose a precise and nuanced theme that includes both a primary category and a secondary sub-category. Primary categories include: "Computer Science", "Biological Sciences", "Physical Sciences", "Social Sciences", "Health Sciences", "Engineering", "Business & Economics", "Arts & Humanities", "Environmental Sciences", "Mathematics & Statistics", "Psychology & Cognitive Science", "Law & Justice", "Education", "Medicine", "Agriculture & Food Sciences". Secondary sub-categories should be extremely specific, such as:
- Computer Science: "Transformer Architecture in Neural Networks", "Homomorphic Encryption Techniques", "Quantum Computing Error Correction", "Differential Privacy Mechanisms", "Federated Learning Protocols", "Graph Neural Network Applications", "Probabilistic Programming Languages", "Blockchain Consensus Algorithms", "Edge Computing Resource Allocation", "Explainable AI Methods"
- Biological Sciences: "CRISPR-Cas9 Gene Editing Off-Target Effects", "Mitochondrial DNA Inheritance Patterns", "Protein Folding Thermodynamics", "Microbiome-Gut-Brain Axis", "Epigenetic Modifications in Cancer", "Neural Stem Cell Differentiation", "Photosystem II Electron Transport", "Synaptic Vesicle Trafficking", "Apoptosis Signaling Pathways", "Telomerase Activity Regulation"
- Physical Sciences: "Superconducting Qubit Coherence Times", "Dark Matter Detection Techniques", "Quantum Entanglement Verification", "Nuclear Fusion Plasma Confinement", "Gravitational Wave Polarization", "Topological Insulator Properties", "Muon g-2 Anomaly", "Higgs Boson Decay Channels", "Quantum Hall Effect Variants", "Neutrino Oscillation Parameters"
- Social Sciences: "Prospect Theory Framing Effects", "Cognitive Dissonance Reduction", "Social Identity Threat Mechanisms", "Nudge Theory Applications", "Game Theory Nash Equilibrium", "Behavioral Economics Heuristics", "Cultural Dimensions Power Distance", "Social Capital Bridging vs Bonding", "Motivated Reasoning Processes", "Selective Exposure in Media Consumption"
- Health Sciences: "Immunotherapy Checkpoint Inhibitors", "Pharmacokinetics Drug Metabolism", "Metagenomics Microbiome Analysis", "Precision Medicine Biomarkers", "Healthcare Economics Cost-Effectiveness", "Medical Imaging AI Diagnostics", "Neuroplasticity Rehabilitation", "Vaccine Adjuvant Mechanisms", "Antimicrobial Resistance Evolution", "Mental Health Digital Therapeutics"

Respond ONLY with valid JSON in this format:
{
  "type": "vocabulary_set",
  "id": "vocabulary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}",
  "theme": "PRECISE PRIMARY CATEGORY: SECONDARY SUB-CATEGORY",
  "language": "${language}",
  "words": [
    {
      "word": "example_word",
      "partOfSpeech": "noun/verb/adjective/adverb/preposition/conjunction/pronoun/determiner",
      "chineseDefinition": "Definition in Chinese",
      "memoryAid": "Memory aid in Chinese",
      "examples": [
        {
          "sentence": "${languageExample}",
          "${languageTranslationField}": "Translation in ${language}"
        }
      ]
    }
  ],
  "story": {
    "english": "Coherent narrative or discussion that must naturally incorporate all 10 vocabulary words, forming a complete context",
    "chinese": "Story in Chinese"
  },
  "reviewStatus": "new"
}

Ensure the vocabulary words are advanced, have tight thematic coherence within a specialized domain, and serve distinct but related roles. Each word should have:
- A precise part of speech that reflects its specific usage in the domain
- A definition in Chinese that captures the nuanced meaning in the specific context
- A memory aid in Chinese that offers a specific technique for retention using letter/syllable decomposition - break the word into its components and assign visual/associative meanings to each part (e.g., "CRISPR" could be broken down as C=cell, R=RNA, I=interaction, S=system, P=protein, R=repair). This should be a technique to help remember the word, not an explanation of the word's meaning
- An example sentence in ${language} that demonstrates the word's usage in an academic or professional context with translation in ${language}

The mini-narrative story must seamlessly integrate ALL 10 vocabulary words into a coherent narrative or discussion that exemplifies the theme. Each word should feel naturally placed, not forced, and contribute to the overall meaning of the story. The story should demonstrate how these specialized terms interconnect within the specific domain. Most importantly, replace "PRECISE PRIMARY CATEGORY: SECONDARY SUB-CATEGORY" with a specific and extremely narrow topic that combines both a primary category and a detailed sub-category. Do NOT include timestamp in the JSON response - this will be added by the system automatically. Do NOT use generic themes like "Technology and Innovation" or placeholder text like "thematic connection of the words".`;
    } else if (userInput.startsWith("Learn Some Words: ") || userInput.startsWith("学习: ")) {
      // Extract the keywords from the user input
      const keywords = userInput.includes(": ") ? userInput.split(": ")[1] : userInput;
      // Generate a new vocabulary set based on user keywords
      const existingWordsText = existingWords.length > 0 ? `IMPORTANT: DO NOT include the following words that have already been generated for this theme: ${existingWords.join(', ')}. ` : '';
      prompt = `You are an advanced vocabulary tutor that generates structured JSON data for vocabulary learning applications. Your task is to generate a vocabulary set in the specified JSON format.

${languageInstruction}
${existingWordsText}Generate a new set of 10 advanced vocabulary words with a highly specific and focused theme based on the following keywords: ${keywords}. The words should be tightly connected within a narrow domain related to these keywords and serve distinct but complementary roles (not synonyms).

Respond ONLY with valid JSON in this format:
{
  "type": "vocabulary_set",
  "id": "vocabulary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}",
  "theme": "THEME BASED ON: ${keywords}",
  "language": "${language}",
  "words": [
    {
      "word": "example_word",
      "partOfSpeech": "noun/verb/adjective/adverb/preposition/conjunction/pronoun/determiner",
      "chineseDefinition": "Definition in Chinese",
      "memoryAid": "Memory aid in Chinese",
      "examples": [
        {
          "sentence": "${languageExample}",
          "${languageTranslationField}": "Translation in ${language}"
        }
      ]
    }
  ],
  "story": {
    "english": "Coherent narrative or discussion that must naturally incorporate all 10 vocabulary words, forming a complete context",
    "chinese": "Story in Chinese"
  },
  "reviewStatus": "new"
}

Ensure the vocabulary words are advanced, have tight thematic coherence within a specialized domain related to the provided keywords, and serve distinct but related roles. Each word should have:
- A precise part of speech that reflects its specific usage in the domain
- A definition in Chinese that captures the nuanced meaning in the specific context
- A memory aid in Chinese that offers a specific technique for retention using letter/syllable decomposition - break the word into its components and assign visual/associative meanings to each part (e.g., "CRISPR" could be broken down as C=cell, R=RNA, I=interaction, S=system, P=protein, R=repair). This should be a technique to help remember the word, not an explanation of the word's meaning
- An example sentence in ${language} that demonstrates the word's usage in an academic or professional context with translation in ${language}

The mini-narrative story must seamlessly integrate ALL 10 vocabulary words into a coherent narrative or discussion that exemplifies the theme based on the provided keywords. Each word should feel naturally placed, not forced, and contribute to the overall meaning of the story. The story should demonstrate how these specialized terms interconnect within the specific domain. Most importantly, make the theme relevant to the provided keywords. Do NOT include timestamp in the JSON response - this will be added by the system automatically. Do NOT use generic themes like "Technology and Innovation" or placeholder text like "thematic connection of the words".`;
    } else {
      // Generate a breakdown for a specific word
      prompt = `You are an advanced vocabulary tutor that generates structured JSON data for vocabulary learning applications. Your task is to provide a detailed breakdown of the word: "${userInput}".

${languageInstruction}

Respond ONLY with valid JSON in this format:
{
  "type": "word_breakdown",
  "id": "breakdown-unique-identifier",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "word": "requested_word",
  "language": "${language}",
  "breakdown": {
    "pronunciation": "/ɪɡˈzæmpəl/", // IPA format
    "partOfSpeech": "noun/verb/adjective/etc.",
    "meanings": [
      {
        "definition": "English definition",
        "chinese": "Definition in Chinese",
        "usageContext": "Usage context description in Chinese"
      }
    ],
    "etymology": "词源与构词分析",
    "memoryTips": "记忆技巧",
    "examples": [
      {
        "sentence": "Example sentence in ${language}",
        "${languageBreakdownFields.example}": "Example in ${language}"
      },
      {
        "sentence": "Another example sentence in ${language}",
        "${languageBreakdownFields.example}": "Example in ${language}"
      }
    ],
    "collocations": [
      {
        "phrase": "common phrase or collocation in ${language}",
        "中文注解": "Explanation in Chinese"
      }
    ],
    "nearbyWords": [
      {
        "word": "similar or related word",
        "与原词的区别": "Distinction from the original word"
      }
    ]
  }
}

Provide a comprehensive breakdown of the requested word.

IMPORTANT: The memoryTips field should contain specific techniques to help remember the word, not just explanations of the word's meaning. Use techniques like letter/syllable decomposition - break the word into its components and assign visual/associative meanings to each part (e.g., "CRISPR" could be broken down as C=cell, R=RNA, I=interaction, S=system, P=protein, R=repair).`;
    }

    // Try up to 3 times to get valid data
    let attempts = 0;
    const maxAttempts = 3;
    let jsonData;

    while (attempts < maxAttempts) {
      attempts++;

      try {
        // Use Qwen API to generate vocabulary
        const response = await qwenClient.chat.completions.create({
          model: "qwen-max", // Use qwen-max as requested
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 4000, // Increase token limit to handle larger responses
        });

        // Extract the response content
        const responseContent = response.choices[0].message.content;

        // Attempt to parse the JSON response
        let parsedData;
        try {
          // Find JSON in the response (in case there's any extra text)
          const jsonStart = responseContent.indexOf('{');
          if (jsonStart === -1) {
            throw new Error('No JSON object found in response');
          }

          // Find the matching closing brace by counting braces
          let braceCount = 0;
          let jsonEnd = -1;
          for (let i = jsonStart; i < responseContent.length; i++) {
            if (responseContent[i] === '{') {
              braceCount++;
            } else if (responseContent[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                jsonEnd = i + 1;
                break;
              }
            }
          }

          if (jsonEnd === -1) {
            throw new Error('Unable to find complete JSON object in response');
          }

          const jsonString = responseContent.substring(jsonStart, jsonEnd);
          parsedData = JSON.parse(jsonString);
        } catch (parseError) {
          console.error(`Attempt ${attempts}: Error parsing JSON from AI response:`, parseError);
          console.log('Raw response:', responseContent);
          if (attempts >= maxAttempts) throw new Error('Invalid JSON response from AI');
          continue; // Retry
        }

        // Add timestamp (this should always be added by the system, not the AI)
        parsedData.timestamp = new Date().toISOString();

        // Add ID if not present
        if (!parsedData.id) {
          const prefix = parsedData.type === 'vocabulary_set' ? 'vocabulary' : 'breakdown';
          parsedData.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        // Validate the data structure and ensure required fields exist
        if (parsedData.type === 'vocabulary_set' && parsedData.words) {
          // Check if the data meets our requirements (skip in test mode)
          if (process.env.NODE_ENV !== 'test') {
            let validWordsCount = 0;

            // First, apply defaults and filter out invalid words
            parsedData.words = parsedData.words
              .map(word => {
                // Ensure all required fields exist
                const validatedWord = {
                  word: word.word || 'Unknown Word',
                  partOfSpeech: word.partOfSpeech || 'Unknown',
                  [languageDefinitionField]: word[languageDefinitionField] || 'Definition not available',
                  memoryAid: word.memoryAid || 'No memory aid',
                  examples: word.examples || []
                };

                return validatedWord;
              })
              .filter(word => {
                // Check if this word has valid content (not placeholder or generic)
                const hasValidWord = word.word && word.word !== 'Unknown Word' && word.word.trim() !== '';
                const hasValidDefinition = word[languageDefinitionField] &&
                                          word[languageDefinitionField] !== 'Definition not available' &&
                                          word[languageDefinitionField].trim() !== '' &&
                                          !word[languageDefinitionField].toLowerCase().includes('not available') &&
                                          !word[languageDefinitionField].toLowerCase().includes('definition not available');

                if (hasValidWord && hasValidDefinition) {
                  validWordsCount++;
                  return true;
                }
                return false; // Filter out invalid words
              });

            // Check if we have enough valid words (at least 5 for a meaningful set)
            if (validWordsCount < 5) {
              console.log(`Attempt ${attempts}: Only ${validWordsCount} valid words found after filtering, retrying...`);
              if (attempts >= maxAttempts) {
                // If this is the last attempt, return what we have (but it might be incomplete)
                console.log(`Max attempts reached. Returning ${validWordsCount} valid words.`);
                break;
              }
              continue; // Retry
            }
          } else {
            // In test mode, just apply the field defaults without validation
            parsedData.words = parsedData.words.map(word => {
              return {
                word: word.word || 'Unknown Word',
                partOfSpeech: word.partOfSpeech || 'Unknown',
                [languageDefinitionField]: word[languageDefinitionField] || 'Definition not available',
                memoryAid: word.memoryAid || 'No memory aid',
                examples: word.examples || []
              };
            });
          }
        }

        jsonData = parsedData;
        break; // Success, exit the retry loop
      } catch (attemptError) {
        console.error(`Attempt ${attempts} failed:`, attemptError.message);
        if (attempts >= maxAttempts) {
          throw attemptError; // Re-throw if max attempts reached
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    return jsonData;
  } catch (error) {
    console.error('Error generating vocabulary:', error);
    throw error;
  }
}

/**
 * Validate the generated vocabulary data against our schema
 * @param {Object} vocabularyData - The generated vocabulary data
 * @returns {boolean} Whether the data is valid
 */
function validateVocabularyData(vocabularyData) {
  // Basic validation
  if (!vocabularyData || !vocabularyData.type || !vocabularyData.id) {
    return false;
  }

  // Determine the language-specific field to check
  const language = vocabularyData.language || 'en';
  let definitionField = 'chineseDefinition';

  switch(language) {
    case 'es':
      definitionField = 'chineseDefinition';
      break;
    case 'ja':
      definitionField = 'chineseDefinition';
      break;
    default:
      definitionField = 'chineseDefinition';
  }

  // Validate based on type
  if (vocabularyData.type === 'vocabulary_set') {
    // Check if we have valid vocabulary data
    if (!vocabularyData.theme ||
        !Array.isArray(vocabularyData.words) ||
        !vocabularyData.story ||
        !vocabularyData.story.english) {
      return false;
    }

    // Check if we have at least 5 valid words with proper definitions
    const validWords = vocabularyData.words.filter(word => {
      // For all languages, the definition field should be 'chineseDefinition' as specified in the prompt
      const definitionField = 'chineseDefinition';
      if (word[definitionField] &&
          word[definitionField].trim() !== '' &&
          word[definitionField] !== 'Definition not available' &&
          !word[definitionField].toLowerCase().includes('not available') &&
          !word[definitionField].toLowerCase().includes('definition not available')) {
        return word.word &&
               word.word.trim() !== '';
      }

      return false;
    });

    return validWords.length >= 5;
  } else if (vocabularyData.type === 'word_breakdown') {
    return Boolean(vocabularyData.word &&
           vocabularyData.breakdown &&
           vocabularyData.breakdown.pronunciation &&
           vocabularyData.breakdown.partOfSpeech &&
           Array.isArray(vocabularyData.breakdown.meanings) &&
           vocabularyData.breakdown.meanings.length > 0);
  }

  return false;
}

module.exports = {
  generateVocabulary,
  validateVocabularyData
};