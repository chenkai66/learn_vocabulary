// Add TextEncoder/TextDecoder polyfill for Node.js environment
if (!global.TextEncoder) {
  const util = require('util');
  global.TextEncoder = util.TextEncoder;
  global.TextDecoder = util.TextDecoder;
}

// Load OpenAI shims before importing modules that use OpenAI
require('openai/shims/node');

const request = require('supertest');
const app = require('../server');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create a temporary data directory for testing
const testDataDir = './test_data';

describe('Review System Functionality', () => {
  // Setup and teardown
  beforeAll(async () => {
    // Create test data directory if it doesn't exist
    try {
      await fs.mkdir(testDataDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
  });

  afterAll(async () => {
    // Clean up test data directory
    try {
      const files = await fs.readdir(testDataDir);
      for (const file of files) {
        if (path.extname(file) === '.json') {
          await fs.unlink(path.join(testDataDir, file));
        }
      }
      await fs.rmdir(testDataDir);
    } catch (err) {
      // Ignore cleanup errors
    }
  });

  test('Review system can retrieve vocabulary for review', async () => {
    // Create a test vocabulary set
    const testVocabulary = {
      type: "vocabulary_set",
      id: `review-test-${uuidv4()}`,
      timestamp: new Date().toISOString(),
      theme: "Review Test Theme",
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
              sentence: "The ephemeral beauty of cherry blossoms.",
              chineseTranslation: "樱花的短暂美丽。"
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
        }
      ],
      story: {
        english: "The resilient and eloquent speaker addressed the pragmatic need to appreciate ephemeral moments of serendipity.",
        chinese: "坚韧不拔且雄辩的演讲者阐述了务实欣赏短暂意外之喜时刻的需要。"
      },
      reviewStatus: "new"
    };

    // Save the vocabulary set
    await request(app)
      .post('/api/vocabulary')
      .send(testVocabulary);

    // Retrieve all vocabulary sets to ensure it's available for review
    const response = await request(app).get('/api/vocabulary');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Find our test vocabulary
    const foundSet = response.body.find(set => set.id === testVocabulary.id);
    expect(foundSet).toBeDefined();
    expect(foundSet.words.length).toBeGreaterThanOrEqual(5);
  });

  test('Review system can get specific vocabulary set by ID', async () => {
    const testId = `review-specific-${uuidv4()}`;
    const testVocabulary = {
      type: "vocabulary_set",
      id: testId,
      timestamp: new Date().toISOString(),
      theme: "Specific Review Test",
      words: [
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
        }
      ],
      story: {
        english: "Technology has made many devices ubiquitous.",
        chinese: "技术使许多设备无处不在。"
      },
      reviewStatus: "new"
    };

    // Save the vocabulary set
    await request(app)
      .post('/api/vocabulary')
      .send(testVocabulary);

    // Retrieve the specific vocabulary set by ID
    const response = await request(app).get(`/api/vocabulary/${testId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testId);
    expect(response.body.words.length).toBe(1);
  });
});