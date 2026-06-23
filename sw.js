const CACHE_NAME = 'ika-metal-log-v8';
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Noto+Sans+JP:wght@300;400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Skip waiting event via message
self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Offline first / Cache fallback)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => {
        // If fetch fails (like true offline status)
        if (e.request.url.indexOf('index.html') > -1) {
          return caches.match('index.html');
        }
      });
    })
  );
});
