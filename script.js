    // ============ ANTI-DEVTOOLS ============
    (function () {
      var threshold = 160;
      var devtoolsOpen = false;

      function checkDevTools() {
        // Bỏ qua trên điện thoại vì thanh gõ URL ẩn/hiện làm thay đổi kích thước liên tục
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          return;
        }``
        
        var widthDiff = window.outerWidth - window.innerWidth;
        var heightDiff = window.outerHeight - window.innerHeight;
        var isOpen = widthDiff > threshold || heightDiff > threshold;
        if (isOpen && !devtoolsOpen) {
          devtoolsOpen = true;
          location.reload();
        } else if (!isOpen) {
          devtoolsOpen = false;
        }
      }

      setInterval(checkDevTools, 500);

      // Bắt phím F12
      window.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          location.reload();
        }
        // Ctrl+Shift+I / Cmd+Option+I
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
          e.preventDefault();
          location.reload();
        }
        // Ctrl+Shift+J / Cmd+Option+J
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
          e.preventDefault();
          location.reload();
        }
        // Ctrl+U (view source)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
          e.preventDefault();
        }
      });

      // Vô hiệu hoá chuột phải
      window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });
    })();

    // Audio Player variable managed directly from audio element
    // Global state
    let currentImageIndex = 0;
    const albumImages = [];

    // New Envelope Open Sequence
    function openEnvelope() {
      const envelope = document.querySelector('.envelope');
      if (envelope) {
        envelope.classList.add('open');
      }
      
      // Wait for animation stages (Flap 0.6s, Card Float 3.5s with 1s offset)
      // Total approx 4.5s+, so we wait 5.5s for full effect
      setTimeout(() => {
        const landing = document.getElementById('envelope-landing');
        if (landing) {
          landing.classList.add('fade-out');
        }
        
        // Final transition to content
        setTimeout(() => {
          if (landing) landing.style.display = 'none';
          openInvitation();
        }, 1200);
      }, 5500); 
    }

    // Open invitation (Modified for sequence)
    function openInvitation() {
      const cover = document.getElementById('cover');
      if (cover) cover.style.opacity = '0';
      setTimeout(() => { if(cover) cover.style.display = 'none'; }, 800);

      const content = document.getElementById('content');
      if (content) content.classList.add('open');
      
      setupScrollAnimations();
      startCountdown();
      window.scrollTo(0, 0);

      // Play Local Audio
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.play().catch(e => console.log('Audio autoplay blocked', e));
        const btn = document.getElementById('musicBtn');
        if (btn) btn.classList.remove('paused');
      }

      // Load album carousel and wishes from JSON
      setTimeout(() => { 
        loadAlbum(); 
        loadWishes(); 
        // Show audio toggle
        const musicBtn = document.getElementById('musicBtn');
        if (musicBtn) musicBtn.classList.remove('hidden');
      }, 400);
    }

    // Countdown timer
    function startCountdown() {
      const weddingDate = new Date('2026-06-07T11:00:00');
      function update() {
        const now = new Date();
        const diff = weddingDate - now;
        if (diff <= 0) {
          document.getElementById('cd-days').textContent = '00';
          document.getElementById('cd-hours').textContent = '00';
          document.getElementById('cd-mins').textContent = '00';
          document.getElementById('cd-secs').textContent = '00';
          return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
        document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
      }
      update();
      setInterval(update, 1000);
    }

    // Cover petals animation
    (function initCoverPetals() {
      const container = document.getElementById('cover-petals');
      if (!container) return;
      
      const petalCount = 15;
      for (let i = 0; i < petalCount; i++) {
        createCoverPetal(container);
      }
      
      function createCoverPetal(parent) {
        const petal = document.createElement('div');
        petal.className = 'cover-petal';
        
        // Random properties
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 5 + 7;
        
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = left + '%';
        petal.style.animationDelay = delay + 's';
        petal.style.animationDuration = duration + 's';
        
        // Different shapes/opacities
        const opacity = Math.random() * 0.4 + 0.3;
        petal.style.opacity = opacity;
        
        // Random petal svg path can be complex, using simple circles for now with turquoise/white colors
        const colors = ['#B2DFDB', '#E0F2F1', '#ffffff', '#4DB6AC'];
        petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        petal.style.borderRadius = '20% 80% 20% 80%'; // Simple petal shape
        
        parent.appendChild(petal);
      }
    })();

    // Scroll animations
    function setupScrollAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }

    // Scroll to top button
    window.addEventListener('scroll', () => {
      const btn = document.getElementById('scrollTop');
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    });

    // Submit wish to server
    async function submitWish() {
      const name = document.getElementById('wish-name').value.trim();
      const msg = document.getElementById('wish-msg').value.trim();
      if (!name || !msg) { alert('Vui lòng điền đầy đủ thông tin!'); return; }

      const btn = document.querySelector('.wishes-submit');
      const originalText = btn.innerText;
      btn.innerText = 'ĐANG GỬI...';
      btn.disabled = true;

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} · ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      const wish = { name, msg, time: timeStr };

      try {
        const resp = await fetch('save_wish.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wish)
        });

        if (!resp.ok) throw new Error('Cannot save to server');

        // Render immediately
        addWishToUI(wish.name, wish.time, wish.msg);
        document.getElementById('wish-name').value = '';
        document.getElementById('wish-msg').value = '';
        alert('Cảm ơn bạn đã gửi lời chúc!');
      } catch (err) {
        console.warn('Lỗi lưu server, chuyển sang lưu LocalStorage tạm thời:', err);
        // Fallback to localStorage
        const stored = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        stored.unshift(wish);
        localStorage.setItem('wedding_wishes', JSON.stringify(stored));

        addWishToUI(wish.name, wish.time, wish.msg);
        document.getElementById('wish-name').value = '';
        document.getElementById('wish-msg').value = '';
        alert('Lời chúc đã được lưu (Chế độ xem thử Local)! Để lưu thật, cần up web lên máy chủ (Host) có hỗ trợ PHP nhé.');
      } finally {
        btn.innerText = originalText;
        btn.disabled = false;
      }
    }

    // Helper: Add wish to DOM automatically
    function addWishToUI(name, timeStr, msg) {
      const list = document.getElementById('wishes-list');
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
      <div class="wish-header">
        <span class="wish-name">${name}</span>
        <span class="wish-time">${timeStr}</span>
      </div>
      <div class="wish-msg">${msg}</div>`;

      const placeholder = list.querySelector('[style*="Đang tải"], [style*="Chưa có lời chúc"]');
      if (placeholder) placeholder.remove();
      list.insertBefore(card, list.firstChild);
    }

    // Load wishes from wishes.json merged with localStorage
    async function loadWishes() {
      const list = document.getElementById('wishes-list');
      let jsonWishes = [];
      try {
        const resp = await fetch('wishes.json?v=' + Date.now());
        if (resp.ok) jsonWishes = await resp.json();
      } catch (e) { console.warn('wishes.json not found, using localStorage only'); }
      const localWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
      const allWishes = [...localWishes, ...jsonWishes];
      list.innerHTML = '';
      if (allWishes.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#ccc;font-size:0.75rem;padding:20px;">Chưa có lời chúc nào. Hãy là người đầu tiên! 💕</div>';
        return;
      }
      allWishes.forEach(w => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = `
          <div class="wish-header">
            <span class="wish-name">${w.name}</span>
            <span class="wish-time">${w.time || ''}</span>
          </div>
          <div class="wish-msg">${w.msg}</div>`;
        list.appendChild(card);
      });
    }

    // Load album from album/photos.json and build carousel
    async function loadAlbum() {
      const track = document.getElementById('albumTrack');
      if (!track) return;
      let photos = [];
      let settings = { scrollSpeed: 40, cardWidth: 220 };

      const fallbackData = {
        photos: [
          { "file": "1.jpeg" },
          { "file": "2.jpeg" },
          { "file": "3.jpeg" },
          { "file": "4.jpeg" },
          { "file": "5.jpeg" },
          { "file": "6.jpeg" },
          { "file": "7.jpeg" },
          { "file": "8.jpeg" },
          { "file": "9.jpeg" }
        ],
        settings: { scrollSpeed: 40, autoPlay: true, cardWidth: 260, cardHeight: 340 }
      };

      try {
        const resp = await fetch('album/photos.json?v=' + Date.now());
        if (resp.ok) {
          const data = await resp.json();
          photos = data.photos || [];
          settings = Object.assign(settings, data.settings || {});
        } else {
          throw new Error('fetch failed');
        }
      } catch (e) {
        console.warn('album/photos.json load failed, using local fallback data');
        photos = fallbackData.photos;
        settings = Object.assign(settings, fallbackData.settings);
      }

      if (photos.length === 0) {
        // Just in case
        photos = fallbackData.photos;
      }

      // Build cards (duplicate for infinite loop)
      function buildCard(p, idx) {
        const card = document.createElement('div');
        card.className = 'album-card';
        if (!p.placeholder) {
          card.innerHTML = `
            <img class="album-card-img" src="album/${p.file}" alt="${p.caption || ''}" loading="lazy"
              onerror="this.parentElement.innerHTML=buildPlaceholder('${p.caption || '\ud83d\udc8d'}')" />
            <div class="album-card-caption">${p.caption || ''}</div>`;
        } else {
          // Placeholder with rotating icons
          const icons = ['💍', '🌸', '📷', '♥️', '🎂'];
          const icon = icons[idx % icons.length];
          card.innerHTML = `
            <div class="album-placeholder-img">
              <span style="font-size:2.5rem;">${icon}</span>
              <span>${p.caption || 'Ảnh cưới'}</span>
            </div>
            <div class="album-card-caption">${p.caption || ''}</div>`;
        }
        return card;
      }

      // Add original + duplicate for seamless infinite
      albumImages.length = 0; // Reset
      photos.forEach(p => albumImages.push(`album/${p.file}`));

      const allPhotos = [...photos, ...photos];
      allPhotos.forEach((p, i) => {
        const card = buildCard(p, i);
        card.style.cursor = 'pointer';
        card.onclick = () => openLightbox(`album/${p.file}`);
        track.appendChild(card);
      });

      // Set animation duration based on count & speed
      const totalW = photos.length * (settings.cardWidth + 14);
      const dur = Math.max(15, totalW / settings.scrollSpeed);
      track.style.setProperty('--carousel-duration', dur + 's');
      document.querySelector('.album-track').style.animationDuration = dur + 's';

      // Drag to scroll
      const wrap = document.getElementById('albumCarousel');
      let isDown = false, startX, scrollLeft;
      wrap.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - wrap.offsetLeft; scrollLeft = wrap.scrollLeft; wrap.style.animationPlayState = 'paused'; });
      wrap.addEventListener('mouseleave', () => isDown = false);
      wrap.addEventListener('mouseup', () => isDown = false);
      wrap.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX); });
    }

    // Submit RSVP
    function submitRSVP() {
      const name = document.getElementById('rsvp-name').value.trim();
      const attend = document.getElementById('rsvp-attend').value;
      if (!name) { alert('Vui lòng nhập tên của bạn!'); return; }
      const msg = attend === 'yes'
        ? `Cảm ơn ${name}! Chúng tôi rất mong được gặp bạn! 🎉`
        : attend === 'no'
          ? `Cảm ơn ${name} đã phản hồi. Rất tiếc khi không có mặt bạn.`
          : `Cảm ơn ${name}! Chúng tôi sẽ chờ tin bạn nhé!`;
      alert(msg);
      document.getElementById('rsvp-modal').classList.remove('open');
    }

    // Init AOS
    AOS.init({ duration: 800, once: true, offset: 60 });

    // Floating petals
    (function () {
      const container = document.getElementById('petals');
      if (!container) return;
      function makePetal() {
        const p = document.createElement('div');
        p.className = 'petal';
        const size = 8 + Math.random() * 10;
        const isWhite = Math.random() > 0.5;
        const colorStyle = isWhite 
          ? 'background: radial-gradient(circle at 30% 30%, #ffffff, #e0f2f1 80%); border: 0.5px solid rgba(255,255,255,0.8);' 
          : 'background: radial-gradient(circle at 30% 30%, #80CBC4, #26A69A 80%);';

        p.style.cssText = [
          'left:' + Math.random() * 100 + '%',
          'width:' + size + 'px',
          'height:' + size + 'px',
          'animation-duration:' + (6 + Math.random() * 8) + 's',
          'animation-delay:' + (Math.random() * 3) + 's',
          colorStyle
        ].join(';');
        container.appendChild(p);
        setTimeout(() => p.remove(), 14000);
      }
      setInterval(makePetal, 700);
      for (let i = 0; i < 6; i++) setTimeout(makePetal, i * 600);
    })();

    // Music toggle
    function toggleMusic() {
      const btn = document.getElementById('musicBtn');
      const audio = document.getElementById('bg-music');
      if (!audio) return;

      if (audio.paused) {
        audio.play();
        btn.classList.remove('paused');
      } else {
        audio.pause();
        btn.classList.add('paused');
      }
    }

    // ============ LIGHTBOX LOGIC ============
    function openLightbox(src) {
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lightbox-img');
      if (!lb || !lbImg) return;

      lbImg.src = src;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Find index if in album
      try {
        const lbPath = new URL(src, window.location.href).pathname;
        currentImageIndex = albumImages.findIndex(img => new URL(img, window.location.href).pathname === lbPath);
      } catch(e) {
        currentImageIndex = -1;
      }
    }

    function closeLightbox() {
      const lb = document.getElementById('lightbox');
      if (lb) lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    function nextImage(e) {
      if (e) e.stopPropagation();
      if (albumImages.length === 0) return;
      currentImageIndex = (currentImageIndex + 1) % albumImages.length;
      const lbImg = document.getElementById('lightbox-img');
      if (lbImg) lbImg.src = albumImages[currentImageIndex];
    }

    function prevImage(e) {
      if (e) e.stopPropagation();
      if (albumImages.length === 0) return;
      currentImageIndex = (currentImageIndex - 1 + albumImages.length) % albumImages.length;
      const lbImg = document.getElementById('lightbox-img');
      if (lbImg) lbImg.src = albumImages[currentImageIndex];
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      const lb = document.getElementById('lightbox');
      if (lb && lb.classList.contains('open')) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeLightbox();
      }
    });

    // Auto-init
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to ensure everything is ready
      setTimeout(() => {
        if (typeof loadAlbum === 'function') loadAlbum();
        if (typeof loadWishes === 'function') loadWishes();
      }, 500);
    });
