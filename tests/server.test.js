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
let originalDataDir;

describe('Vocabulary Learning App API', () => {
  // Setup and teardown
  beforeAll(async () => {
    // Store original DATA_DIR and create test directory
    originalDataDir = global.DATA_DIR || './data';
    global.DATA_DIR = testDataDir;
    
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

  test('GET /api/health returns health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('OK');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('POST /api/vocabulary saves vocabulary set and GET /api/vocabulary retrieves it', async () => {
    // Sample vocabulary data
    const sampleVocabulary = {
      type: "vocabulary_set",
      id: `vocabulary-${uuidv4()}`,
      timestamp: new Date().toISOString(),
      theme: "Technology and Innovation",
      words: [
        {
          word: "innovative",
          partOfSpeech: "adjective",
          chineseDefinition: "创新的",
          memoryAid: "in + nova (new) + tive = creating something new",
          examples: [
            {
              sentence: "The company is known for its innovative approach to technology.",
              chineseTranslation: "这家公司以其创新的技术方法而闻名。"
            }
          ]
        }
      ],
      story: {
        english: "In the rapidly evolving tech landscape, innovative companies constantly develop breakthrough solutions.",
        chinese: "在快速发展的技术领域，创新公司不断开发突破性解决方案。"
      },
      reviewStatus: "new"
    };

    // Save the vocabulary set
    let response = await request(app)
      .post('/api/vocabulary')
      .send(sampleVocabulary)
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Vocabulary set saved successfully');
    expect(response.body).toHaveProperty('path');

    // Retrieve all vocabulary sets
    response = await request(app).get('/api/vocabulary');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Check that our vocabulary set is in the response
    const foundSet = response.body.find(set => set.id === sampleVocabulary.id);
    expect(foundSet).toBeDefined();
    expect(foundSet.theme).toBe(sampleVocabulary.theme);
  });

  test('GET /api/vocabulary/:id retrieves specific vocabulary set', async () => {
    const testId = `test-${uuidv4()}`;
    const testVocabulary = {
      type: "vocabulary_set",
      id: testId,
      timestamp: new Date().toISOString(),
      theme: "Test Theme",
      words: [
        {
          word: "ephemeral",
          partOfSpeech: "adjective",
          chineseDefinition: "短暂的",
          memoryAid: "epi + hemeral (day) = lasting only a day",
          examples: [
            {
              sentence: "The ephemeral beauty of cherry blossoms attracts many visitors.",
              chineseTranslation: "樱花的短暂美丽吸引了许多游客。"
            }
          ]
        }
      ],
      story: {
        english: "The ephemeral nature of life reminds us to cherish each moment.",
        chinese: "生命的短暂性提醒我们要珍惜每一刻。"
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
    expect(response.body.theme).toBe(testVocabulary.theme);
  });

  test('GET /api/vocabulary/:id returns 404 for non-existent vocabulary set', async () => {
    const response = await request(app).get('/api/vocabulary/non-existent-id');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /api/vocabulary validates required fields', async () => {
    // Try to save without required fields
    const invalidVocabulary = {
      theme: "Missing required fields"
    };

    const response = await request(app)
      .post('/api/vocabulary')
      .send(invalidVocabulary)
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});