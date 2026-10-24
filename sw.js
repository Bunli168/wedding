const CACHE_NAME = 'wedding-khea-kanha-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './style.css?v=6.6',
  './script.js?v=4.2',
  './manifest.webmanifest',
  './assets/images/favicon.png',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/images/apple-touch-icon.png',
  './assets/images/heroFrame.jpg',
  './assets/images/button.jpg',
  './assets/images/couple_real_1.jpg',
  './assets/images/couple_real_2.jpg',
  './assets/images/couple_real_4.jpg',
  './assets/images/couple_real_7.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Pre-cache partial fail:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip range requests (like audio stream) for direct network
  if (event.request.method !== 'GET') return;
  if (event.request.headers.get('range')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background if online
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      });
    })
  );
});
