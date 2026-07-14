const { _android } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function dumpTree() {
  process.env.ADB_PATH = path.join(__dirname, 'tools', 'platform-tools', 'adb.exe');
  const devices = await _android.devices();
  if (devices.length === 0) {
    console.error('No device found');
    return;
  }
  const device = devices[0];
  
  console.log('Capturing current screen...');
  const tree = await device.shell('uiautomator dump /sdcard/view.xml');
  await device.shell('pull /sdcard/view.xml .');
  
  await device.screenshot({ path: 'current_screen.png' });
  console.log('Screenshot saved to current_screen.png');

  await device.close();
}

dumpTree().catch(console.error);
