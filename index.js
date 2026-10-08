const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { handleSearch } = require('./ipc/search');

function createWindow() {
  const window = new BrowserWindow({
    width: 960,
    height: 680,
    minWidth: 720,
    minHeight: 520,
    title: 'OmniSearch',
    backgroundColor: '#f4f5f7',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadFile(path.join(__dirname, 'src', 'index.html'));
}

const pythonPath = path.join(
  __dirname,
  '.OmniSearchvenv',
  'Scripts',
  'python.exe'
);

const scriptPath = path.join(
  __dirname,
  'python',
  'run_search.py'
);

const pythonProcess = spawn(
  pythonPath, [scriptPath]
);

pythonProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

pythonProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

app.whenReady().then(() => {
  ipcMain.handle('select-knowledge-folder', async (event) => {
    const owner = BrowserWindow.fromWebContents(event.sender);
    const options = {
      title: 'Select a folder',
      properties: ['openDirectory'],
    };
    const result = owner
      ? await dialog.showOpenDialog(owner, options)
      : await dialog.showOpenDialog(options);
    return result.canceled ? null : result.filePaths[0] || null;
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.handle('search', handleSearch);
ipcMain.handle('add-to-knowledge', async (event, files) => {
  const response = await fetch('http://127.0.0.1:5000/knowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files }),
  });
  if (!response.ok) throw new Error('Could not save files.');
  return response.json();
});
ipcMain.handle('get-knowledge', async () => {
  const response = await fetch('http://127.0.0.1:5000/knowledge');
  if (!response.ok) throw new Error('Could not load saved files.');
  return response.json();
});
