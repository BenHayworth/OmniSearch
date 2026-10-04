const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('omniSearch', {
  platform: process.platform,
  selectKnowledgeFolder: () => ipcRenderer.invoke('select-knowledge-folder'),

  search: (folder) => ipcRenderer.invoke('search', folder)
});
