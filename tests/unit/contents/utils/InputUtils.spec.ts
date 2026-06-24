import { realistInput, waitForSelector } from '~contents/utils/InputUtils';

describe('InputUtils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('realistInput', () => {
    test('should focus, type character-by-character using execCommand, and blur', async () => {
      const input = document.createElement('input');
      document.body.appendChild(input);

      const focusSpy = jest.spyOn(input, 'focus');
      const blurSpy = jest.spyOn(input, 'blur');

      // Mock execCommand to append text
      const execCommandSpy = jest.fn().mockImplementation((command, showUI, val) => {
        if (command === 'insertText') {
          input.value += val;
          return true;
        }
        return false;
      });
      document.execCommand = execCommandSpy;

      jest.spyOn(Math, 'random').mockReturnValue(0);

      await realistInput(input, 'hello');

      expect(input.value).toBe('hello');
      expect(focusSpy).toHaveBeenCalledTimes(5);
      expect(blurSpy).toHaveBeenCalledTimes(1);
      expect(execCommandSpy).toHaveBeenCalledTimes(5);
      expect(execCommandSpy).toHaveBeenLastCalledWith('insertText', false, 'o');
    });
  });

  describe('waitForSelector', () => {
    test('should return true if selector is already present', async () => {
      const div = document.createElement('div');
      div.className = 'test-class';
      document.body.appendChild(div);

      const result = await waitForSelector('.test-class', 200);
      expect(result).toBe(true);
    });

    test('should wait and return true if selector appears later', async () => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'delayed-class';
        document.body.appendChild(div);
      }, 600);

      const result = await waitForSelector('.delayed-class', 1000);
      expect(result).toBe(true);
    });

    test('should return false if selector does not appear within timeout', async () => {
      const result = await waitForSelector('.never-appears', 200);
      expect(result).toBe(false);
    });
  });
});
