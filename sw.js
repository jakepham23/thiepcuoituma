// ĐỔI TÊN CACHE Ở ĐÂY MỖI KHI CẬP NHẬT CODE MỚI LÊN VERCEL
const CACHE_NAME = 'wedding-invitation-v5'; 

const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  'https://unpkg.com/aos@2.3.4/dist/aos.css',
  'https://unpkg.com/aos@2.3.4/dist/aos.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Be+Vietnam+Pro:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap',
  '/elements/flower6.svg',
  '/elements/flower8.svg',
  '/elements/background_ceremony_info.svg',
  '/elements/image copy 5.png',
  '/elements/image copy 8.png',
  '/music/phep_mau.mp3'
];

// 1. Cài đặt và ép kích hoạt bản mới ngay lập tức
self.addEventListener('install', event => {
  self.skipWaiting(); // Bỏ qua trạng thái chờ (waiting)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Đang lưu cache bản mới:', CACHE_NAME);
        return cache.addAll(ASSETS);
      })
  );
});

// 2. Kích hoạt, dọn dẹp cache cũ và chiếm quyền điều khiển các tab đang mở
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => {
          console.log('Đã xóa cache cũ:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      // Ép Service Worker mới điều khiển ngay các trang đang mở
      return self.clients.claim(); 
    })
  );
});

// 3. Trả về file từ Cache hoặc Fetch từ Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.url.includes('/album/')) {
             cache.put(event.request.url, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      // Nếu mất mạng và không có trong cache
      if (event.request.url.indexOf('.html') > -1) {
        return caches.match('/index.html');
      }
    })
  );
});
