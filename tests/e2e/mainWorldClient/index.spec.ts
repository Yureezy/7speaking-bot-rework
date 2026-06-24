import { test, expect } from '../fixture';

const NUMBER_OF_MAINWORLD_HOOK = 4

test('mainWorldProbe injected in website', async ({ page }) => {
    await page.goto('https://user.7speaking.com/');
    const client = await page.context().newCDPSession(page);

    // Get the window object via Runtime.evaluate
    const { result: windowObj } = await client.send('Runtime.evaluate', {
        expression: 'window',
        returnByValue: false,
    });

    // Get all event listeners on window
    const { listeners } = await client.send('DOMDebugger.getEventListeners', {
        objectId: windowObj.objectId,
    });

    const requestListeners = listeners.filter((l: { type: string }) =>
        l.type.endsWith('_REQUEST')
    );

    expect(requestListeners).toHaveLength(NUMBER_OF_MAINWORLD_HOOK);
});
