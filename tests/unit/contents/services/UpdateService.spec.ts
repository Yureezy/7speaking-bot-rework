// Setup global mocks before importing updateService
const mockGetManifest = jest.fn().mockReturnValue({ version: '1.0.0' });
global.chrome = {
  runtime: {
    getManifest: mockGetManifest,
  },
};

const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.log to avoid output pollution
jest.spyOn(console, 'log').mockImplementation(() => {});

import { updateService } from '~contents/services/UpdateService';

describe('UpdateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should query latest release version from github and detect update when latest version is newer', async () => {
    mockGetManifest.mockReturnValue({ version: '1.0.0' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ tag_name: 'v1.1.0' }),
    });

    // Manually run checkUpdateAvailable using private access / re-triggering fetchUpdate
    // because fetchUpdate runs immediately in constructor.
    await updateService.checkUpdateAvailable();
    expect(updateService.getUpdateAvailable()).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/orkeilius/7speaking-bot-rework/releases/latest'
    );
  });

  test('should not detect update when latest version is same or older', async () => {
    mockGetManifest.mockReturnValue({ version: '1.1.0' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ tag_name: 'v1.1.0' }),
    });

    await (updateService).checkUpdateAvailable();
    expect(updateService.getUpdateAvailable()).toBe(false);
  });

  test('should throw error when github API fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect((updateService).checkUpdateAvailable()).rejects.toThrow(
      'Failed to fetch latest release: 500 Internal Server Error'
    );
  });
});
