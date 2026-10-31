/**
 * Khmer Wedding Celebration - Interactive Application Logic
 * Couple: Sok Visal & Chea Rachana
 */

document.addEventListener('DOMContentLoaded', () => {
  killNetlifyBadge();
  initEnvelopeOpening();
  initHeroSwiper();
  initCountdown();
  initFrameSwiper();
  initParticlesCanvas();
  initTraditionalAudio();
  initRSVP();
  initWishesGuestbook();
  initCalendarDownload();
  initMobileBottomNav();
  initScrollProgressBar();
  initScrollReveal();
  initInteractiveSacredRing();
  initPWAInstall();
});

// Remove Netlify HUD / Badge from DOM
function killNetlifyBadge() {
  const removeHud = () => {
    const el = document.getElementById('nl-badge-frame') ||
               document.getElementById('nl-hud-frame') ||
               document.querySelector('iframe[title*="Netlify"]') ||
               document.querySelector('iframe[src*="netlify"]');
    if (el) {
      el.remove();
    }
  };
  removeHud();
  const obs = new MutationObserver(() => removeHud());
  obs.observe(document.documentElement, { childList: true, subtree: true });
}

/* ==========================================================================
   0. Hero Banner Swiper / Slider
   ========================================================================== */
function initHeroSwiper() {
  const heroSwiperEl = document.getElementById('heroSwiper');
  if (!heroSwiperEl) return;

  const currentSlideNum = document.getElementById('currentSlideNum');

  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('#heroSwiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 1400,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      grabCursor: true,
      pagination: {
        el: '.hero-swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      on: {
        slideChange: function () {
          if (currentSlideNum) {
            // realIndex is 0-indexed
            const realIndex = (this.realIndex || 0) + 1;
            currentSlideNum.textContent = String(realIndex).padStart(2, '0');
          }
        }
      }
    });
  } else {
    // Offline / CDN fallback: gentle class-based crossfade
    const slides = heroSwiperEl.querySelectorAll('.swiper-slide');
    if (!slides.length) return;
    let activeIdx = 0;
    setInterval(() => {
      slides[activeIdx].classList.remove('swiper-slide-active');
      activeIdx = (activeIdx + 1) % slides.length;
      slides[activeIdx].classList.add('swiper-slide-active');
      if (currentSlideNum) {
        currentSlideNum.textContent = String(activeIdx + 1).padStart(2, '0');
      }
    }, 5500);
  }
}

/* ==========================================================================
   1. Live Countdown Timer to Auspicious Wedding Day
   ========================================================================== */
function initCountdown() {
  // Target: February 19, 2027, 17:30:00 (Phnom Penh time UTC+7)
  const weddingDate = new Date('2027-02-19T17:30:00+07:00').getTime();

  const daysEl = document.getElementById('daysCount');
  const hoursEl = document.getElementById('hoursCount');
  const minutesEl = document.getElementById('minutesCount');
  const secondsEl = document.getElementById('secondsCount');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   3. Khmer Master Frame Swiper
   ========================================================================== */

/* ==========================================================================
   3. Khmer Master Frame Swiper
   ========================================================================== */
function initFrameSwiper() {
  const frameSwiperEl = document.getElementById('frameSwiper');
  if (!frameSwiperEl || typeof Swiper === 'undefined') return;

  const frameSwiper = new Swiper('#frameSwiper', {
    loop: true,
    speed: 650,
    effect: 'slide',
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    }
  });

  // Also allow clicking on master frame image to go to next slide
  frameSwiperEl.addEventListener('click', () => {
    frameSwiper.slideNext();
  });
}

/* ==========================================================================
   4. Floating Traditional Khmer Plumeria (ផ្កាចំប៉ី/ផ្កាចម្ប៉ា) & Gold Sparkle Canvas
   ========================================================================== */
