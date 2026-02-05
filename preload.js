// Preload скрипт для безопасного доступа к API ключу
// Этот файл запускается перед загрузкой index.html

const { ipcRenderer } = require('electron');

// Экспортируем API для работы с ключом
window.electronAPI = {
  // Получить API ключ
  getApiKey: () => ipcRenderer.invoke('get-api-key'),

  // Сохранить API ключ
  saveApiKey: (apiKey) => ipcRenderer.invoke('save-api-key', apiKey),

  // Удалить API ключ
  deleteApiKey: () => ipcRenderer.invoke('delete-api-key'),

  // Проверить наличие API ключа
  hasApiKey: () => ipcRenderer.invoke('has-api-key'),

  // Управление данными
  saveData: (key, value) => ipcRenderer.invoke('save-data', key, value),
  loadData: (key) => ipcRenderer.invoke('load-data', key),
  deleteData: (key) => ipcRenderer.invoke('delete-data', key),

  // Управление окном
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window')
};

console.log('Preload script loaded successfully');
