import MainWorldInterface from '~contents/mainWorldClient/mainWorldInterface';

class TestMainWorld extends MainWorldInterface<string, string> {
    name = 'TEST_FUNCTION';

    clientFunction = jest.fn((arg: string) => {
        return arg.toUpperCase();
    });

    public testGetReactElement(e: Element | null) {
        return this.getReactElement(e);
    }
}

describe('MainWorldInterface', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should establish two-way communication using CustomEvent', async () => {
        const testInterface = new TestMainWorld();
        testInterface.initClientSide();

        const result = await testInterface.callFunction('hello world');

        expect(result).toBe('HELLO WORLD');
        expect(testInterface.clientFunction).toHaveBeenCalledWith('hello world');
    });

    test('getReactElement should return null if element is null', () => {
        const testInterface = new TestMainWorld();
        expect(testInterface.testGetReactElement(null)).toBeNull();
    });

    test('getReactElement should find and return __reactFiber$ property', () => {
        const testInterface = new TestMainWorld();
        const div = document.createElement('div');
        const mockFiber = {memoizedProps: {test: true}};
        div['__reactFiber$12345'] = mockFiber;

        const fiber = testInterface.testGetReactElement(div);
        expect(fiber).toBe(mockFiber);
    });

    test('getReactElement should return null if no __reactFiber$ property exists', () => {
        const testInterface = new TestMainWorld();
        const div = document.createElement('div');
        div['somethingElse'] = {};

        const fiber = testInterface.testGetReactElement(div);
        expect(fiber).toBeNull();
    });
});
