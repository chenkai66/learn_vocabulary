const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { 
  loadData, 
  saveData, 
  loadAllVocabularySets,
  saveVocabularySet,
  loadVocabularySetById 
} = require('../dataPersistence');

// Create a temporary data directory for testing
const testDataDir = './test_data';
let originalDataDir;

describe('Data Persistence Module', () => {
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

  test('saveData and loadData functions work correctly', async () => {
    const testData = { message: 'Hello, World!', number: 42 };
    const testFilePath = path.join(testDataDir, 'test.json');

    // Save data
    await saveData(testFilePath, testData);

    // Load data
    const loadedData = await loadData(testFilePath);

    expect(loadedData).toEqual(testData);
  });

  test('saveVocabularySet creates a JSON file with correct content', async () => {
    const testVocabulary = {
      type: "vocabulary_set",
      id: `test-${uuidv4()}`,
      timestamp: new Date().toISOString(),
      theme: "Test Theme",
      words: [
        {
          word: "serendipity",
          partOfSpeech: "noun",
          chineseDefinition: "意外发现",
          memoryAid: "seren + dip + ity = finding good things by chance",
          examples: [
            {
              sentence: "Finding this book was pure serendipity.",
              chineseTranslation: "发现这本书完全是意外之喜。"
            }
          ]
        }
      ],
      story: {
        english: "Sometimes the best discoveries happen through serendipity.",
        chinese: "有时最好的发现是通过意外之喜实现的。"
      },
      reviewStatus: "new"
    };

    // Save vocabulary set
    const savedPath = await saveVocabularySet(testDataDir, testVocabulary);

    // Verify the file exists
    expect(savedPath).toContain(testVocabulary.id);
    expect(savedPath).toContain('.json');

    // Load and verify content
    const loadedData = await loadData(savedPath);
    expect(loadedData).toEqual(testVocabulary);
  });

  test('loadAllVocabularySets returns all vocabulary sets', async () => {
    // Create multiple vocabulary sets
    const vocab1 = {
      type: "vocabulary_set",
      id: `test1-${uuidv4()}`,
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      theme: "Old Theme",
      words: [],
      story: { english: "", chinese: "" },
      reviewStatus: "new"
    };

    const vocab2 = {
      type: "vocabulary_set",
      id: `test2-${uuidv4()}`,
      timestamp: new Date().toISOString(), // Today
      theme: "New Theme",
      words: [],
      story: { english: "", chinese: "" },
      reviewStatus: "new"
    };

    await saveVocabularySet(testDataDir, vocab1);
    await saveVocabularySet(testDataDir, vocab2);

    // Load all vocabulary sets
    const allVocab = await loadAllVocabularySets(testDataDir);

    // Should return an array with at least these 2 sets
    expect(Array.isArray(allVocab)).toBe(true);
    expect(allVocab.length).toBeGreaterThanOrEqual(2);

    // Check that both vocabularies are present (order may vary due to timing)
    const vocabIds = allVocab.map(v => v.id);
    expect(vocabIds).toContain(vocab1.id);
    expect(vocabIds).toContain(vocab2.id);
  });

  test('loadVocabularySetById returns specific vocabulary set', async () => {
    const testId = `findable-${uuidv4()}`;
    const testVocabulary = {
      type: "vocabulary_set",
      id: testId,
      timestamp: new Date().toISOString(),
      theme: "Findable Theme",
      words: [
        {
          word: "eloquent",
          partOfSpeech: "adjective",
          chineseDefinition: "雄辩的",
          memoryAid: "e + loq (speak) + uent = speak well",
          examples: [
            {
              sentence: "Her eloquent speech moved the audience.",
              chineseTranslation: "她雄辩的演讲感动了观众。"
            }
          ]
        }
      ],
      story: {
        english: "The eloquent speaker captivated everyone.",
        chinese: "雄辩的演讲者迷住了所有人。"
      },
      reviewStatus: "new"
    };

    // Save the vocabulary set
    await saveVocabularySet(testDataDir, testVocabulary);

    // Load by ID
    const loadedVocab = await loadVocabularySetById(testDataDir, testId);

    expect(loadedVocab).toBeDefined();
    expect(loadedVocab.id).toBe(testId);
    expect(loadedVocab.theme).toBe(testVocabulary.theme);
  });

  test('loadVocabularySetById returns null for non-existent ID', async () => {
    const result = await loadVocabularySetById(testDataDir, 'non-existent-id');
    expect(result).toBeNull();
  });
});