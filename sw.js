const CACHE_NAME = 'wedding-invitation-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  'https://unpkg.com/aos@2.3.4/dist/aos.css',
  'https://unpkg.com/aos@2.3.4/dist/aos.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Be+Vietnam+Pro:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap',
  // Add common images and icons
  '/elements/flower6.svg',
  '/elements/flower8.svg',
  '/elements/background_ceremony_info.svg',
  '/elements/image copy 5.png',
  '/elements/image copy 8.png',
  '/music/phep_mau.mp3'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching all assets');
        return cache.addAll(ASSETS);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch Assets
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          // Optional: still cache new things like photos, but return network response
          if (event.request.url.includes('/album/')) {
             cache.put(event.request.url, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      // If offline and not in cache
      if (event.request.url.indexOf('.html') > -1) {
        return caches.match('/index.html');
      }
    })
  );
});
