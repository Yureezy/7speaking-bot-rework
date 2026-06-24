import {mockStorageInstance} from '../../helpers/mockStorage';
import {StorageKeys, storageService} from '~contents/services/StorageService';

describe('StorageService', () => {
    beforeEach(() => {
        mockStorageInstance.clear();
        jest.clearAllMocks();
    });

    test('get() should return defaultValue if value is not in storage', async () => {
        const active = await storageService.get<boolean>(StorageKeys.ACTIVE);
        expect(active).toBe(false);
        expect(mockStorageInstance.get).toHaveBeenCalledWith(StorageKeys.ACTIVE.key);
        expect(mockStorageInstance.set).toHaveBeenCalledWith(StorageKeys.ACTIVE.key, false);
    });

    test('get() should return stored value if type matches defaultValue', async () => {
        await mockStorageInstance.set(StorageKeys.ACTIVE.key, true);
        const active = await storageService.get<boolean>(StorageKeys.ACTIVE);
        expect(active).toBe(true);
    });

    test('get() should fallback to defaultValue and overwrite storage if stored value has wrong type', async () => {
        await mockStorageInstance.set(StorageKeys.ACTIVE.key, 'not-a-boolean');
        const active = await storageService.get<boolean>(StorageKeys.ACTIVE);
        expect(active).toBe(false); // default
        expect(mockStorageInstance.set).toHaveBeenCalledWith(StorageKeys.ACTIVE.key, false);
    });

    test('set() should successfully set valid type values', async () => {
        await storageService.set(StorageKeys.ACTIVE, true);
        expect(await mockStorageInstance.get(StorageKeys.ACTIVE.key)).toBe(true);
    });

    test('set() should throw TypeError if key has a customSetter', async () => {
        await expect(storageService.set(StorageKeys.STAT_QUESTION_DONE, 5)).rejects.toThrow(
            'Use custom setter for key statQuestionDone use update() instead.'
        );
    });

    test('set() should throw TypeError if value type does not match defaultValue type', async () => {
        await expect(storageService.set(StorageKeys.ACTIVE, 'true')).rejects.toThrow(
            'Invalid type for key active. Expected boolean but got string'
        );
    });

    test('update() should throw TypeError if key does not have a customSetter', async () => {
        await expect(storageService.update(StorageKeys.ACTIVE)).rejects.toThrow(
            'Use standard setter for key active use set() instead.'
        );
    });

    test('update() should compute new value using customSetter and set it', async () => {
        await storageService.update(StorageKeys.STAT_QUESTION_DONE);
        expect(await storageService.get(StorageKeys.STAT_QUESTION_DONE)).toBe(1);

        await storageService.update(StorageKeys.STAT_QUESTION_DONE);
        expect(await storageService.get(StorageKeys.STAT_QUESTION_DONE)).toBe(2);
    });

    test('subscribe() should notify callback immediately and on value change, and unwatch on unsubscribe', async () => {
        const callback = jest.fn();
        const unsubscribe = storageService.subscribe<boolean>(StorageKeys.ACTIVE, callback);

        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(callback).toHaveBeenCalledWith(false);

        await storageService.set(StorageKeys.ACTIVE, true);
        expect(callback).toHaveBeenCalledWith(true);

        unsubscribe();
        callback.mockClear();

        await storageService.set(StorageKeys.ACTIVE, false);
        expect(callback).not.toHaveBeenCalled();
    });
});
