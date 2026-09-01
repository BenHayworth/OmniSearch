const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('omniSearch', {
  platform: process.platform,
});
