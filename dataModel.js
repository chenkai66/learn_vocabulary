// Vocabulary data model schemas

/**
 * Schema for a vocabulary set (type: "vocabulary_set")
 * Generated when user requests "学习|1" or "new"
 */
const vocabularySetSchema = {
  type: 'object',
  required: ['type', 'id', 'timestamp', 'theme', 'words', 'story', 'reviewStatus'],
  properties: {
    type: {
      type: 'string',
      enum: ['vocabulary_set']
    },
    id: {
      type: 'string'
    },
    timestamp: {
      type: 'string'
    },
    theme: {
      type: 'string'
    },
    words: {
      type: 'array',
      items: {
        type: 'object',
        required: ['word', 'partOfSpeech', 'chineseDefinition', 'memoryAid', 'examples'],
        properties: {
          word: { type: 'string' },
          partOfSpeech: { type: 'string' },
          chineseDefinition: { type: 'string' },
          memoryAid: { type: 'string' },
          examples: {
            type: 'array',
            items: {
              type: 'object',
              required: ['sentence', 'chineseTranslation'],
              properties: {
                sentence: { type: 'string' },
                chineseTranslation: { type: 'string' }
              }
            }
          }
        }
      }
    },
    story: {
      type: 'object',
      required: ['english', 'chinese'],
      properties: {
        english: { type: 'string' },
        chinese: { type: 'string' }
      }
    },
    reviewStatus: {
      type: 'string',
      enum: ['new', 'reviewed', 'mastered']
    }
  }
};

/**
 * Schema for a word breakdown (type: "word_breakdown")
 * Generated when user looks up a specific word
 */
const wordBreakdownSchema = {
  type: 'object',
  required: ['type', 'id', 'timestamp', 'word', 'breakdown'],
  properties: {
    type: {
      type: 'string',
      enum: ['word_breakdown']
    },
    id: {
      type: 'string'
    },
    timestamp: {
      type: 'string'
    },
    word: {
      type: 'string'
    },
    breakdown: {
      type: 'object',
      required: ['pronunciation', 'partOfSpeech', 'meanings', 'etymology', 'memoryTips', 'examples', 'collocations', 'nearbyWords'],
      properties: {
        pronunciation: { type: 'string' },
        partOfSpeech: { type: 'string' },
        meanings: {
          type: 'array',
          items: {
            type: 'object',
            required: ['definition', 'chinese', 'usageContext'],
            properties: {
              definition: { type: 'string' },
              chinese: { type: 'string' },
              usageContext: { type: 'string' }
            }
          }
        },
        etymology: { type: 'string' },
        memoryTips: { type: 'string' },
        examples: {
          type: 'array',
          items: {
            type: 'object',
            required: ['sentence', 'chineseTranslation'],
            properties: {
              sentence: { type: 'string' },
              chineseTranslation: { type: 'string' }
            }
          }
        },
        collocations: {
          type: 'array',
          items: {
            type: 'object',
            required: ['phrase', 'chinese'],
            properties: {
              phrase: { type: 'string' },
              chinese: { type: 'string' }
            }
          }
        },
        nearbyWords: {
          type: 'array',
          items: {
            type: 'object',
            required: ['word', 'distinction'],
            properties: {
              word: { type: 'string' },
              distinction: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

module.exports = {
  vocabularySetSchema,
  wordBreakdownSchema
};