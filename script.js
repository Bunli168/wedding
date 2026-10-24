/**
 * Khmer Wedding Celebration - Interactive Application Logic
 * Couple: Sok Visal & Chea Rachana
 */

document.addEventListener('DOMContentLoaded', () => {
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
});

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

  new Swiper('#frameSwiper', {
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
        // 90% single blossoms, 10% small cluster
        const isCluster = Math.random() < 0.12;
        this.img = isCluster ? flowerImgs[3] : flowerImgs[Math.floor(Math.random() * 3)];
        
        const baseSize = isMobile ? 18 : 24;
        this.size = baseSize + Math.random() * (isCluster ? 28 : 20);
        this.speedY = 0.6 + Math.random() * 0.9;
        this.swaySpeed = 0.008 + Math.random() * 0.014;
        this.swayAmp = 0.7 + Math.random() * 1.1;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.016;
        this.opacity = 0.75 + Math.random() * 0.22;
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
          ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        }
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particlesCount; i++) {
    particles.push(new KhmerFlowerParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
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
  const audioEl = document.getElementById('weddingAudio');

  if (!btnOpen || !overlay) return;

  btnOpen.addEventListener('click', () => {
    // 1. Play Traditional Wedding Song automatically
    if (audioEl) {
      audioEl.play().catch(err => {
        console.log('Audio play error:', err);
      });
    }

    // 2. Animate envelope opening transition
    overlay.classList.add('opened');
    document.body.classList.remove('envelope-active');

    // 3. Smooth scroll to top of hero page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   5. Traditional Khmer Wedding Audio Player (សូរិយាលិចហើយ - សុត សាវុធ)
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
        musicBtn.querySelector('.music-text').textContent = 'បិទភ្លេង';
      }
      if (musicIcon) musicIcon.textContent = '🎶';
      if (floatingPill) floatingPill.classList.add('playing');
      if (pillPlayIcon) pillPlayIcon.textContent = '⏸';
    } else {
      if (musicBtn) {
        musicBtn.classList.remove('playing');
        musicBtn.querySelector('.music-text').textContent = 'ភ្លេងការ';
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
window.openPhotoModal = function(src, caption) {
  const modal = document.getElementById('photoLightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  if (!modal || !modalImg) return;

  modalImg.src = src;
  if (captionEl) captionEl.textContent = caption || '';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closePhotoModal = function() {
  const modal = document.getElementById('photoLightboxModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closePhotoModal();
  }
});

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

  // Handle Quick Chips
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      if (messageInput && text) {
        messageInput.value = text;
        messageInput.focus();
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

