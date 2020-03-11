// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['/lib/', 'helpers'],
  testPathIgnorePatterns: ['helpers']
};
