/**
 * WhatsApp Web Skills
 * Reusable functions for interacting with WhatsApp Web via Playwright
 */

const SELECTORS = {
    searchBox: 'div[contenteditable="true"][data-tab="3"]',
    chatInput: 'div[contenteditable="true"][data-tab="10"]',
    lastIncomingMessage: 'div.message-in',
};

/**
 * Wait for WhatsApp Web to load
 * @param {import('@playwright/test').Page} page 
 */
async function waitForLoad(page) {
    await page.waitForSelector(SELECTORS.searchBox, { timeout: 60000 });
}

/**
 * Open a chat by searching for a contact or number
 * @param {import('@playwright/test').Page} page 
 * @param {string} contactNameOrNumber 
 */
async function openChat(page, contactNameOrNumber) {
    const searchBox = page.locator(SELECTORS.searchBox);
    await searchBox.click();
    await searchBox.fill(contactNameOrNumber);
    await page.keyboard.press('Enter');
    
    // Wait for the chat header or input to confirm it's open
    await page.waitForSelector(SELECTORS.chatInput);
}

/**
 * Send a message to the currently active chat
 * @param {import('@playwright/test').Page} page 
 * @param {string} message 
 */
async function sendMessage(page, message) {
    const chatInput = page.locator(SELECTORS.chatInput);
    await chatInput.fill(message);
    await page.keyboard.press('Enter');
}

/**
 * Get the text content of the latest incoming message
 * @param {import('@playwright/test').Page} page 
 * @returns {Promise<string>}
 */
async function getLatestIncomingMessage(page) {
    const lastMessage = page.locator(SELECTORS.lastIncomingMessage).last();
    await lastMessage.waitFor({ state: 'visible', timeout: 30000 });
    return await lastMessage.textContent();
}

module.exports = {
    waitForLoad,
    openChat,
    sendMessage,
    getLatestIncomingMessage,
    SELECTORS
};
