module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    'public/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ]
};