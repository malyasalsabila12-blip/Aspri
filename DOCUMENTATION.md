# Aspri AI WhatsApp Automation Documentation Report

## 1. Overview
This project provides an automated testing and interaction framework for the Aspri AI assistant on WhatsApp. It supports two primary platforms:
- **WhatsApp Web**: Browser-based automation using Playwright.
- **WhatsApp Mobile**: Native Android automation using Playwright's Android module and ADB.

## 2. Project Structure
```text
/
├── skills/               # Reusable automation modules
│   ├── index.js          # Central entry point
│   ├── whatsapp-web.js   # Web-specific skills (search, send, read)
│   └── whatsapp-android.js # Android-specific skills (intents, fallback typing)
├── tests/                # Test suites
│   ├── android-test.js   # Mobile app test script
│   ├── whatsapp.test.js # Browser-based test script
│   └── skills-demo.test.js # Demonstration of reusable skills
├── tools/
│   └── platform-tools/   # Android Debug Bridge (ADB) and utilities
├── .whatsapp-session/    # Persistent browser profile (created on run)
├── package.json          # Dependency and script management
└── README.md             # Quick start guide
```

## 3. The "Skills" Library
To avoid code duplication, core interactions have been modularized into "Skills".

### WhatsApp Web Skills
- `waitForLoad(page)`: Detects when the chat interface is ready.
- `openChat(page, contact)`: Robustly searches for a contact and enters the chat.
- `sendMessage(page, message)`: Types and sends a message.
- `getLatestIncomingMessage(page)`: Scrapes the last message received from the contact.

### WhatsApp Android Skills
- `openChat(device, number)`: Uses Android Intents to skip UI navigation and open chats directly.
- `sendMessage(device, message)`: Intelligent message sending that handles:
    - WhatsApp Business (`com.whatsapp.w4b`)
    - Standard WhatsApp (`com.whatsapp`)
    - Fallback coordinate-based tapping if UI selectors fail.

## 4. Execution Guide

### Prerequisites
- **Node.js** installed.
- **Android Device**: USB Debugging enabled, connected via USB (for mobile tests).
- **Chromium**: Installed via `npx playwright install chromium`.

### Running Tests
The following commands are configured in `package.json`:

| Command | Description |
|---------|-------------|
| `npm run test:web` | Runs the WhatsApp test (Headed). |
| `npm run test:mobile` | Runs the Android native app test. |
| `npm run test:demo` | Runs the skill demonstration script. |

## 5. Session Management
- **Web**: Uses `launchPersistentContext` pointing to `./.whatsapp-session`. This ensures that once you scan the QR code, you stay logged in for subsequent runs.
- **Mobile**: Relies on the WhatsApp app already being logged in on the physical device.

## 6. Maintenance & Troubleshooting
- **ADB Path**: The scripts automatically look for ADB in `./tools/platform-tools/adb.exe`.
- **Selectors**: WhatsApp frequently updates their web UI. If tests fail to find the search box or input field, update the selectors in `skills/whatsapp-web.js`.
- **Mobile Resolution**: The fallback tap coordinates in `whatsapp-android.js` are optimized for standard 1080p screens. Adjust them if using devices with significantly different aspect ratios.

---
*Report generated on: 2026-07-13*
