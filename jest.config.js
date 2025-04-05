// jest.config.js
export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    testMatch: ['<rootDir>/src/__tests__/**/*.test.jsx'],
    moduleFileExtensions: ['js', 'jsx'],
  };
  