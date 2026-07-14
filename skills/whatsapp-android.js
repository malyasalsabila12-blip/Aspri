/**
 * WhatsApp Android Skills
 * Reusable functions for interacting with the WhatsApp App via Playwright Android
 */

const SELECTORS = {
    // These IDs are specific to WhatsApp Business (com.whatsapp.w4b)
    // For standard WhatsApp, use 'com.whatsapp:id/entry'
    input: { res: 'com.whatsapp.w4b:id/entry' },
    sendButton: { res: 'com.whatsapp.w4b:id/conversation_entry_action_button' },
    standardInput: { res: 'com.whatsapp:id/entry' },
    standardSendButton: { res: 'com.whatsapp:id/conversation_entry_action_button' }
};

/**
 * Open a specific chat using an Android Intent
 * @param {import('@playwright/test').AndroidDevice} device 
 * @param {string} phoneNumber 
 */
async function openChat(device, phoneNumber) {
    // Clean phone number (remove non-digits)
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    await device.shell(`am start -a android.intent.action.VIEW -d "https://api.whatsapp.com/send?phone=${cleanNumber}"`);
    // Allow some time for the app to open and the chat to load
    await new Promise(resolve => setTimeout(resolve, 5000));
}

/**
 * Send a message to the currently active chat
 * @param {import('@playwright/test').AndroidDevice} device 
 * @param {string} message 
 */
async function sendMessage(device, message) {
    try {
        // 1. Identify which WhatsApp version is running
        // We wait up to 15 seconds for the chat UI to load
        console.log('Waiting for chat UI to load...');
        let inputSelector = null;
        let sendButtonSelector = null;

        for (let i = 0; i < 15; i++) {
            const infoW4B = await device.info(SELECTORS.input).catch(() => null);
            if (infoW4B) {
                inputSelector = SELECTORS.input;
                sendButtonSelector = SELECTORS.sendButton;
                console.log('Detected WhatsApp Business.');
                break;
            }
            const infoStandard = await device.info(SELECTORS.standardInput).catch(() => null);
            if (infoStandard) {
                inputSelector = SELECTORS.standardInput;
                sendButtonSelector = SELECTORS.standardSendButton;
                console.log('Detected standard WhatsApp.');
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!inputSelector) {
            throw new Error('Could not find WhatsApp input field after 15 seconds.');
        }

        // 2. Clear and fill the input
        console.log('Typing message...');
        await device.fill(inputSelector, message);
        
        // 3. CRITICAL: Wait for the "Send" button to appear (it replaces the Microphone)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 4. Attempt to click the send button
        console.log('Clicking send button...');
        const clickSend = async () => {
            try {
                // Try selector first
                await device.click(sendButtonSelector, { timeout: 2000 });
                return true;
            } catch (e) {
                // Fallback to exact coordinates from view.xml [945,2093][1075,2152]
                // Center is approx 1010, 2122
                await device.shell('input tap 1010 2122');
                return true;
            }
        };

        await clickSend();

        // 5. Verification & Retry Loop
        for (let attempt = 1; attempt <= 3; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const info = await device.info(inputSelector).catch(() => null);
            const currentText = info ? info.text : "";
            
            // If box is empty or contains the placeholder "Pesan", it's sent
            if (!currentText || currentText.trim() === "" || currentText === "Pesan") {
                console.log(`Verification successful on attempt ${attempt}: Message sent.`);
                return;
            }

            console.warn(`Attempt ${attempt} failed: Text "${currentText.trim()}" still in box. Retrying...`);
            // Try hiding keyboard then tapping again
            await device.shell('input keyevent 4'); // Back button to hide keyboard
            await new Promise(resolve => setTimeout(resolve, 500));
            await clickSend();
            // Also try Enter key
            await device.shell('input keyevent 66'); 
        }

        throw new Error('Failed to send message after 3 attempts. Please check if the "Send" button is visible.');

    } catch (e) {
        console.error('Major failure in sendMessage:', e.message);
        await device.screenshot({ path: 'error_send_message.png' });
        console.log('Error screenshot saved to error_send_message.png');
        
        // Final fallback: Shell typing
        const shellMessage = message.replace(/ /g, '%s');
        await device.shell(`input text ${shellMessage}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.shell('input tap 1000 2120');
    }
}

/**
 * Get the text content of the latest message (Experimental)
 * @param {import('@playwright/test').AndroidDevice} device 
 */
async function getLatestMessage(device) {
    // Note: This requires a UI dump to find the text of the last message bubble
    // This is a placeholder for a more complex UI traversal
    const tree = await device.shell('uiautomator dump /sdcard/view.xml');
    // In a real implementation, you'd parse view.xml here
    return "Functionality to parse UI dump required for reading messages";
}

module.exports = {
    openChat,
    sendMessage,
    getLatestMessage,
    SELECTORS
};
