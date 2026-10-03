const portfolioBody = document.body;
const portfolioCards = [...document.querySelectorAll('.portfolio-card')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const portfolioModal = document.querySelector('#portfolio-modal');
const portfolioModalImage = portfolioModal.querySelector('img');
const portfolioModalCaption = portfolioModal.querySelector('div span');
const portfolioModalClose = portfolioModal.querySelector('.portfolio-modal__close');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelector('#portfolio-year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.portfolio-reveal').forEach((element) => revealObserver.observe(element));

function setFilter(filter) {
  filterButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.filter === filter));
  portfolioCards.forEach((card) => {
    const visible = filter === 'all' || card.dataset.category === filter;
    if (!visible) {
      card.classList.remove('is-entering');
      card.classList.add('is-hidden');
      return;
    }
    card.classList.remove('is-hidden');
    if (!reducedMotion) {
      card.classList.remove('is-entering');
      requestAnimationFrame(() => card.classList.add('is-entering'));
      window.setTimeout(() => card.classList.remove('is-entering'), 470);
    }
  });
}

filterButtons.forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.filter)));

function openPortfolioModal(card) {
  const image = card.querySelector('img');
  portfolioModalImage.src = card.dataset.image;
  portfolioModalImage.alt = image.alt;
  portfolioModalCaption.textContent = card.dataset.look;
  portfolioModal.showModal();
  portfolioBody.classList.add('modal-open');
}

function closePortfolioModal() {
  portfolioModal.close();
  portfolioBody.classList.remove('modal-open');
}

portfolioCards.forEach((card) => {
  card.addEventListener('click', () => openPortfolioModal(card));
});
portfolioModalClose.addEventListener('click', closePortfolioModal);
portfolioModal.addEventListener('click', (event) => {
  if (event.target === portfolioModal) closePortfolioModal();
});
portfolioModal.addEventListener('close', () => portfolioBody.classList.remove('modal-open'));

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const aura = document.querySelector('.cursor-aura');
  window.addEventListener('pointermove', (event) => {
    aura.style.left = `${event.clientX}px`;
    aura.style.top = `${event.clientY}px`;
    aura.classList.add('is-active');
  }, { passive: true });
  window.addEventListener('pointerleave', () => aura.classList.remove('is-active'));

  portfolioCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      card.style.setProperty('--tilt-x', `${-y * 2.6}deg`);
      card.style.setProperty('--tilt-y', `${x * 2.6}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}
