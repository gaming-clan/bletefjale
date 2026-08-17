const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  readClipboard: () => ipcRenderer.invoke('clipboard:read'),
  writeClipboard: (text) => ipcRenderer.invoke('clipboard:write', text),
  saveJson: (content, options) => ipcRenderer.invoke('file:save-json', content, options),
  openJson: (options) => ipcRenderer.invoke('file:open-json', options),
  importDocument: (sourceLanguage) => ipcRenderer.invoke('document:import', sourceLanguage)
});
