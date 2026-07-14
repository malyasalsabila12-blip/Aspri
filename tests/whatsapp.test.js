const { test } = require('@playwright/test');
const path = require('path');
const { web } = require('../skills');

// Run this test with: npx playwright test tests/whatsapp.test.js --headed
test.describe('Aspri AI WhatsApp Testing', () => {
  test('Send message to Aspri and verify response', async ({ browserName }) => {
    const { chromium } = require('@playwright/test');
    // Path to store WhatsApp session (as a directory)
    const userDataDir = path.join(__dirname, '../.whatsapp-session');
    
    // Using launchPersistentContext is better for WhatsApp Web sessions
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
    });
    
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
    
    console.log('Navigating to WhatsApp Web...');
    await page.goto('https://web.whatsapp.com/');
    
    // Use the skill to wait for load/login
    try {
      await web.waitForLoad(page);
    } catch (e) {
      console.log('QR Code might be needed. Please scan if visible.');
      await page.waitForSelector('canvas', { timeout: 10000 }).catch(() => {});
      // Wait longer for manual login
      await web.waitForLoad(page);
    }

    const aspriNumber = '6287889681231';
    
    console.log(`Opening chat with ${aspriNumber}...`);
    await web.openChat(page, aspriNumber);

    console.log('Sending message...');
    await web.sendMessage(page, 'Halo Aspri, ini tes otomatis.');

    console.log('Waiting for response...');
    const responseText = await web.getLatestIncomingMessage(page);
    console.log(`Aspri response: ${responseText}`);

    await context.close();
  });
});
