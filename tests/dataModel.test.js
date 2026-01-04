const Ajv = require('ajv');
const { vocabularySetSchema, wordBreakdownSchema } = require('../dataModel');

// Create AJV instance for JSON schema validation
const ajv = new Ajv();

describe('Data Model Schemas', () => {
  test('vocabularySetSchema validates correct vocabulary set structure', () => {
    const validate = ajv.compile(vocabularySetSchema);
    
    const validVocabularySet = {
      type: "vocabulary_set",
      id: "vocabulary-set-123",
      timestamp: "2024-01-01T00:00:00.000Z",
      theme: "Technology and Innovation",
      words: [
        {
          word: "innovative",
          partOfSpeech: "adjective",
          chineseDefinition: "创新的",
          memoryAid: "in + nova (new) + tive",
          examples: [
            {
              sentence: "The company is known for its innovative approach.",
              chineseTranslation: "这家公司以其创新的方法而闻名。"
            }
          ]
        }
      ],
      story: {
        english: "Innovative companies drive technological advancement.",
        chinese: "创新公司推动技术进步。"
      },
      reviewStatus: "new"
    };

    const valid = validate(validVocabularySet);
    expect(valid).toBe(true);
  });

  test('vocabularySetSchema rejects invalid vocabulary set', () => {
    const validate = ajv.compile(vocabularySetSchema);
    
    const invalidVocabularySet = {
      type: "vocabulary_set",
      // Missing required fields
    };

    const valid = validate(invalidVocabularySet);
    expect(valid).toBe(false);
  });

  test('wordBreakdownSchema validates correct word breakdown structure', () => {
    const validate = ajv.compile(wordBreakdownSchema);
    
    const validWordBreakdown = {
      type: "word_breakdown",
      id: "breakdown-123",
      timestamp: "2024-01-01T00:00:00.000Z",
      word: "ephemeral",
      breakdown: {
        pronunciation: "/ɪˈfemərəl/",
        partOfSpeech: "adjective",
        meanings: [
          {
            definition: "lasting for a very short time",
            chinese: "短暂的",
            usageContext: "often used to describe beauty or experiences"
          }
        ],
        etymology: "From Greek 'ephemeros' meaning 'lasting a day'",
        memoryTips: "epi + hemera (day) = lasting one day",
        examples: [
          {
            sentence: "The ephemeral beauty of cherry blossoms",
            chineseTranslation: "樱花的短暂美丽"
          }
        ],
        collocations: [
          {
            phrase: "ephemeral beauty",
            chinese: "短暂的美丽"
          }
        ],
        nearbyWords: [
          {
            word: "transient",
            distinction: "Transient implies more sudden ending, ephemeral implies natural short duration"
          }
        ]
      }
    };

    const valid = validate(validWordBreakdown);
    expect(valid).toBe(true);
  });

  test('wordBreakdownSchema rejects invalid word breakdown', () => {
    const validate = ajv.compile(wordBreakdownSchema);
    
    const invalidWordBreakdown = {
      type: "word_breakdown",
      // Missing required fields
    };

    const valid = validate(invalidWordBreakdown);
    expect(valid).toBe(false);
  });
});