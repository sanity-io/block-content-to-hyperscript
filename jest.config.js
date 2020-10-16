module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testURL: "http://localhost/",
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  moduleDirectories: ['node_modules', 'src']
};