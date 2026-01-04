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
 * @returns {Promise<Object>} Generated vocabulary data
 */
async function generateVocabulary(userInput, existingWords = []) {
  try {
    // Determine the type of request
    let prompt;

    if (userInput === "Learn Some Words" || userInput === "new") {
      // Generate a new vocabulary set
      const existingWordsText = existingWords.length > 0 ? `IMPORTANT: DO NOT include the following words that have already been generated for this theme: ${existingWords.join(', ')}. ` : '';
      prompt = `You are an advanced English vocabulary tutor that generates structured JSON data for vocabulary learning applications. Your task is to generate a vocabulary set in the specified JSON format.

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
  "words": [
    {
      "word": "example_word",
      "partOfSpeech": "noun/verb/adjective/adverb/preposition/conjunction/pronoun/determiner",
      "chineseDefinition": "精确的中文释义，体现词汇在特定领域的含义",
      "memoryAid": "具体的记忆辅助方法，如词根词缀分析、联想记忆法、对比记忆法等",
      "examples": [
        {
          "sentence": "学术语境下的英文例句，体现词汇的专业用法",
          "chineseTranslation": "与英文例句完全对应的中文翻译"
        }
      ]
    }
  ],
  "story": {
    "english": "连贯的叙事性故事或论述，必须自然地融入全部10个词汇，形成一个完整的语境",
    "chinese": "与英文故事完全对应的中文翻译，确保10个词汇的中文释义在语境中得到体现"
  },
  "reviewStatus": "new"
}

Ensure the vocabulary words are advanced, have tight thematic coherence within a specialized domain, and serve distinct but related roles. Each word should have:
- A precise part of speech that reflects its specific usage in the domain
- A Chinese definition that captures the nuanced meaning in the specific context
- A memory aid that offers a specific technique for retention (etymology, association, contrast, etc.)
- An example sentence that demonstrates the word's usage in an academic or professional context

The mini-narrative story must seamlessly integrate ALL 10 vocabulary words into a coherent narrative or discussion that exemplifies the theme. Each word should feel naturally placed, not forced, and contribute to the overall meaning of the story. The story should demonstrate how these specialized terms interconnect within the specific domain. Most importantly, replace "PRECISE PRIMARY CATEGORY: SECONDARY SUB-CATEGORY" with a specific and extremely narrow topic that combines both a primary category and a detailed sub-category. Do NOT include timestamp in the JSON response - this will be added by the system automatically. Do NOT use generic themes like "Technology and Innovation" or placeholder text like "thematic connection of the words".`;
    } else if (userInput.startsWith("Learn Some Words: ") || userInput.startsWith("学习: ")) {
      // Extract the keywords from the user input
      const keywords = userInput.includes(": ") ? userInput.split(": ")[1] : userInput;
      // Generate a new vocabulary set based on user keywords
      const existingWordsText = existingWords.length > 0 ? `IMPORTANT: DO NOT include the following words that have already been generated for this theme: ${existingWords.join(', ')}. ` : '';
      prompt = `You are an advanced English vocabulary tutor that generates structured JSON data for vocabulary learning applications. Your task is to generate a vocabulary set in the specified JSON format.

${existingWordsText}Generate a new set of 10 advanced vocabulary words with a highly specific and focused theme based on the following keywords: ${keywords}. The words should be tightly connected within a narrow domain related to these keywords and serve distinct but complementary roles (not synonyms).

Respond ONLY with valid JSON in this format:
{
  "type": "vocabulary_set",
  "id": "vocabulary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}",
  "theme": "THEME BASED ON: ${keywords}",
  "words": [
    {
      "word": "example_word",
      "partOfSpeech": "noun/verb/adjective/adverb/preposition/conjunction/pronoun/determiner",
      "chineseDefinition": "精确的中文释义，体现词汇在特定领域的含义",
      "memoryAid": "具体的记忆辅助方法，如词根词缀分析、联想记忆法、对比记忆法等",
      "examples": [
        {
          "sentence": "学术语境下的英文例句，体现词汇的专业用法",
          "chineseTranslation": "与英文例句完全对应的中文翻译"
        }
      ]
    }
  ],
  "story": {
    "english": "连贯的叙事性故事或论述，必须自然地融入全部10个词汇，形成一个完整的语境",
    "chinese": "与英文故事完全对应的中文翻译，确保10个词汇的中文释义在语境中得到体现"
  },
  "reviewStatus": "new"
}

Ensure the vocabulary words are advanced, have tight thematic coherence within a specialized domain related to the provided keywords, and serve distinct but related roles. Each word should have:
- A precise part of speech that reflects its specific usage in the domain
- A Chinese definition that captures the nuanced meaning in the specific context
- A memory aid that offers a specific technique for retention (etymology, association, contrast, etc.)
- An example sentence that demonstrates the word's usage in an academic or professional context

The mini-narrative story must seamlessly integrate ALL 10 vocabulary words into a coherent narrative or discussion that exemplifies the theme based on the provided keywords. Each word should feel naturally placed, not forced, and contribute to the overall meaning of the story. The story should demonstrate how these specialized terms interconnect within the specific domain. Most importantly, make the theme relevant to the provided keywords. Do NOT include timestamp in the JSON response - this will be added by the system automatically. Do NOT use generic themes like "Technology and Innovation" or placeholder text like "thematic connection of the words".`;
    } else {
      // Generate a breakdown for a specific word
      prompt = `You are an advanced English vocabulary tutor that generates structured JSON data for vocabulary learning applications. Your task is to provide a detailed breakdown of the word: "${userInput}".

Respond ONLY with valid JSON in this format:
{
  "type": "word_breakdown",
  "id": "breakdown-unique-identifier",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "word": "requested_word",
  "breakdown": {
    "pronunciation": "/ɪɡˈzæmpəl/", // IPA format
    "partOfSpeech": "noun/verb/adjective/etc.",
    "meanings": [
      {
        "definition": "English definition",
        "chinese": "中文释义",
        "usageContext": "Usage context description"
      }
    ],
    "etymology": "词源与构词分析",
    "memoryTips": "记忆技巧",
    "examples": [
      {
        "sentence": "Formal academic example sentence",
        "chineseTranslation": "正式语境中文翻译"
      },
      {
        "sentence": "Advanced conversational example",
        "chineseTranslation": "口语化中文翻译"
      }
    ],
    "collocations": [
      {
        "phrase": "common phrase or collocation",
        "chinese": "中文注解"
      }
    ],
    "nearbyWords": [
      {
        "word": "similar or related word",
        "distinction": "与原词的区别"
      }
    ]
  }
}

Provide a comprehensive breakdown of the requested word.`;
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
          max_tokens: 2000,
        });

        // Extract the response content
        const responseContent = response.choices[0].message.content;

        // Attempt to parse the JSON response
        let parsedData;
        try {
          // Find JSON in the response (in case there's any extra text)
          const jsonStart = responseContent.indexOf('{');
          const jsonEnd = responseContent.lastIndexOf('}') + 1;
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
                  chineseDefinition: word.chineseDefinition || 'Definition not available',
                  memoryAid: word.memoryAid || 'No memory aid',
                  examples: word.examples || []
                };

                return validatedWord;
              })
              .filter(word => {
                // Check if this word has valid content (not placeholder or generic)
                const hasValidWord = word.word && word.word !== 'Unknown Word' && word.word.trim() !== '';
                const hasValidDefinition = word.chineseDefinition &&
                                          word.chineseDefinition !== 'Definition not available' &&
                                          word.chineseDefinition.trim() !== '' &&
                                          !word.chineseDefinition.toLowerCase().includes('not available') &&
                                          !word.chineseDefinition.toLowerCase().includes('definition not available');

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
                chineseDefinition: word.chineseDefinition || 'Definition not available',
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

  // Validate based on type
  if (vocabularyData.type === 'vocabulary_set') {
    // Check if we have valid vocabulary data
    if (!vocabularyData.theme ||
        !Array.isArray(vocabularyData.words) ||
        !vocabularyData.story ||
        !vocabularyData.story.english ||
        !vocabularyData.story.chinese) {
      return false;
    }

    // Check if we have at least 5 valid words with proper definitions
    const validWords = vocabularyData.words.filter(word => {
      return word.word &&
             word.word.trim() !== '' &&
             word.chineseDefinition &&
             word.chineseDefinition.trim() !== '' &&
             word.chineseDefinition !== 'Definition not available' &&
             !word.chineseDefinition.toLowerCase().includes('not available') &&
             !word.chineseDefinition.toLowerCase().includes('definition not available');
    });

    return validWords.length >= 5;
  } else if (vocabularyData.type === 'word_breakdown') {
    return Boolean(vocabularyData.word &&
           vocabularyData.breakdown &&
           vocabularyData.breakdown.pronunciation &&
           vocabularyData.breakdown.partOfSpeech &&
           Array.isArray(vocabularyData.breakdown.meanings) &&
           vocabularyData.breakdown.meanings.length > 0 &&
           vocabularyData.breakdown.etymology &&
           vocabularyData.breakdown.memoryTips);
  }

  return false;
}

module.exports = {
  generateVocabulary,
  validateVocabularyData
};