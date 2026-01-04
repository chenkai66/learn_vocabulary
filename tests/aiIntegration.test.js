// Mock the OpenAI module to avoid making real API calls during testing
jest.mock('openai', () => {
  // Mock the Configuration and OpenAIApi classes
  const mockCreateChatCompletion = jest.fn();

  return {
    Configuration: jest.fn().mockImplementation(() => {}),
    OpenAIApi: jest.fn().mockImplementation(() => {
      return {
        createChatCompletion: mockCreateChatCompletion.mockImplementation(async (params) => {
          // Check the prompt content to determine what type of response to return
          const promptContent = params.messages[0].content;

          if (promptContent.includes('new set of 10 advanced vocabulary words')) {
            // Return vocabulary set for "Learn Some Words" or "new" input
            return {
              data: {
                choices: [{
                  message: {
                    content: JSON.stringify({
                      type: "vocabulary_set",
                      id: "test-vocabulary-123",
                      timestamp: "2024-01-01T00:00:00.000Z",
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
                        },
                        {
                          word: "ephemeral",
                          partOfSpeech: "adjective",
                          chineseDefinition: "短暂的",
                          memoryAid: "Lasting a short time",
                          examples: [
                            {
                              sentence: "The ephemeral beauty of cherry blossoms",
                              chineseTranslation: "樱花的短暂美丽"
                            }
                          ]
                        },
                        {
                          word: "ubiquitous",
                          partOfSpeech: "adjective",
                          chineseDefinition: "无处不在的",
                          memoryAid: "Present everywhere",
                          examples: [
                            {
                              sentence: "Mobile phones are now ubiquitous.",
                              chineseTranslation: "手机现在无处不在。"
                            }
                          ]
                        },
                        {
                          word: "resilient",
                          partOfSpeech: "adjective",
                          chineseDefinition: "有韧性的",
                          memoryAid: "Able to bounce back",
                          examples: [
                            {
                              sentence: "Children are often remarkably resilient.",
                              chineseTranslation: "孩子们通常具有非凡的韧性。"
                            }
                          ]
                        },
                        {
                          word: "pragmatic",
                          partOfSpeech: "adjective",
                          chineseDefinition: "务实的",
                          memoryAid: "Practical rather than idealistic",
                          examples: [
                            {
                              sentence: "A pragmatic approach to problem-solving.",
                              chineseTranslation: "解决问题的务实方法。"
                            }
                          ]
                        },
                        {
                          word: "eloquent",
                          partOfSpeech: "adjective",
                          chineseDefinition: "雄辩的",
                          memoryAid: "Speaking well",
                          examples: [
                            {
                              sentence: "Her eloquent speech moved the audience.",
                              chineseTranslation: "她雄辩的演讲感动了观众。"
                            }
                          ]
                        },
                        {
                          word: "conundrum",
                          partOfSpeech: "noun",
                          chineseDefinition: "难题",
                          memoryAid: "A confusing or difficult problem",
                          examples: [
                            {
                              sentence: "The economic conundrum puzzled experts.",
                              chineseTranslation: "经济难题让专家们困惑。"
                            }
                          ]
                        },
                        {
                          word: "nebulous",
                          partOfSpeech: "adjective",
                          chineseDefinition: "模糊的",
                          memoryAid: "Cloud-like, unclear",
                          examples: [
                            {
                              sentence: "The plan remained nebulous.",
                              chineseTranslation: "计划仍然模糊不清。"
                            }
                          ]
                        },
                        {
                          word: "malleable",
                          partOfSpeech: "adjective",
                          chineseDefinition: "可塑的",
                          memoryAid: "Able to be shaped",
                          examples: [
                            {
                              sentence: "Young minds are often malleable.",
                              chineseTranslation: "年轻人的思想往往是可塑的。"
                            }
                          ]
                        },
                        {
                          word: "lucid",
                          partOfSpeech: "adjective",
                          chineseDefinition: "清晰的",
                          memoryAid: "Clear and easy to understand",
                          examples: [
                            {
                              sentence: "She gave a lucid explanation.",
                              chineseTranslation: "她给出了清晰的解释。"
                            }
                          ]
                        }
                      ],
                      story: {
                        english: "In the rapidly evolving tech landscape, innovative companies constantly develop breakthrough solutions.",
                        chinese: "在快速发展的技术领域，创新公司不断开发突破性解决方案。"
                      },
                      reviewStatus: "new"
                    })
                  }
                }]
              }
            };
          } else if (promptContent.includes('provide a detailed breakdown of the word')) {
            // Return word breakdown for specific word lookup
            return {
              data: {
                choices: [{
                  message: {
                    content: JSON.stringify({
                      type: "word_breakdown",
                      id: "breakdown-test-123",
                      timestamp: "2024-01-01T00:00:00.000Z",
                      word: "ephemeral",
                      breakdown: {
                        pronunciation: "/ɪˈfemərəl/",
                        partOfSpeech: "adjective",
                        meanings: [
                          {
                            definition: "lasting for a very short time",
                            chinese: "短暂的",
                            usageContext: "often used to describe beauty"
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
                            distinction: "Transient implies more sudden ending"
                          }
                        ]
                      }
                    })
                  }
                }]
              }
            };
          } else {
            // Default to vocabulary set for other cases
            return {
              data: {
                choices: [{
                  message: {
                    content: JSON.stringify({
                      type: "vocabulary_set",
                      id: "test-vocabulary-123",
                      timestamp: "2024-01-01T00:00:00.000Z",
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
              }
            };
          }
        })
      };
    })
  };
});

const { generateVocabulary, validateVocabularyData } = require('../aiIntegration');

describe('AI Integration Module', () => {
  test('generateVocabulary creates valid vocabulary set for "Learn Some Words" input', async () => {
    const result = await generateVocabulary("Learn Some Words");

    expect(result).toHaveProperty('type');
    expect(result.type).toBe('vocabulary_set');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('theme');
    expect(Array.isArray(result.words)).toBe(true);
    expect(result.words.length).toBeGreaterThan(0);
    expect(result).toHaveProperty('story');
    expect(result.story).toHaveProperty('english');
    expect(result.story).toHaveProperty('chinese');
    expect(result).toHaveProperty('reviewStatus');
  });

  test('generateVocabulary returns proper structure', async () => {
    // Since mocking the OpenAI API is complex, we'll test the validation function
    // which is the main logic component that can be tested without API calls
    const result = await generateVocabulary("test"); // This will return mock data

    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('timestamp');
  });

  test('validateVocabularyData returns true for valid vocabulary set', () => {
    const { validateVocabularyData } = require('../aiIntegration'); // Re-require to get the function

    const validVocabularySet = {
      type: "vocabulary_set",
      id: "test-123",
      timestamp: "2024-01-01T00:00:00.000Z",
      theme: "Advanced Technology and Innovation",
      words: [
        {
          word: "example",
          partOfSpeech: "noun",
          chineseDefinition: "例子",
          memoryAid: "记忆辅助",
          examples: [
            {
              sentence: "An example sentence",
              chineseTranslation: "一个例句"
            }
          ]
        }
      ],
      story: {
        english: "A story with the words",
        chinese: "包含这些词的故事"
      },
      reviewStatus: "new"
    };

    const isValid = validateVocabularyData(validVocabularySet);
    expect(isValid).toBe(true);
  });

  test('validateVocabularyData returns true for valid word breakdown', () => {
    const { validateVocabularyData } = require('../aiIntegration'); // Re-require to get the function

    const validWordBreakdown = {
      type: "word_breakdown",
      id: "breakdown-123",
      timestamp: "2024-01-01T00:00:00.000Z",
      word: "example",
      breakdown: {
        pronunciation: "/ɪɡˈzæmpəl/",
        partOfSpeech: "noun",
        meanings: [
          {
            definition: "an example",
            chinese: "例子",
            usageContext: "used to illustrate a point"
          }
        ],
        etymology: "From Latin 'exemplum'",
        memoryTips: "think of 'ex' + 'ample' = plenty of examples",
        examples: [
          {
            sentence: "This is an example.",
            chineseTranslation: "这是一个例子。"
          }
        ],
        collocations: [
          {
            phrase: "for example",
            chinese: "例如"
          }
        ],
        nearbyWords: [
          {
            word: "instance",
            distinction: "Instance is more specific, example is more general"
          }
        ]
      }
    };

    const isValid = validateVocabularyData(validWordBreakdown);
    expect(isValid).toBe(true);
  });

  test('validateVocabularyData returns false for invalid data', () => {
    const invalidData = {
      // Missing required fields
    };

    const isValid = validateVocabularyData(invalidData);
    expect(isValid).toBe(false);
  });
});