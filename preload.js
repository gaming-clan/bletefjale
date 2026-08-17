const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  readClipboard: () => ipcRenderer.invoke('clipboard:read'),
  writeClipboard: (text) => ipcRenderer.invoke('clipboard:write', text),
  saveJson: (content) => ipcRenderer.invoke('file:save-json', content),
  openJson: () => ipcRenderer.invoke('file:open-json'),
  importDocument: (sourceLanguage) => ipcRenderer.invoke('document:import', sourceLanguage)
});
