# Assets - Иконки приложения

## Структура

```
assets/
├── icon.svg           # Исходная векторная иконка
├── icon.png           # Иконка для Linux (512x512)
├── icon.ico           # Иконка для Windows (создается при сборке)
└── icon.icns          # Иконка для macOS (создается при сборке)
```

## Как создать иконки для разных платформ

### Автоматическая генерация (рекомендуется)

Используйте пакет `electron-icon-builder`:

```bash
npm install --save-dev electron-icon-builder
npx electron-icon-builder --input=./assets/icon.svg --output=./assets --flatten
```

### Вручную

#### Windows (.ico)
1. Конвертируйте SVG в PNG размером 256x256
2. Используйте онлайн-сервис: https://convertio.co/png-ico/
3. Или используйте ImageMagick:
   ```bash
   convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
   ```

#### macOS (.icns)
1. Создайте PNG размером 1024x1024
2. Используйте онлайн-сервис: https://cloudconvert.com/png-to-icns
3. Или используйте `iconutil` (только на macOS):
   ```bash
   mkdir icon.iconset
   sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
   sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
   sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
   sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
   sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
   sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
   sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
   sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
   sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
   sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
   iconutil -c icns icon.iconset
   ```

#### Linux (.png)
Просто конвертируйте SVG в PNG размером 512x512:
```bash
convert -background none icon.svg -resize 512x512 icon.png
```

## Текущий статус

✅ **icon.svg** - готов (базовая версия с буквой "G" и индикатором AI)

⚠️ **Остальные форматы** - нужно создать перед сборкой

## Рекомендации

1. Дизайн иконки можно улучшить, обратившись к дизайнеру
2. Для временного использования можно конвертировать SVG онлайн
3. Цвет фона (#00B956) - зеленый корпоративный цвет МегаФона

## Быстрый старт

Если нужно быстро получить все форматы иконок:

```bash
# Установите electron-icon-builder
npm install --save-dev electron-icon-builder

# Создайте PNG из SVG (используйте онлайн конвертер или Inkscape)
# Затем сгенерируйте все форматы:
npx electron-icon-builder --input=./assets/icon.png --output=./assets
```
