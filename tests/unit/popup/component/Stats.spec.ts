jest.mock('~contents/services/StorageService', () => ({
    storageService: {
        subscribe: jest.fn(),
    },
    StorageKeys: {},
}));

import {formatMsToHoursMinutes} from '~popup/component/Stats';

describe('Stats Component - formatMsToHoursMinutes', () => {
    test('returns 0m for 0 ms', () => {
        expect(formatMsToHoursMinutes(0)).toBe('0m');
    });

    test('returns 0m for negative ms', () => {
        expect(formatMsToHoursMinutes(-5000)).toBe('0m');
    });

    test('returns 0m for undefined or null equivalent', () => {
        expect(formatMsToHoursMinutes(null)).toBe('0m');
        expect(formatMsToHoursMinutes(undefined)).toBe('0m');
    });

    test('returns minutes only for durations under 1 hour', () => {
        // 5 minutes = 5 * 60 * 1000 = 300000
        expect(formatMsToHoursMinutes(300000)).toBe('5m');
        // 59 minutes = 59 * 60 * 1000 = 3540000
        expect(formatMsToHoursMinutes(3540000)).toBe('59m');
    });

    test('returns hours and minutes for durations exactly at or over 1 hour', () => {
        // 60 minutes = 1 hour = 3600000
        expect(formatMsToHoursMinutes(3600000)).toBe('1h 0m');

        // 90 minutes = 1h 30m = 5400000
        expect(formatMsToHoursMinutes(5400000)).toBe('1h 30m');

        // 125 minutes = 2h 5m = 7500000
        expect(formatMsToHoursMinutes(7500000)).toBe('2h 5m');
    });

    test('rounds down to nearest minute', () => {
        // 1 minute and 30 seconds = 90000
        expect(formatMsToHoursMinutes(90000)).toBe('1m');

        // 59 seconds = 59000
        expect(formatMsToHoursMinutes(59000)).toBe('0m');
    });
});
