const path = require('path');

module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  rootDir: path.resolve(__dirname),
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
}
