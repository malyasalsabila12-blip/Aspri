const { test } = require('@playwright/test');
const path = require('path');
const { web } = require('../skills');

test.describe('WhatsApp Skills Demo', () => {
  test('Send message using reusable skills', async ({ browser }) => {
    const userDataDir = path.join(__dirname, '../.whatsapp-session');
    const context = await browser.newContext({ storageState: userDataDir });
    const page = await context.newPage();
    
    console.log('Navigating to WhatsApp Web...');
    await page.goto('https://web.whatsapp.com/');
    
    // Use the skill to wait for load
    console.log('Waiting for load...');
    await web.waitForLoad(page);

    const target = '6287889681231';
    
    // Use the skill to open chat
    console.log(`Opening chat with ${target}...`);
    await web.openChat(page, target);

    // Use the skill to send message
    console.log('Sending message...');
    await web.sendMessage(page, 'Halo, ini pesan dari WhatsApp Skills library!');

    // Use the skill to get the response
    console.log('Waiting for response...');
    const response = await web.getLatestIncomingMessage(page);
    console.log(`Received: ${response}`);

    await context.close();
  });
});
