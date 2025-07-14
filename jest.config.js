/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',     
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', 
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src/test'],  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], 
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', 
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'], 
}