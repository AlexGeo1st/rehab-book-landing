# Возвращение в игру — лендинг книги по спортивной реабилитации (учебный проект)

Адаптивный лендинг на **чистом HTML/CSS/JS** (без сборщиков и серверов).  
Тема: презентация книги о спортивной реабилитации спортсменов на примере баскетбола.

## Что реализовано
- Семантическая вёрстка: `header / main / section / footer`
- Адаптивность: Flexbox/Grid + медиа-запросы
- Интерактив на чистом JS:
  - бургер-меню для мобильной версии
  - табы (переключение кейсов)
  - модальное окно с формой заявки (валидация + localStorage демо)
  - слайдер галереи (изображения из массива)

## Структура проекта
```
rehab-book-landing/
  index.html
  css/style.css
  js/main.js
  assets/img/...
  PRACTICE_REPORT.md
```

## Как запустить локально
1) Скачайте проект  
2) Откройте `index.html` двойным кликом в браузере  
(или через расширение Live Server в VS Code — по желанию)

## Публикация на GitHub Pages (вариант через веб-интерфейс)
1) Создайте репозиторий на GitHub (например, `rehab-book-landing`)
2) Загрузите файлы проекта в репозиторий (Upload files)
3) Откройте **Settings → Pages**
4) В разделе **Build and deployment** выберите:
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
5) Сохраните — GitHub выдаст ссылку на сайт

## Публикация на GitHub Pages (через git-команды)
```bash
git clone https://github.com/AlexGeo1st/rehab-book-landing.git
cd rehab-book-landing

# Скопируйте сюда файлы проекта, затем:
git add .
git commit -m "Add landing page (practice project)"
git push

# Далее: Settings → Pages → Deploy from branch (main / root)
```

## Примечание
Контакты и “отправка” формы — учебные. Форма сохраняет данные в `localStorage` для демонстрации.
