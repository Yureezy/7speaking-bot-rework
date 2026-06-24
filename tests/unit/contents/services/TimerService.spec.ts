import {mockStorageInstance} from '../../helpers/mockStorage';
import {TimerType, timeService} from '~contents/services/TimerService';
import {StorageKeys} from '~contents/services/StorageService';

jest.mock('~contents/utils/Logging', () => ({
    logMessage: jest.fn(),
}));

describe('TimerService', () => {
    beforeEach(() => {
        mockStorageInstance.clear();
        jest.clearAllMocks();
        document.body.innerHTML = '';

        window.history.pushState({}, 'Test', '/quiz');
    });

    describe('findRealTime', () => {
        test('should parse "sec" properly', async () => {
            document.body.innerHTML = `
        <div class="durationCounter">
          <p class="MuiTypography-body1">45sec</p>
        </div>
      `;
            const time = await timeService.findRealTime();
            expect(time).toBe(45000);
        });

        test('should parse "min" properly', async () => {
            document.body.innerHTML = `
        <div class="durationCounter">
          <p class="MuiTypography-body1">10min</p>
        </div>
      `;
            const time = await timeService.findRealTime();
            expect(time).toBe(600000);
        });

        test('should parse "h" properly', async () => {
            document.body.innerHTML = `
        <div class="durationCounter">
          <p class="MuiTypography-body1">2h</p>
        </div>
      `;
            const time = await timeService.findRealTime();
            expect(time).toBe(7200000);
        });

        test('should return defaultTimerQuiz if no element found', async () => {
            const time = await timeService.findRealTime();
            expect(time).toBe(60 * 1000 * 20);
        });

        test('should return defaultTimerQuiz if invalid format', async () => {
            document.body.innerHTML = `
        <div class="durationCounter">
          <p class="MuiTypography-body1">invalid-format</p>
        </div>
      `;
            const time = await timeService.findRealTime();
            expect(time).toBe(60 * 1000 * 20);
        });
    });

    describe('isWaitingEnded', () => {
        test('should create a timer and return false if URL does not match stored TIMER_URL', async () => {
            await mockStorageInstance.set(StorageKeys.TIMER_URL.key, 'https://user.7speaking.com/different');
            await mockStorageInstance.set(StorageKeys.CUSTOM_TIMER_QUESTION.key, 1000);

            const result = await timeService.isWaitingEnded(TimerType.QUESTION);
            expect(result).toBe(false);
            expect(await mockStorageInstance.get(StorageKeys.TIMER_URL.key)).toBe('https://user.7speaking.com/quiz');
            expect(await mockStorageInstance.get(StorageKeys.TIMER_END.key)).toBeGreaterThan(Date.now());
        });

        test('should return false if current time is before TIMER_END', async () => {
            await mockStorageInstance.set(StorageKeys.TIMER_URL.key, 'https://user.7speaking.com/quiz');
            // Set timer to end 10 seconds in the future
            await mockStorageInstance.set(StorageKeys.TIMER_END.key, Date.now() + 10000);

            const result = await timeService.isWaitingEnded(TimerType.QUESTION);
            expect(result).toBe(false);
        });

        test('should return true, clear TIMER_URL and return true if current time is after TIMER_END', async () => {
            await mockStorageInstance.set(StorageKeys.TIMER_URL.key, 'https://user.7speaking.com/quiz');
            await mockStorageInstance.set(StorageKeys.TIMER_END.key, Date.now() - 10000);

            const result = await timeService.isWaitingEnded(TimerType.QUESTION);
            expect(result).toBe(true);
            expect(await mockStorageInstance.get(StorageKeys.TIMER_URL.key)).toBe('');
        });
    });
});
