module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    testEnvironmentOptions: {
        url: 'https://user.7speaking.com/home',
    },
    testMatch: ['**/tests/unit/**/*.spec.ts'],
    moduleNameMapper: {
        '^data-text:(.*)$': '<rootDir>/tests/unit/mocks/stringMock.js',
        '\\.(css)$': '<rootDir>/tests/unit/mocks/styleMock.js',
        '^~contents/(.*)$': '<rootDir>/src/contents/$1',
        '^~popup/(.*)$': '<rootDir>/src/popup/$1',
        '^~types/(.*)$': '<rootDir>/src/types/$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            diagnostics: false
        }]
    }
};
