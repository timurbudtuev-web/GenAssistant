// Конфигурация приложения
// Этот файл помогает безопасно управлять API ключами

const Store = require('electron-store');
const store = new Store();

// Получить API ключ из разных источников (приоритет сверху вниз)
function getApiKey() {
  // 1. Из переменных окружения (самый безопасный способ)
  if (process.env.ANTHROPIC_API_KEY) {
    return process.env.ANTHROPIC_API_KEY;
  }

  // 2. Из сохраненных настроек
  const savedKey = store.get('anthropic_api_key');
  if (savedKey) {
    return savedKey;
  }

  // 3. Если ключ не найден
  return null;
}

// Сохранить API ключ
function saveApiKey(apiKey) {
  store.set('anthropic_api_key', apiKey);
}

// Удалить API ключ
function deleteApiKey() {
  store.delete('anthropic_api_key');
}

// Проверить наличие API ключа
function hasApiKey() {
  return getApiKey() !== null;
}

module.exports = {
  getApiKey,
  saveApiKey,
  deleteApiKey,
  hasApiKey
};
