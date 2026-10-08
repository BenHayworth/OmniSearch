const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('omniSearch', {
  platform: process.platform,
  addToKnowledge: (files) => ipcRenderer.invoke('add-to-knowledge', files),
  getKnowledge: () => ipcRenderer.invoke('get-knowledge'),
  deleteKnowledge: (files) => ipcRenderer.invoke('delete-knowledge', files),
  selectKnowledgeFolder: () => ipcRenderer.invoke('select-knowledge-folder'),

  search: (folder) => ipcRenderer.invoke('search', folder)
});
