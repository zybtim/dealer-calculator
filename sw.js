
const CACHE_NAME = 'dealer-calc-v1.2'; // При обновлении кода меняем версию тут
const ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/constants.ts',
  '/types.ts'
];

// Установка: кэшируем файлы
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Форсируем активацию нового SW сразу
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация: удаляем старые кэши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Запросы: стратегия "Network First, fallback to Cache"
// Это лучше для часто обновляемых приложений
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
