//@ts-check

const filesToMockRegex = '\\.(jpe?g|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$';

/**@type {Partial<jest.DefaultOptions>} */
const jestConfig = {
  verbose: process.argv.indexOf('--watch') >= 0,
  moduleNameMapper: {
    [filesToMockRegex]: '<rootDir>/__mocks__/fileMock.js',
    '^.+\\.s?css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  snapshotSerializers: ['jest-serializer-html'],
  notify: process.argv.indexOf('--watch') >= 0,
  // https://jestjs.io/docs/en/configuration.html#notifymode-string
  notifyMode: 'failure',
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', '!**/node_modules/**'],
  coveragePathIgnorePatterns: [
    '.*\\.d\\.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./jest-setup.ts'],
  testRegex: '((/__tests__/.*)|(\\.test|\\.spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testURL: 'http://iast-fake-test-url/iast-ui/#!/',
  globals: {
    __DEV__: false,
    PRODUCTION: true,
    DEVELOPMENT: false,
  },
};

if (process.argv.includes('--ci') == false) {
  jestConfig.setupTestFrameworkScriptFile = './jest-setup-framework.ts';
}

module.exports = jestConfig;
