const root = document.documentElement;
const body = document.body;
const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
const heroObject = document.querySelector('[data-hero-object]');
const heroCopy = document.querySelector('.hero__copy');
const heroEyebrow = document.querySelector('.hero__eyebrow');
const heroLeftWord = document.querySelector('.hero__word--left');
const heroRightWord = document.querySelector('.hero__word--right');
const heroFront = document.querySelector('.compact--front');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const mobileMenu = document.querySelector('.mobile-menu');
const bookingForm = document.querySelector('#booking-form');
const formError = document.querySelector('.form-error');
const lookModal = document.querySelector('#look-modal');
const modalImage = lookModal.querySelector('img');
const modalCaption = lookModal.querySelector('.look-modal__caption span');
const modalClose = lookModal.querySelector('.look-modal__close');
const requestModal = document.querySelector('#request-modal');
const requestMessage = document.querySelector('#request-message');
const requestClose = requestModal.querySelector('.request-modal__close');
const copyRequest = requestModal.querySelector('.copy-request');
const copyStatus = requestModal.querySelector('.copy-status');

document.querySelector('#year').textContent = new Date().getFullYear();

window.addEventListener('load', () => {
  window.setTimeout(() => document.querySelector('.preloader').classList.add('is-gone'), 520);
});

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function updateHero() {
  const start = hero.offsetTop;
  const distance = hero.offsetHeight - window.innerHeight;
  const progress = clamp((window.scrollY - start) / distance);
  const intro = clamp(progress / .24);

  header.classList.toggle('is-scrolled', window.scrollY > 18);
  heroObject.style.transform = `translate(calc(-50% + ${window.__heroMX || 0}px), calc(-49% + ${window.__heroMY || 0}px)) scale(${1 + progress * .54}) rotateZ(${progress * 15 - 5}deg)`;
  heroFront.style.transform = `translate(-50%, -50%) translateZ(${45 + progress * 68}px) rotateY(${-10 + progress * 15}deg) rotateX(${4 - progress * 9}deg)`;
  heroCopy.style.opacity = String(1 - clamp((progress - .52) / .22));
  heroCopy.style.transform = `translateY(calc(-39% - ${progress * 54}px))`;
  heroEyebrow.style.opacity = String(1 - clamp((progress - .55) / .2));
  heroLeftWord.style.transform = `translateX(${-progress * 76}vw) translateY(${progress * -3}vh)`;
  heroRightWord.style.transform = `translateX(${progress * 78}vw) translateY(${progress * 4}vh)`;
  root.style.setProperty('--hero-progress', progress.toFixed(3));
  root.style.setProperty('--hero-intro', intro.toFixed(3));
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateHero();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
updateHero();

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - .5) * 20;
    const y = (event.clientY / window.innerHeight - .5) * 15;
    window.__heroMX = x;
    window.__heroMY = y;
  }, { passive: true });
}

function toggleMenu(force) {
  const open = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('is-open');
  mobileMenu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('menu-open', open);
}
menuToggle.addEventListener('click', () => toggleMenu());
menuClose.addEventListener('click', () => toggleMenu(false));
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .13 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.service-card').forEach((card) => {
  card.querySelector('.round-arrow').addEventListener('click', () => {
    if (card.dataset.action === 'instagram') {
      window.open('https://www.instagram.com/sazhida_makeup/', '_blank', 'noopener,noreferrer');
      return;
    }
    const select = bookingForm.elements.service;
    const matchingOption = [...select.options].find((option) => option.text === card.dataset.service);
    if (matchingOption) select.value = matchingOption.value;
    document.querySelector('#booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('.gallery-card').forEach((card) => {
  card.addEventListener('click', () => {
    modalImage.src = card.dataset.image;
    modalImage.alt = card.querySelector('img').alt;
    modalCaption.textContent = card.dataset.look;
    lookModal.showModal();
    body.classList.add('modal-open');
  });
});
function closeModal() {
  lookModal.close();
  body.classList.remove('modal-open');
}
modalClose.addEventListener('click', closeModal);
lookModal.addEventListener('click', (event) => {
  if (event.target === lookModal) closeModal();
});
lookModal.addEventListener('close', () => body.classList.remove('modal-open'));

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const service = String(data.get('service') || '').trim();
  const date = String(data.get('date') || '').trim();
  const message = String(data.get('message') || '').trim();

  if (!name || !phone || !service) {
    formError.textContent = 'Пожалуйста, укажите имя, телефон и формат работы.';
    return;
  }

  formError.textContent = '';
  const text = [
    'Здравствуйте, Сажида! Хочу записаться.',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Интересует: ${service}`,
    date ? `Дата / пожелание: ${date}` : '',
    message ? `Комментарий: ${message}` : ''
  ].filter(Boolean).join('\n');
  requestMessage.value = text;
  copyStatus.textContent = '';
  requestModal.showModal();
  body.classList.add('modal-open');
});

function closeRequestModal() {
  requestModal.close();
  body.classList.remove('modal-open');
}
requestClose.addEventListener('click', closeRequestModal);
requestModal.addEventListener('click', (event) => {
  if (event.target === requestModal) closeRequestModal();
});
requestModal.addEventListener('close', () => body.classList.remove('modal-open'));
copyRequest.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(requestMessage.value);
    copyStatus.textContent = 'Скопировано — теперь откройте WhatsApp.';
  } catch {
    requestMessage.focus();
    requestMessage.select();
    copyStatus.textContent = 'Текст выделен — скопируйте его вручную.';
  }
});

// Lightweight shimmering particle field for the hero.
const canvas = document.querySelector('#glow-canvas');
const context = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(110, Math.round(window.innerWidth / 11));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.35 + .22,
    speed: Math.random() * .18 + .03,
    phase: Math.random() * Math.PI * 2,
    tint: Math.random() > .72 ? '230,161,121' : '244,238,232'
  }));
}
function drawParticles(time) {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const heroVisible = window.scrollY < hero.offsetTop + hero.offsetHeight;
  if (heroVisible) {
    particles.forEach((particle) => {
      const y = (particle.y - time * particle.speed * .015) % window.innerHeight;
      const alpha = .16 + Math.sin(time * .0012 + particle.phase) * .12;
      context.beginPath();
      context.fillStyle = `rgba(${particle.tint},${alpha})`;
      context.arc(particle.x, y < 0 ? y + window.innerHeight : y, particle.r, 0, Math.PI * 2);
      context.fill();
    });
  }
  requestAnimationFrame(drawParticles);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
requestAnimationFrame(drawParticles);