function initParticlesCanvas() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Preload authentic Khmer flower blossoms from user image
  const flowerSources = [
    'assets/images/flower_blossom_1.png',
    'assets/images/flower_blossom_2.png',
    'assets/images/flower_blossom_3.png',
    'assets/images/flower_cluster.png'
  ];

  const flowerImgs = flowerSources.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  const isMobile = window.innerWidth <= 768;
  const particlesCount = isMobile ? 22 : 36;
  const particles = [];
  const burstParticles = [];

  class KhmerFlowerParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -40 - Math.random() * 50;
      this.isGoldSparkle = Math.random() < 0.25; // 25% royal golden sparkle, 75% Khmer flower blossoms

      if (this.isGoldSparkle) {
        this.size = 2 + Math.random() * 3.5;
        this.speedY = 0.5 + Math.random() * 0.9;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = 0.4 + Math.random() * 0.5;
        this.twinkleSpeed = 0.03 + Math.random() * 0.04;
        this.twinklePhase = Math.random() * Math.PI * 2;
      } else {
        // Khmer Plumeria Flower Blossom (ផ្កាចំប៉ី/ផ្កាចម្ប៉ា)
        const flowerIdx = Math.floor(Math.random() * 3);
        const isCluster = Math.random() < 0.05; // Rare small cluster
        this.img = isCluster ? flowerImgs[3] : flowerImgs[flowerIdx];
        
        // Delicate, graceful flower petal sizing
        const baseSize = isMobile ? 8 : 11;
        const sizeVariance = isMobile ? 5 : 7;
        let s = baseSize + Math.random() * sizeVariance;
        if (isCluster) {
          s *= 1.25;
        } else if (flowerIdx === 1 || flowerIdx === 2) {
          s *= 0.88;
        }
        this.size = s;
        this.speedY = 0.45 + Math.random() * 0.7;
        this.swaySpeed = 0.007 + Math.random() * 0.012;
        this.swayAmp = 0.6 + Math.random() * 0.9;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.012;
        this.opacity = 0.6 + Math.random() * 0.28;
      }
    }

    update() {
      if (this.isGoldSparkle) {
        this.y += this.speedY;
        this.x += this.speedX;
        this.twinklePhase += this.twinkleSpeed;
      } else {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.009 + this.swayPhase) * this.swayAmp;
        this.rotation += this.rotationSpeed;
      }

      if (this.y > height + 50 || this.x < -50 || this.x > width + 50) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();

      if (this.isGoldSparkle) {
        const curOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.twinklePhase));
        ctx.globalAlpha = Math.max(0, Math.min(1, curOpacity));
        ctx.translate(this.x, this.y);
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
          const aspect = this.img.naturalWidth / this.img.naturalHeight;
          const drawW = aspect >= 1 ? this.size : this.size * aspect;
          const drawH = aspect >= 1 ? this.size / aspect : this.size;
          ctx.drawImage(this.img, -drawW / 2, -drawH / 2, drawW, drawH);
        }
      }

      ctx.restore();
    }
  }

  /* Interactive Celebratory Confetti & Petal Burst Particle */
  class BurstParticle {
    constructor(x, y, options = {}) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = (options.power || 3.5) + Math.random() * (options.spreadSpeed || 7);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (options.lift || 2.5);
      this.gravity = 0.13 + Math.random() * 0.08;
      this.drag = 0.982;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.14;
      this.opacity = 1;
      this.fadeSpeed = 0.009 + Math.random() * 0.012;

      const typeRand = Math.random();
      if (options.heartsOnly || (options.hearts && typeRand < 0.45)) {
        this.type = 'heart';
        const hearts = ['💖', '💕', '❤️', '💛', '🌸'];
        this.char = hearts[Math.floor(Math.random() * hearts.length)];
        this.size = 14 + Math.random() * 12;
      } else if (typeRand < 0.4) {
        this.type = 'sparkle';
        this.size = 3 + Math.random() * 4.5;
        this.color = Math.random() < 0.65 ? '#ffd700' : '#fff2a3';
      } else {
        this.type = 'flower';
        const flowerIdx = Math.floor(Math.random() * 3);
        this.img = flowerImgs[flowerIdx];
        this.size = 14 + Math.random() * 14;
      }
    }

    update() {
      this.vx *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.opacity -= this.fadeSpeed;
      return this.opacity > 0;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

      if (this.type === 'heart') {
        ctx.font = `${this.size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char, 0, 0);
      } else if (this.type === 'sparkle') {
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'flower') {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
          const aspect = this.img.naturalWidth / this.img.naturalHeight;
          const drawW = aspect >= 1 ? this.size : this.size * aspect;
          const drawH = aspect >= 1 ? this.size / aspect : this.size;
          ctx.drawImage(this.img, -drawW / 2, -drawH / 2, drawW, drawH);
        }
      }

      ctx.restore();
    }
  }

  // Globally accessible trigger function for celebration bursts
  window.triggerCelebrationBurst = function (x, y, options = {}) {
    const count = options.count || 45;
    for (let i = 0; i < count; i++) {
      burstParticles.push(new BurstParticle(x, y, options));
    }
  };

  for (let i = 0; i < particlesCount; i++) {
    particles.push(new KhmerFlowerParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Ambient falling flower blossoms & sparkles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // 2. Interactive celebratory petal/heart burst particles
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const alive = burstParticles[i].update();
      if (alive) {
        burstParticles[i].draw();
      } else {
        burstParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   Envelope Opening & Entry into Home Page
   ========================================================================== */
function initEnvelopeOpening() {
  const overlay = document.getElementById('envelopeOverlay');
  const btnOpen = document.getElementById('btnOpenEnvelope');
  const waxSeal = document.getElementById('waxSeal');
  const audioEl = document.getElementById('weddingAudio');

  if (!overlay) return;

  function triggerOpenAndMusic() {
    // 1. Play Traditional Wedding Song automatically
    if (audioEl) {
      audioEl.volume = 1.0;
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Autoplay deferred until further user gesture:', err);
          // Fallback: unlock on next user gesture (tap/scroll/click)
          const unlockAudio = () => {
            if (audioEl.paused) {
              audioEl.play().catch(() => {});
            }
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
          };
          document.addEventListener('click', unlockAudio, { once: true });
          document.addEventListener('touchstart', unlockAudio, { once: true });
        });
      }
    }

    // 2. Trigger Royal Flower & Golden Sparkle Celebration Burst
    if (window.triggerCelebrationBurst) {
      const sealRect = waxSeal ? waxSeal.getBoundingClientRect() : null;
      const x = sealRect ? sealRect.left + sealRect.width / 2 : window.innerWidth / 2;
      const y = sealRect ? sealRect.top + sealRect.height / 2 : window.innerHeight / 2;
      window.triggerCelebrationBurst(x, y, { count: 65, power: 5, spreadSpeed: 9, hearts: true });
      setTimeout(() => {
        window.triggerCelebrationBurst(window.innerWidth / 2, window.innerHeight * 0.45, { count: 45, hearts: true });
      }, 240);
    }

    // 3. Animate envelope opening transition
    overlay.classList.add('opened');
    document.body.classList.remove('envelope-active');

    // 4. Smooth scroll to top of hero page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btnOpen) {
    btnOpen.addEventListener('click', triggerOpenAndMusic);
  }
  if (waxSeal) {
    waxSeal.style.cursor = 'pointer';
    waxSeal.addEventListener('click', triggerOpenAndMusic);
  }
}

/* ==========================================================================
   5. Traditional Khmer Wedding Audio Player (ជំនោររសាយ ទឹកហូរលាន់ឡុង - សុត សាវុធ)
   ========================================================================== */
function initTraditionalAudio() {
  const audioEl = document.getElementById('weddingAudio');
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');
  const floatingPill = document.getElementById('floatingMusicPill');
  const pillPlayIcon = document.getElementById('pillPlayIcon');
  const musicWave = document.getElementById('musicWave');

  if (!audioEl) return;

  function updateUI(playing) {
    if (playing) {
      if (musicBtn) {
        musicBtn.classList.add('playing');
        const textEl = musicBtn.querySelector('.music-text');
        if (textEl) textEl.textContent = 'បិទភ្លេង';
      }
      if (musicIcon) musicIcon.textContent = '🎶';
      if (floatingPill) floatingPill.classList.add('playing');
      if (pillPlayIcon) pillPlayIcon.textContent = '⏸';
    } else {
      if (musicBtn) {
        musicBtn.classList.remove('playing');
        const textEl = musicBtn.querySelector('.music-text');
        if (textEl) textEl.textContent = 'ភ្លេងការ';
      }
      if (musicIcon) musicIcon.textContent = '🎵';
      if (floatingPill) floatingPill.classList.remove('playing');
      if (pillPlayIcon) pillPlayIcon.textContent = '▶';
    }
  }

  // React to audio events directly
  audioEl.addEventListener('play', () => updateUI(true));
  audioEl.addEventListener('pause', () => updateUI(false));
  audioEl.addEventListener('ended', () => updateUI(false));

  function toggleAudio() {
    if (audioEl.paused) {
      audioEl.play().catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    } else {
      audioEl.pause();
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  if (floatingPill) {
    floatingPill.addEventListener('click', () => {
      toggleAudio();
    });
  }
}

/* ==========================================================================
   Photo Gallery Modal Lightbox
   ========================================================================== */
/* ==========================================================================
   Photo Gallery Modal Lightbox with Full Next/Previous Navigation
   ========================================================================== */
const GALLERY_PHOTOS = [
  { src: 'assets/images/hero_photo.jpg', caption: 'រូបថតមង្គលការពេញតួ ឃា & កញ្ញា' },
  { src: 'assets/images/couple_real_1.jpg', caption: 'ស្នាមញញឹមនៃក្តីស្រឡាញ់' },
  { src: 'assets/images/couple_real_2.jpg', caption: 'គ្រាដ៏មានអត្ថន័យ' },
  { src: 'assets/images/couple_real_3.jpg', caption: 'ទិដ្ឋភាពអនុស្សាវរីយ៍ផ្អែមល្ហែម' },
  { src: 'assets/images/couple_real_4.jpg', caption: 'ក្តីស្រឡាញ់ជារៀងរហូត' },
  { src: 'assets/images/couple_real_5.jpg', caption: 'ចំណងនិស្ស័យគូព្រេង' },
  { src: 'assets/images/couple_real_6.jpg', caption: 'គូស្វាមីភរិយាសិរីមង្គល' }
];

let currentModalPhotoIdx = 0;

function updateModalPhoto(animate = true) {
  const modalImg = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const counterEl = document.getElementById('modalPhotoCounter');
  if (!modalImg) return;

  const current = GALLERY_PHOTOS[currentModalPhotoIdx];
  if (!current) return;

  if (animate) {
    modalImg.classList.add('changing');
    setTimeout(() => {
      modalImg.src = current.src;
      if (captionEl) captionEl.textContent = current.caption;
      if (counterEl) {
        counterEl.textContent = `${String(currentModalPhotoIdx + 1).padStart(2, '0')} / ${String(GALLERY_PHOTOS.length).padStart(2, '0')}`;
      }
      modalImg.classList.remove('changing');
    }, 140);
  } else {
    modalImg.src = current.src;
    if (captionEl) captionEl.textContent = current.caption;
    if (counterEl) {
      counterEl.textContent = `${String(currentModalPhotoIdx + 1).padStart(2, '0')} / ${String(GALLERY_PHOTOS.length).padStart(2, '0')}`;
    }
  }
}

window.openPhotoModal = function(target, fallbackCaption) {
  const modal = document.getElementById('photoLightboxModal');
  if (!modal) return;

  if (typeof target === 'number') {
    currentModalPhotoIdx = Math.max(0, Math.min(GALLERY_PHOTOS.length - 1, target));
  } else if (typeof target === 'string') {
    const foundIdx = GALLERY_PHOTOS.findIndex(p => p.src === target);
    currentModalPhotoIdx = foundIdx !== -1 ? foundIdx : 0;
  } else {
    currentModalPhotoIdx = 0;
  }

  updateModalPhoto(false);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closePhotoModal = function() {
  const modal = document.getElementById('photoLightboxModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

window.nextPhotoModal = function(e) {
  if (e) e.stopPropagation();
  currentModalPhotoIdx = (currentModalPhotoIdx + 1) % GALLERY_PHOTOS.length;
  updateModalPhoto(true);
};

window.prevPhotoModal = function(e) {
  if (e) e.stopPropagation();
  currentModalPhotoIdx = (currentModalPhotoIdx - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
  updateModalPhoto(true);
};

// Keyboard Arrow & Escape Navigation
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('photoLightboxModal');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    window.closePhotoModal();
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    window.nextPhotoModal();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    window.prevPhotoModal();
  }
});

// Mobile Touch Swipe Navigation
(function initModalSwipe() {
  const modal = document.getElementById('photoLightboxModal');
  if (!modal) return;

  let touchStartX = 0;
  let touchStartY = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Detect horizontal swipe if greater than vertical motion
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        window.nextPhotoModal(); // Swiped left -> Next
      } else {
        window.prevPhotoModal(); // Swiped right -> Previous
      }
    }
  }, { passive: true });
})();

/* ==========================================================================
   6. RSVP Form Submission Handling
   ========================================================================== */
function initRSVP() {
  const form = document.getElementById('rsvpForm');
  const feedback = document.getElementById('rsvpFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const guestName = document.getElementById('guestName')?.value || 'ភ្ញៀវកិត្តិយស';
    const guestPhone = document.getElementById('guestPhone')?.value || '';
    const guestCount = document.getElementById('guestCount')?.value || '1';
    const attendance = document.getElementById('attendanceStatus')?.value || 'yes';

    // Store in localStorage
    const savedResponses = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    savedResponses.push({
      name: guestName,
      phone: guestPhone,
      count: guestCount,
      attendance,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wedding_rsvps', JSON.stringify(savedResponses));

    // Trigger Joyful Celebration Burst
    if (window.triggerCelebrationBurst) {
      const btn = document.getElementById('btnSubmitRsvp');
      const rect = btn ? btn.getBoundingClientRect() : null;
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      window.triggerCelebrationBurst(x, y, { count: 55, power: 4.5, spreadSpeed: 8, hearts: true });
    }

    // Show beautiful success notification
    feedback.className = 'form-feedback success';
    feedback.style.display = 'block';
    feedback.innerHTML = `
      🎉 សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅ <strong>${escapeHtml(guestName)}</strong>!<br>
      ការឆ្លើយតបរបស់អ្នកត្រូវបានកត់ត្រាដោយជោគជ័យ។ គ្រួសារទាំងសងខាងរីករាយស្វាគមន៍វត្តមានរបស់អ្នក!
    `;

    form.reset();

    setTimeout(() => {
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  });
}

/* ==========================================================================
   7. Wishes & Blessings Guestbook
   ========================================================================== */
function initWishesGuestbook() {
  const wishForm = document.getElementById('wishForm');
  const wishesList = document.getElementById('wishesList');
  const countEl = document.getElementById('wishesCount');
  const messageInput = document.getElementById('wishMessage');
  const quickChips = document.querySelectorAll('.wish-chip');

  // Handle Quick Chips with subtle sparkle burst
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      if (messageInput && text) {
        messageInput.value = text;
        messageInput.focus();
      }
      if (window.triggerCelebrationBurst) {
        const rect = chip.getBoundingClientRect();
        window.triggerCelebrationBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
          count: 18,
          power: 3,
          hearts: true
        });
      }
    });
  });

  // Default pre-loaded wishes
  const defaultWishes = [
    {
      author: 'ចាន់ សុភ័ក្ត្រ',
      relation: 'មិត្តភក្តិកូនកំលោះ',
      text: 'សូមជូនពរឱ្យប្អូនទាំងពីរមានសុភមង្គល ស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង ជោគជ័យគ្រប់ភារកិច្ច និងរកទទួលទានមានបានត្រជាក់ត្រជុំ! 💖',
      time: '១ ម៉ោងមុន'
    },
    {
      author: 'គង់ ស្រីមុំ',
      relation: 'មិត្តភក្តិកូនក្រមុំ',
      text: 'រចនាស្អាតខ្លាំងណាស់ថ្ងៃនេះ! សមគ្នាដូចគូព្រេងពីអតីតជាតិ។ សូមជូនពរឱ្យជីវិតអាពាហ៍ពិពាហ៍ពោរពេញដោយស្នាមញញឹម និងឆាប់បានកូនពូកែណា៎! 🌸',
      time: '៣ ម៉ោងមុន'
    },
    {
      author: 'ពូ ហេង និង មីង ផល្លី',
      relation: 'បងប្អូនសាច់ញាតិ',
      text: 'សិរីសួស្តី ជ័យមង្គល វិបុលសុខ ដល់ក្មួយទាំងពីរ! សូមឱ្យចម្រុងចម្រើន រកស៊ីមានបាន ស្រឡាញ់ថ្នាក់ថ្នមគ្នាជាដរាប។ ✨',
      time: '៥ ម៉ោងមុន'
    }
  ];

  function getStoredWishes() {
    const stored = localStorage.getItem('wedding_wishes');
    if (!stored) {
      localStorage.setItem('wedding_wishes', JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    return JSON.parse(stored);
  }

  function renderWishes() {
    if (!wishesList) return;
    const wishes = getStoredWishes();
    if (countEl) countEl.textContent = wishes.length;

    wishesList.innerHTML = wishes.map(wish => `
      <div class="wish-item">
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(wish.author)}</span>
          <span class="wish-relation">${escapeHtml(wish.relation)}</span>
        </div>
        <div class="wish-text">${escapeHtml(wish.text)}</div>
        <span class="wish-timestamp">${escapeHtml(wish.time)}</span>
      </div>
    `).join('');
  }

  renderWishes();

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const sender = document.getElementById('wishSender')?.value.trim();
      const relation = document.getElementById('wishRelationship')?.value;
      const message = document.getElementById('wishMessage')?.value.trim();

      if (!sender || !message) return;

      const newWish = {
        author: sender,
        relation: relation || 'ភ្ញៀវកិត្តិយស',
        text: message,
        time: 'ទើបតែផ្ញើ'
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

      renderWishes();
      wishForm.reset();

      // Trigger blessing celebration burst
      if (window.triggerCelebrationBurst) {
        const btn = document.getElementById('btnPostWish');
        const rect = btn ? btn.getBoundingClientRect() : null;
        const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        window.triggerCelebrationBurst(x, y, { count: 50, power: 4.5, spreadSpeed: 8, heartsOnly: true });
      }

      // Scroll to the top of wishes list
      if (wishesList) {
        wishesList.scrollTop = 0;
      }
    });
  }
}

/* ==========================================================================
   8. Save the Date Calendar Download (.ics)
   ========================================================================== */
function initCalendarDownload() {
  const btnCalendar = document.getElementById('btnAddToCalendar');
  if (!btnCalendar) return;

  btnCalendar.addEventListener('click', () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Khmer Wedding//Khea and Kanha//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'SUMMARY:អាពាហ៍ពិពាហ៍ ខាន់ ឃា & សែម កញ្ញា (Wedding of Khea & Kanha)',
      'DESCRIPTION:ពិធីអាពាហ៍ពិពាហ៍បែបប្រពៃណីខ្មែរ រៀបចំឡើងនៅគេហដ្ឋានកូនក្រមុំ ខេត្តតាកែវ',
      'LOCATION:ភូមិក្នុង សង្កាត់រកាក្នុង ក្រុងដូនកែវ ខេត្តតាកែវ, Takeo, Cambodia',
      'DTSTART:20270219T103000Z',
      'DTEND:20270219T160000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Khmer_Wedding_Khea_Kanha.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   9. Mobile Bottom Navigation Active Tracking & Smooth Scroll
   ========================================================================== */
function initMobileBottomNav() {
  const mobLinks = document.querySelectorAll('.mob-nav-link');
  if (!mobLinks.length) return;

  const sections = Array.from(mobLinks).map(link => {
    const id = link.getAttribute('data-section') || link.getAttribute('href')?.replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  function highlightOnScroll() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = '';

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPos) {
        currentId = section.id;
        break;
      }
    }

    if (!currentId && sections.length) {
      currentId = sections[0].id;
    }

    mobLinks.forEach(link => {
      const linkTarget = link.getAttribute('data-section') || link.getAttribute('href')?.replace('#', '');
      if (linkTarget === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', highlightOnScroll, { passive: true });
  highlightOnScroll();

  mobLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-section') || link.getAttribute('href')?.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        mobLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   10. Royal Gold Reading / Scroll Progress Bar
   ========================================================================== */
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      bar.style.width = `${progress}%`;
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   11. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  // Automatically tag key sections and elements with smooth reveal classes
  const config = [
    { selector: '.section-title-wrap', type: 'reveal-on-scroll' },
    { selector: '.framed-couple-stage', type: 'reveal-zoom' },
    { selector: '.couple-cards-grid > .couple-profile-card:first-child', type: 'reveal-left' },
    { selector: '.couple-center-symbol', type: 'reveal-zoom', delay: 'delay-2' },
    { selector: '.couple-cards-grid > .couple-profile-card:last-child', type: 'reveal-right' },
    { selector: '.venue-card', type: 'reveal-on-scroll' },
    { selector: '.rsvp-card-wrapper', type: 'reveal-zoom' },
    { selector: '.wish-form-card', type: 'reveal-left' },
    { selector: '.wishes-wall-container', type: 'reveal-right' },
    { selector: '.countdown-container', type: 'reveal-zoom' },
    { selector: '.wedding-footer .footer-container', type: 'reveal-on-scroll' }
  ];

  config.forEach(({ selector, type, delay }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(type);
      if (delay) el.classList.add(delay);
    });
  });

  // Stagger gallery items
  document.querySelectorAll('.gallery-grid .gallery-item').forEach((item, idx) => {
    item.classList.add('reveal-zoom');
    item.style.transitionDelay = `${(idx % 4) * 0.12}s`;
  });

  // Stagger timeline items
  document.querySelectorAll('.timeline-container .timeline-card').forEach((card, idx) => {
    card.classList.add('reveal-on-scroll');
    card.style.transitionDelay = `${(idx % 5) * 0.12}s`;
  });

  // Observe all reveal elements
  const allRevealEls = document.querySelectorAll(
    '.reveal-on-scroll, .reveal-zoom, .reveal-left, .reveal-right'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target); // Reveal once smoothly
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      }
    );

    allRevealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    allRevealEls.forEach(el => el.classList.add('is-revealed'));
  }
}

/* ==========================================================================
   12. Interactive Auspicious Sacred Love Ring 💍
   ========================================================================== */
function initInteractiveSacredRing() {
  const sacredRing = document.querySelector('.couple-center-symbol .sacred-ring');
  if (!sacredRing) return;

  sacredRing.addEventListener('click', () => {
    if (window.triggerCelebrationBurst) {
      const rect = sacredRing.getBoundingClientRect();
      window.triggerCelebrationBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
        count: 32,
        power: 4.2,
        spreadSpeed: 8,
        heartsOnly: true
      });
    }
  });
}

/* ==========================================================================
   13. PWA & Add to Home Screen (ដំឡើងលើ Homescreen)
   ========================================================================== */
function initPWAInstall() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('Wedding PWA Service Worker Registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('Wedding PWA Service Worker Registration Failed:', err);
        });
    });
  }

  let deferredPrompt = null;
  const pwaInstallBtn = document.getElementById('pwaInstallBtn');
  const footerInstallBtn = document.getElementById('footerInstallBtn');
  const pwaModal = document.getElementById('pwaModal');
  const pwaModalClose = document.getElementById('pwaModalClose');
  const pwaDismissBtn = document.getElementById('pwaDismissBtn');
  const pwaNativeInstallBtn = document.getElementById('pwaNativeInstallBtn');
  const pwaStepsContainer = document.getElementById('pwaStepsContainer');

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());

  // Listen for beforeinstallprompt event (Android / Chrome / Edge)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaNativeInstallBtn) {
      pwaNativeInstallBtn.style.display = 'block';
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (pwaNativeInstallBtn) {
      pwaNativeInstallBtn.style.display = 'none';
    }
    closeModal();
    if (pwaInstallBtn) {
      pwaInstallBtn.innerHTML = '<span class="install-btn-icon">✅</span><span class="install-btn-label">បានដំឡើង</span>';
    }
    if (footerInstallBtn) {
      footerInstallBtn.innerHTML = '<span>✅ បានដំឡើងលើអេក្រង់រួចរាល់</span>';
    }
  });

  function openModal() {
    renderSteps();
    if (pwaModal) {
      pwaModal.classList.add('active');
      pwaModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (pwaModal) {
      pwaModal.classList.remove('active');
      pwaModal.setAttribute('aria-hidden', 'true');
    }
  }

  function renderSteps() {
    if (!pwaStepsContainer) return;

    if (isStandalone) {
      if (pwaNativeInstallBtn) pwaNativeInstallBtn.style.display = 'none';
      pwaStepsContainer.innerHTML = `
        <div class="pwa-step-item">
          <div class="pwa-step-badge">✓</div>
          <div class="pwa-step-text">
            <strong>កម្មវិធីត្រូវបានដំឡើងរួចរាល់ហើយ!</strong><br>
            លោកអ្នកកំពុងបើកមើលផ្ទាល់នៅលើអេក្រង់ទូរស័ព្ទ។ សូមអរគុណ!
          </div>
        </div>
      `;
      return;
    }

    if (isIOS) {
      if (pwaNativeInstallBtn) pwaNativeInstallBtn.style.display = 'none';
      pwaStepsContainer.innerHTML = `
        <div class="pwa-step-item">
          <div class="pwa-step-badge">១</div>
          <div class="pwa-step-text">
            ចុចលើប៊ូតុងចែករំលែក <span class="pwa-step-icon-hl">📤 Share</span> នៅរបារខាងក្រោមនៃ Safari។
          </div>
        </div>
        <div class="pwa-step-item">
          <div class="pwa-step-badge">២</div>
          <div class="pwa-step-text">
            អូសចុះក្រោមបន្តិច រួចជ្រើសរើស <span class="pwa-step-icon-hl">➕ បន្ថែមទៅអេក្រង់ដើម</span> (<strong>Add to Home Screen</strong>)។
          </div>
        </div>
        <div class="pwa-step-item">
          <div class="pwa-step-badge">៣</div>
          <div class="pwa-step-text">
            ចុច <span class="pwa-step-icon-hl"><strong>បន្ថែម (Add)</strong></span> នៅជ្រុងខាងស្តាំខាងលើជាការស្រេច!
          </div>
        </div>
      `;
    } else {
      // Android / Chrome / Edge
      if (deferredPrompt && pwaNativeInstallBtn) {
        pwaNativeInstallBtn.style.display = 'block';
      }
      pwaStepsContainer.innerHTML = `
        <div class="pwa-step-item">
          <div class="pwa-step-badge">១</div>
          <div class="pwa-step-text">
            ចុចប៊ូតុង <strong>«ចុចដំឡើងឥឡូវនេះ»</strong> ខាងក្រោម ឬចុចសញ្ញាចុចបី <span class="pwa-step-icon-hl">⋮</span> នៅជ្រុងខាងលើស្តាំនៃ Chrome។
          </div>
        </div>
        <div class="pwa-step-item">
          <div class="pwa-step-badge">២</div>
          <div class="pwa-step-text">
            ជ្រើសរើស <span class="pwa-step-icon-hl">📲 ដំឡើងកម្មវិធី</span> (<strong>Install App</strong>) ឬ <strong>Add to Home screen</strong>។
          </div>
        </div>
        <div class="pwa-step-item">
          <div class="pwa-step-badge">៣</div>
          <div class="pwa-step-text">
            ចុច <strong>ដំឡើង (Install)</strong> ដើម្បីដាក់កម្មវិធីផ្ទាល់លើអេក្រង់ទូរស័ព្ទ។
          </div>
        </div>
      `;
    }
  }

  function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
          closeModal();
        }
        deferredPrompt = null;
      });
    } else {
      openModal();
    }
  }

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', handleInstallClick);
  }

  if (footerInstallBtn) {
    footerInstallBtn.addEventListener('click', handleInstallClick);
  }

  if (pwaNativeInstallBtn) {
    pwaNativeInstallBtn.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the PWA install prompt');
            closeModal();
          }
          deferredPrompt = null;
        });
      }
    });
  }

  if (pwaModalClose) {
    pwaModalClose.addEventListener('click', closeModal);
  }

  if (pwaDismissBtn) {
    pwaDismissBtn.addEventListener('click', closeModal);
  }

  if (pwaModal) {
    pwaModal.addEventListener('click', (e) => {
      if (e.target === pwaModal) {
        closeModal();
      }
    });
  }
}


