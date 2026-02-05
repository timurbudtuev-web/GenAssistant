console.log('Loading electron...');
const electronModule = require('electron');
console.log('Electron module:', typeof electronModule, electronModule);
const { app, BrowserWindow, ipcMain } = electronModule;
console.log('app:', typeof app, app);
const path = require('path');

// Безопасная загрузка dotenv
try {
  require('dotenv').config();
} catch (err) {
  console.log('dotenv not available, using environment variables only');
}

let Store, store, config;
try {
  Store = require('electron-store');
  store = new Store();
  config = require('./config');

  // Если API ключ есть в .env, но не в store - сохранить его
  if (process.env.ANTHROPIC_API_KEY && !store.get('anthropic_api_key')) {
    store.set('anthropic_api_key', process.env.ANTHROPIC_API_KEY);
    console.log('✅ API ключ из .env сохранен в store');
  }
} catch (err) {
  console.log('electron-store or config not available, using basic mode');
  // Fallback режим без store
  store = {
    get: () => null,
    set: () => {},
    delete: () => {}
  };
  config = {
    getApiKey: () => process.env.ANTHROPIC_API_KEY || null,
    saveApiKey: () => {},
    deleteApiKey: () => {},
    hasApiKey: () => !!process.env.ANTHROPIC_API_KEY
  };
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: '#F5F5F5'
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for saving/loading data
ipcMain.handle('save-data', async (event, key, value) => {
  store.set(key, value);
  return { success: true };
});

ipcMain.handle('load-data', async (event, key) => {
  return store.get(key);
});

ipcMain.handle('delete-data', async (event, key) => {
  store.delete(key);
  return { success: true };
});

// Window controls
ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});

// API Key management
ipcMain.handle('get-api-key', async () => {
  return config.getApiKey();
});

ipcMain.handle('save-api-key', async (event, apiKey) => {
  config.saveApiKey(apiKey);
  return { success: true };
});

ipcMain.handle('delete-api-key', async () => {
  config.deleteApiKey();
  return { success: true };
});

ipcMain.handle('has-api-key', async () => {
  return config.hasApiKey();
});
