const { _android } = require('@playwright/test');
const path = require('path');
const { android } = require('../skills');

async function runTest() {
  // Set the path to the ADB
  process.env.ADB_PATH = path.join(__dirname, '..', 'tools', 'platform-tools', 'adb.exe');

  console.log('Connecting to device...');
  let device;
  try {
    const devices = await _android.devices();
    if (devices.length === 0) {
      console.error('No Android device found. Make sure USB Debugging is on.');
      return;
    }
    device = devices[0];
  } catch (error) {
    console.error('Error connecting to Android device:', error.message);
    return;
  }

  console.log(`Connected to: ${device.model()}`);

  const aspriNumber = '6287889681231';
  
  // Use skill to open chat
  console.log(`Opening WhatsApp chat with ${aspriNumber}...`);
  await android.openChat(device, aspriNumber);

  // Use skill to send message (handles both WhatsApp & Business)
  const message = 'minta link dashboard';
  console.log(`Sending message: ${message}`);
  await android.sendMessage(device, message);

  console.log('Done! Message sent.');

  await device.close();
}

runTest().catch(console.error);
