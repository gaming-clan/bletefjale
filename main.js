const { app, BrowserWindow, clipboard, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 680,
    backgroundColor: '#f7f2e7',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());
}

app.whenReady().then(() => {
  ipcMain.handle('clipboard:read', () => clipboard.readText());
  ipcMain.handle('clipboard:write', (_event, text) => {
    clipboard.writeText(String(text || ''));
    return true;
  });
  ipcMain.handle('file:save-json', async (_event, content, options = {}) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: options.title || 'Ruaj fjalorin personal',
      defaultPath: options.defaultPath || 'fjalori-im-i-bletarise.json',
      filters: [{ name: 'Skedar JSON', extensions: ['json'] }]
    });
    if (canceled || !filePath) return { saved: false };
    fs.writeFileSync(filePath, content, 'utf8');
    return { saved: true, filePath };
  });
  ipcMain.handle('file:open-json', async (_event, options = {}) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: options.title || 'Ngarko fjalor personal',
      properties: ['openFile'],
      filters: [{ name: 'Skedar JSON', extensions: ['json'] }]
    });
    if (canceled || !filePaths[0]) return { canceled: true };
    return { canceled: false, content: fs.readFileSync(filePaths[0], 'utf8') };
  });


  ipcMain.handle('document:import', async (_event, sourceLanguage) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Zgjidh imazh ose dokument për përkthim',
      properties: ['openFile'],
      filters: [
        { name: 'Skedarë të mbështetur', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tif', 'tiff', 'pdf', 'docx', 'txt', 'md', 'csv'] },
        { name: 'Imazhe', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tif', 'tiff'] },
        { name: 'Dokumente', extensions: ['pdf', 'docx', 'txt', 'md', 'csv'] }
      ]
    });
    if (canceled || !filePaths[0]) return { canceled: true };

    const filePath = filePaths[0];
    const extension = path.extname(filePath).toLowerCase();
    const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff']);
    const textExtensions = new Set(['.txt', '.md', '.csv']);

    try {
      let text = '';
      let type = 'document';
      if (imageExtensions.has(extension)) {
        type = 'image';
        const ocrLanguages = { sq: 'sqi', en: 'eng', it: 'ita', de: 'deu', fr: 'fra', es: 'spa', tr: 'tur', el: 'ell' };
        const worker = await Tesseract.createWorker(ocrLanguages[sourceLanguage] || 'eng');
        const recognition = await worker.recognize(filePath);
        await worker.terminate();
        text = recognition.data.text;
      } else if (extension === '.pdf') {
        const parsed = await pdf(fs.readFileSync(filePath));
        text = parsed.text;
      } else if (extension === '.docx') {
        const extracted = await mammoth.extractRawText({ path: filePath });
        text = extracted.value;
      } else if (textExtensions.has(extension)) {
        text = fs.readFileSync(filePath, 'utf8');
      } else {
        throw new Error('Formati i skedarit nuk mbështetet.');
      }

      text = String(text || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
      if (!text) {
        throw new Error(extension === '.pdf' ? 'PDF-ja nuk përmban tekst të lexueshëm. Për një PDF të skanuar, përdorni faqet si imazhe.' : 'Nuk u gjet tekst i lexueshëm në këtë skedar.');
      }
      return { canceled: false, fileName: path.basename(filePath), type, text };
    } catch (error) {
      return { canceled: false, error: error.message || 'Leximi i skedarit nuk u krye.' };
    }
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
