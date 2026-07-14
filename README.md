# Aspri AI Assistant Testing: Zero to Hero Guide

This guide will help you set up and run automated tests for the Aspri AI assistant on WhatsApp from scratch.

---

## Part 1: Project Initialization (The "Zero" Setup)

If you are starting in a completely empty folder, follow these commands:

1.  **Initialize Node.js Project**:
    ```bash
    npm init -y
    ```
2.  **Install Playwright**:
    ```bash
    npm install @playwright/test
    npx playwright install chromium
    ```
3.  **Create Folder Structure**:
    ```bash
    mkdir tests
    ```

---

## Part 2: Mobile App Testing Setup (Physical Device)

To test directly on the **WhatsApp Mobile App**, follow these specific steps:

### 1. Install Android Platform Tools
You need `adb` (Android Debug Bridge) on your computer.
- **Windows**: [Download Platform Tools](https://developer.android.com/studio/releases/platform-tools) and add the folder to your System PATH.
- **Verify**: Type `adb --version` in your terminal.

### 2. Configure Your Phone
1.  **Enable Developer Mode**: Settings > About Phone > Tap **Build Number** 7 times.
2.  **Enable USB Debugging**: Settings > Developer Options > Enable **USB Debugging**.
3.  **Connect**: Plug in your phone via USB. Select "Transfer Files" mode.
4.  **Authorize**: Run `adb devices`. Look at your phone screen and tap **"Always allow from this computer"**.

### 3. Run the Mobile Test
The script `tests/android-test.js` will automatically open WhatsApp and send a message.
```bash
node tests/android-test.js
```

---

## Part 3: WhatsApp Web Testing Setup (Browser)

This is the easiest way to test logic without needing a phone connected constantly.

1.  **Run the Test**:
    ```bash
    npx playwright test tests/whatsapp.test.js --headed
    ```
2.  **Authentication**:
    - A browser window will open.
    - **Scan the QR code** using your phone's WhatsApp (Linked Devices).
    - The test will then proceed to find the Aspri contact and send a message.

---

## Part 4: File Descriptions

- `tests/android-test.js`: Uses Playwright's Android module to control the native WhatsApp app.
- `tests/whatsapp.test.js`: Uses standard Playwright to control WhatsApp Web.
- `playwright.config.js`: Configuration for the test runner.
- `package.json`: Manages dependencies.
- `skills/`: Reusable WhatsApp interaction modules (Web and Android).

---

## Part 5: Using WhatsApp Skills

You can now use reusable "skills" in your scripts instead of writing raw automation logic.

### Example: Using Web Skills
```javascript
const { web } = require('./skills');
// ... setup page ...
await web.waitForLoad(page);
await web.openChat(page, '6287889681231');
await web.sendMessage(page, 'Halo dari reusable skills!');
```

### Example: Using Android Skills
```javascript
const { android } = require('./skills');
// ... setup device ...
await android.openChat(device, '6287889681231');
await android.sendMessage(device, 'Halo dari Android skills!');
```

---

## Test Checklist
- [x] **Greeting**: Send "Halo" and check for welcome message.
- [x] **Expense Tracker**: Send "jajan 25rb" and verify it's recorded.
- [x] **Reminder**: Set a reminder and check confirmation.
- [ ] **Dashboard**: Ask for dashboard link and verify the URL.
