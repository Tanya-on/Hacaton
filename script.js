// ========== Таймеры ==========
function updateCountdown(elementId, targetTime) {
  const now = new Date().getTime();
  const distance = targetTime - now;
  if (distance < 0) {
    document.querySelectorAll(`#${elementId} .countdown__value`).forEach(el => {
      el.textContent = '00';
    });
    return;
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const container = document.getElementById(elementId);
  if (container) {
    const daysEl = container.querySelector('[data-unit="days"]');
    const hoursEl = container.querySelector('[data-unit="hours"]');
    const minutesEl = container.querySelector('[data-unit="minutes"]');
    const secondsEl = container.querySelector('[data-unit="seconds"]');
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }
}

function updateStartCountdown() {
  const targetDate = new Date('2026-09-03T10:00:00').getTime();
  updateCountdown('countdown-start', targetDate);
}

function updateFinishCountdown() {
  const targetDate = new Date('2026-09-08T15:00:00').getTime();
  updateCountdown('countdown-finish', targetDate);
}

updateStartCountdown();
updateFinishCountdown();
setInterval(() => {
  updateStartCountdown();
  updateFinishCountdown();
}, 1000);

// ========== Прогресс-бар чтения + Back-to-top ==========
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const progressBar = document.getElementById('readingProgress');
  if (progressBar) progressBar.style.width = scrolled + '%';

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    if (winScroll > 300) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
});

document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== Плавный скролл ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========== Мобильное меню (бургер) ==========
const burger = document.querySelector('.burger');
const nav = document.querySelector('.main-nav') || document.querySelector('.header__nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const isActive = nav.classList.toggle('active');
    burger.classList.toggle('active', isActive);
    burger.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ========== Fade-in при скролле ==========
const fadeElements = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window && fadeElements.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  fadeElements.forEach(el => observer.observe(el));
}

// ========== Подсветка активного меню ==========
const sections = document.querySelectorAll('section[id], main[id]');
const navLinks = document.querySelectorAll('.header__nav a, .main-nav a');
function updateActiveNav() {
  let currentId = '';
  const scrollPos = window.scrollY + 100;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      currentId = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && currentId && href.includes('#' + currentId)) {
      link.classList.add('active');
    }
  });
}
if (sections.length && navLinks.length) {
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

// ========== Expandable cards ==========
function toggleCard(element) {
  const card = element.closest('.expandable-card');
  if (card) card.classList.toggle('is-open');
}

// ========== FAQ Accordion ==========
function toggleFaq(element) {
  const item = element.closest('.faq__item');
  const isOpen = item.classList.contains('is-open');
  document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('is-open'));
  if (!isOpen) item.classList.add('is-open');
}

// ========== 3D Tilt эффект для карточек ролей ==========
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});
