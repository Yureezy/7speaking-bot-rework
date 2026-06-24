const storageStore = new Map();
const watchers = new Set();

export const mockStorageInstance = {
    get: jest.fn().mockImplementation(async (key: string) => {
        return storageStore.get(key);
    }),
    set: jest.fn().mockImplementation(async (key: string, value) => {
        storageStore.set(key, value);
        for (const watcher of watchers) {
            if (watcher[key]) {
                watcher[key]({newValue: value});
            }
        }
    }),
    watch: jest.fn().mockImplementation((watcher) => {
        watchers.add(watcher);
    }),
    unwatch: jest.fn().mockImplementation((watcher) => {
        watchers.delete(watcher);
    }),
    clear: () => {
        storageStore.clear();
        watchers.clear();
    }
};

jest.mock('@plasmohq/storage', () => {
    return {
        Storage: jest.fn().mockImplementation(() => {
            return mockStorageInstance;
        })
    };
});
