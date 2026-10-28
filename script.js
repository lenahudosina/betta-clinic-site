document.addEventListener('DOMContentLoaded', () => {
  // Несколько независимых мобильных меню на странице (герой + закреплённая
  // шапка на главной, своя шапка на about.html) — каждая кнопка находит
  // свою панель через aria-controls.
  const menuBtns = document.querySelectorAll('.mobile-menu-btn, .page-header__menu-btn');

  menuBtns.forEach(menuBtn => {
    const navId = menuBtn.getAttribute('aria-controls');
    const nav = navId ? document.getElementById(navId) : null;
    if (!nav) return;

    menuBtn.addEventListener('click', () => {
      const isHidden = nav.hasAttribute('hidden');
      if (isHidden) {
        nav.removeAttribute('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
      } else {
        nav.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
});

/* ===================================================================
   Карусель «Услуги» (десктоп 1:629 — 3 карточки, мобайл 1:2101 — 1 карточка)
   =================================================================== */
(() => {
  const services = document.querySelector('.services');
  if (!services) return;

  const track = services.querySelector('.services__track');
  const dotsWrap = services.querySelector('.services__dots');
  const navButtons = Array.from(services.querySelectorAll('.nav-btn'));

  // Реальные услуги из макета Figma (узлы 1:629 / 1:2101).
  // Для мобильной версии первой карточки в Figma есть отдельный кадр фото;
  // у остальных карточек мобильного кропа нет — используется то же фото с object-fit: cover.
  // Картинки карточек из макета — чередуются по кругу; названия и ссылки
  // берутся из data-items секции (страницы услуг), иначе — список направлений.
  const base = services.dataset.base || '';
  const IMAGES = [
    { desktop: 'assets/services/card-1-desktop.webp', mobile: 'assets/services/card-1-mobile.webp' },
    { desktop: 'assets/services/card-2-desktop.webp' },
    { desktop: 'assets/services/card-3-desktop.webp' }
  ];
  // Фото есть только у отдельных карточек (по адресу страницы), у остальных — серая плашка.
  const PHOTOS = {
    'uslugi/uslugi-lazernaya-kosmetologiya.html': 'assets/services/laser-cosmetology.webp',
    'uslugi/fotoomolozhenie.html': 'assets/services/laser-fotoomolozhenie.webp',
    'uslugi/lazernoe-omolozhenie.html': 'assets/services/laser-lazernoe-omolozhenie.webp',
    'uslugi/lazernaya-epilyatsiya.html': 'assets/services/laser-lazernaya-epilyatsiya.webp',
    'uslugi/lazernaya-biorevitalizatsiya.html': 'assets/services/laser-lazernaya-biorevitalizatsiya.webp',
    'uslugi/udalenie-novoobrazovaniy.html': 'assets/services/neoplasm-removal.webp',
    'uslugi/udalenie-shramov.html': 'assets/services/scars-striae-removal.webp',
    'uslugi/plazmoterapiya-litsa.html': 'assets/services/med-plazmoterapiya-litsa.webp',
    'uslugi/trihologiya.html': 'assets/services/med-trihologiya.webp',
    'uslugi/platsentarnaya-terapiya.html': 'assets/services/med-platsentarnaya-terapiya.webp',
    'uslugi/kriodestruktsiya.html': 'assets/services/med-kriodestruktsiya.webp',
    'uslugi/akne.html': 'assets/services/med-akne.webp',
    'uslugi/elektrokoagulyatsiya.html': 'assets/services/med-elektrokoagulyatsiya.webp',
    'uslugi/botulinoterapiya.html': 'assets/services/botox-botulinoterapiya.webp',
    'uslugi/gipergidroz.html': 'assets/services/botox-gipergidroz.webp',
    'uslugi/konturnaya-plastika.html': 'assets/services/inj-konturnaya-plastika.webp',
    'uslugi/lipoliticheskaya-terapiya.html': 'assets/services/inj-lipoliticheskaya-terapiya.webp',
    'uslugi/mezoterapiya.html': 'assets/services/inj-mezoterapiya.webp',
    'uslugi/inektsionnaya-karboksiterapiya.html': 'assets/services/inj-inektsionnaya-karboksiterapiya.webp',
    'uslugi/kollagenoterapiya.html': 'assets/services/inj-kollagenoterapiya.webp',
    'uslugi/smas.html': 'assets/services/hw-smas.webp',
    'uslugi/rf-lifting.html': 'assets/services/hw-rf-lifting.webp',
    'uslugi/holodnaya-plazma.html': 'assets/services/hw-holodnaya-plazma.webp',
    'uslugi/bezinjekcionnaya-mez.html': 'assets/services/hw-bezinjekcionnaya-mez.webp',
    'uslugi/rsl-skulpturirovanie.html': 'assets/services/body-rsl-skulpturirovanie.webp',
    'uslugi/massazhi.html': 'assets/services/body-massazhi.webp',
    'uslugi/pressoterapiya.html': 'assets/services/body-pressoterapiya.webp',
    'uslugi/chistka-kozhi.html': 'assets/services/aes-chistka-kozhi.webp',
    'uslugi/massazh-litsa.html': 'assets/services/aes-massazh-litsa.webp',
    'uslugi/karboksiterapiya.html': 'assets/services/aes-karboksiterapiya.webp',
    'uslugi/programmy-krasoty.html': 'assets/services/aes-programmy-krasoty.webp',
    'uslugi/apparatnaya-terapiya.html': 'assets/services/rehab-apparatnaya-terapiya.webp',
    'uslugi/inektsionnye-metodiki.html': 'assets/services/rehab-inektsionnye-metodiki.webp',
    'uslugi/uslugi-udalenie-shramov-rubtsov-i-novoobrazov.html': 'assets/services/scars-main.webp',
    'uslugi/uslugi-vrachebnaya-kosmetologiya.html': 'assets/services/medical-cosmetology-2.webp',
    'uslugi/uslugi-botulinoterapiya.html': 'assets/services/botox-main.webp',
    'uslugi/uslugi-inektsionnaya-kosmetologiya.html': 'assets/services/injection-cosmetology.webp',
    'uslugi/uslugi-apparatnaya-kosmetologiya.html': 'assets/services/apparatus-cosmetology.webp',
    'uslugi/uslugi-reabilitatsiya-posle-plastiki-i-hirurg.html': 'assets/services/rehabilitation.webp',
    'uslugi/uslugi-modelirovanie-silueta-i-massazh.html': 'assets/services/body-main.webp',
    'uslugi/uslugi-esteticheskaya-kosmetologiya.html': 'assets/services/aesthetic-cosmetology.webp'
  };
  let items = [];
  try { items = JSON.parse(services.dataset.items || '[]'); } catch (e) { items = []; }
  const SERVICES = items.map((item, i) => {
    const img = IMAGES[i % IMAGES.length];
    return {
      title: item.title,
      imageDesktop: base + img.desktop,
      imageMobile: img.mobile ? base + img.mobile : '',
      photo: PHOTOS[item.url] ? base + PHOTOS[item.url] : '',
      bookingUrl: '#apply',
      detailsUrl: base + item.url
    };
  });

  let index = 0;
  let cards = [];
  const indicatorCount = 5;

  function createCards() {
    // Фото пока не используем — вместо них серые плашки-заглушки.
    track.innerHTML = SERVICES.map((item, i) => `
      <article class="service-card" data-service-index="${i}">
        ${item.photo
          ? `<img class="service-card__image service-card__image--desktop service-card__image--photo" src="${item.photo}" alt="${item.title}" loading="lazy" decoding="async">`
          : `<div class="service-card__image service-card__image--desktop service-card__image--placeholder" role="img" aria-label="${item.title}"></div>`}
        <div class="service-card__body">
          <h3>${item.title}</h3>
          <div class="service-card__actions">
            <a class="btn btn--primary" href="${item.bookingUrl}"><span>Записаться</span><img class="btn__icon" src="${base}assets/about-btn-arrow.svg" alt=""></a>
            <a class="btn btn--outline" href="${item.detailsUrl}">Подробнее</a>
          </div>
        </div>
      </article>
    `).join('');
    cards = Array.from(track.querySelectorAll('.service-card'));
  }

  function createDots() {
    dotsWrap.innerHTML = Array.from({ length: indicatorCount }, (_, i) =>
      `<button class="dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Перейти к части ${i + 1} списка услуг" data-dot="${i}"></button>`
    ).join('');

    dotsWrap.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const max = maxIndex();
        const segment = Number(dot.dataset.dot);
        const target = indicatorCount === 1 ? 0 : Math.round((segment / (indicatorCount - 1)) * max);
        setIndex(target);
      });
    });
  }

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function visibleCount() {
    return isMobile() ? 1 : 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount());
  }

  function renderDots() {
    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
    const max = maxIndex();
    const progress = max ? index / max : 0;
    const active = Math.min(indicatorCount - 1, Math.round(progress * (indicatorCount - 1)));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
  }

  function updateNavState() {
    const max = maxIndex();
    navButtons.forEach(btn => {
      btn.disabled = max === 0;
    });
  }

  function render() {
    if (!cards.length) return;

    if (isMobile()) {
      track.style.transform = `translateX(${-index * 100}%)`;
    } else {
      const gap = cards[0].parentElement.getBoundingClientRect().width * (1.1979 / 100);
      const step = cards[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(${-index * step}px)`;
    }

    renderDots();
    updateNavState();
  }

  function setIndex(next, loop = false) {
    const max = maxIndex();
    if (loop) {
      if (next > max) next = 0;
      if (next < 0) next = max;
    }
    index = Math.min(Math.max(next, 0), max);
    render();
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setIndex(index + (btn.dataset.dir === 'next' ? 1 : -1), true);
    });
  });

  let touchStartX = null;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    setIndex(index + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  services.setAttribute('tabindex', '0');
  services.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') setIndex(index + 1, true);
    if (e.key === 'ArrowLeft') setIndex(index - 1, true);
  });

  window.addEventListener('resize', () => {
    index = Math.min(index, maxIndex());
    render();
  });

  createCards();
  createDots();
  render();
})();

/* ===================================================================
   Секция «Почему мы?» — портировано с React-компонента на
   framer-motion (useScroll/useTransform) + lenis, которых нет в этом
   статическом проекте (HTML/CSS/JS без React/npm). Та же логика на
   чистом JS: каждая карточка "sticky top:0", масштаб каждой карточки
   плавно уменьшается по мере прогресса скролла через весь блок —
   более ранние карточки уменьшаются сильнее, новая наезжает поверх
   в полном размере. (81:592, 81:612…81:652)
   =================================================================== */
(() => {
  const stack = document.querySelector('#why-stack');
  if (!stack) return;

  const flowerWrap = document.querySelector('.why__flower-wrap');

  const WHY = [
    { number: '01', title: 'Естественность результата', image: 'assets/why-us/card-01.webp' },
    { number: '02', title: 'Специальные предложения', image: 'assets/why-us/card-02.webp' },
    { number: '03', title: 'Профессионализм врачей', image: 'assets/why-us/card-03.webp' },
    { number: '04', title: 'Широкий спектр услуг', image: 'assets/why-us/card-04.webp' },
    { number: '05', title: 'Современное оборудование', image: 'assets/why-us/card-05.webp' },
    { number: '06', title: 'Работа на качество и результат', image: 'assets/why-us/card-06.webp' }
  ];

  stack.innerHTML = WHY.map((item, i) => `
    <div class="why-card-wrap">
      <article class="why-card" data-i="${i}" style="translate:0 ${i * 4}vh">
        <img class="why-card__img" src="${item.image}" alt="${item.title}">
        <div class="why-card__overlay"></div>
        <p class="why-card__number">${item.number}</p>
        <h3 class="why-card__title">${item.title}</h3>
      </article>
    </div>
  `).join('');

  const cards = Array.from(stack.querySelectorAll('.why-card'));
  const n = cards.length;

  // Соответствует range={[i * 0.2, 1]} и
  // targetScale = Math.max(0.6, 1 - (n - i - 1) * 0.08) из исходного компонента.
  const RANGE_STEP = 1 / n;
  const cardConfig = cards.map((card, i) => ({
    el: card,
    start: i * RANGE_STEP,
    targetScale: Math.max(0.6, 1 - (n - i - 1) * 0.08),
    offsetVh: i * 4
  }));

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateScales() {
    const rect = stack.getBoundingClientRect();
    const scrollableH = rect.height - window.innerHeight;
    let progress = scrollableH > 0 ? -rect.top / scrollableH : 0;
    progress = Math.min(Math.max(progress, 0), 1);

    cardConfig.forEach(({ el, start, targetScale, offsetVh }) => {
      let scale;
      if (progress <= start) {
        scale = 1;
      } else {
        const t = (progress - start) / (1 - start || 1);
        scale = lerp(1, targetScale, Math.min(t, 1));
      }
      el.style.transform = `scale(${scale})`;
      el.style.translate = `0 ${offsetVh}vh`;
    });

    // Цветок на фоне плавно исчезает к концу скролла, чтобы не было
    // видно, как sticky-блок "отклеивается" и уезжает вместе со страницей.
    if (flowerWrap) {
      const fadeStart = 0.7;
      const fadeT = Math.min(Math.max((progress - fadeStart) / (1 - fadeStart), 0), 1);
      flowerWrap.style.opacity = String(1 - fadeT);
    }
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateScales();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateScales();
})();

/* ===================================================================
   Секция «Команда» — десктоп 1:172 (3 карточки в ряд),
   мобайл 1:2028 (карусель, свайп + точки)
   =================================================================== */
(() => {
  const section = document.querySelector('.team');
  if (!section) return;

  const TEAM = [
    { name: 'Дуденкова Лариса Евгеньевна', role: 'Главный врач, врач косметолог', image: 'assets/team/doctor-1.webp' },
    { name: 'Дуденков Арсений Михайлович', role: 'Врач косметолог, карбокситерапевт', image: 'assets/team/doctor-2.webp' },
    { name: 'Шалова Лариса Александровна', role: 'Врач косметолог', image: 'assets/team/doctor-3.webp' }
  ];

  function cardMarkup(item) {
    return `
      <article class="team-card">
        <div class="team-card__photo"><img src="${item.image}" alt="${item.name}"></div>
        <div class="team-card__info">
          <p class="team-card__name">${item.name}</p>
          <p class="team-card__role">${item.role}</p>
        </div>
      </article>
    `;
  }

  const row = section.querySelector('#team-row');
  if (row) row.innerHTML = TEAM.map(cardMarkup).join('');

  const track = section.querySelector('#team-track');
  const dotsWrap = section.querySelector('#team-dots');
  if (!track || !dotsWrap) return;

  track.innerHTML = TEAM.map(cardMarkup).join('');
  const cards = Array.from(track.querySelectorAll('.team-card'));

  dotsWrap.innerHTML = cards.map((_, i) =>
    `<button class="dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Сотрудник ${i + 1}" data-dot="${i}"></button>`
  ).join('');
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  let index = 0;

  function render() {
    track.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function setIndex(next) {
    index = Math.min(Math.max(next, 0), cards.length - 1);
    render();
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => setIndex(Number(dot.dataset.dot)));
  });

  let touchStartX = null;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    setIndex(index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  render();
})();

/* ===================================================================
   Секция «Результаты работы» — карусель как в «Услугах», карточки —
   слайдер «до/после» на фото (реальных фото ещё нет, заглушки).
   Десктоп 1:771 — 3 карточки, мобайл 1:2118 — 1 карточка.
   =================================================================== */
(() => {
  const results = document.querySelector('.results');
  if (!results) return;

  const track = results.querySelector('.results__track');
  const dotsWrap = results.querySelector('.results__dots');
  const navButtons = Array.from(results.querySelectorAll('.nav-btn'));

  // Когда появятся реальные фото "до"/"после" — просто замените imageBefore/imageAfter.
  const RESULTS = [
    { title: 'Название услуги', imageBefore: '', imageAfter: '', bookingUrl: '#', detailsUrl: '#' },
    { title: 'Название услуги', imageBefore: '', imageAfter: '', bookingUrl: '#', detailsUrl: '#' },
    { title: 'Название услуги', imageBefore: '', imageAfter: '', bookingUrl: '#', detailsUrl: '#' }
  ];

  let index = 0;
  let cards = [];
  const indicatorCount = 5;

  function sliderMarkup(item) {
    const beforeImg = item.imageBefore ? `<img class="result-slider__img result-slider__before" src="${item.imageBefore}" alt="До">` : `<div class="result-slider__img result-slider__before"></div>`;
    const afterImg = item.imageAfter ? `<img class="result-slider__img result-slider__after" src="${item.imageAfter}" alt="После">` : `<div class="result-slider__img result-slider__after"></div>`;
    return `
      <div class="result-slider">
        ${beforeImg}
        ${afterImg}
        <span class="result-slider__label result-slider__label--before">До</span>
        <span class="result-slider__label result-slider__label--after">После</span>
        <div class="result-slider__handle">
          <span class="result-slider__grip">↔</span>
        </div>
      </div>
    `;
  }

  function createCards() {
    track.innerHTML = RESULTS.map((item, i) => `
      <article class="result-card" data-result-index="${i}">
        <div class="result-card__photo">${sliderMarkup(item)}</div>
        <div class="result-card__body">
          <h3>${item.title}</h3>
          <div class="result-card__actions">
            <a class="btn btn--primary" href="${item.bookingUrl}"><span>Записаться</span><img class="btn__icon" src="assets/about-btn-arrow.svg" alt=""></a>
            <a class="btn btn--outline" href="${item.detailsUrl}">Подробнее</a>
          </div>
        </div>
      </article>
    `).join('');
    cards = Array.from(track.querySelectorAll('.result-card'));
    initSliders();
  }

  // Драг ползунка "до/после" мышью и пальцем.
  function initSliders() {
    track.querySelectorAll('.result-slider').forEach(slider => {
      let dragging = false;

      function setPos(clientX) {
        const rect = slider.getBoundingClientRect();
        const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1) * 100;
        slider.style.setProperty('--pos', pct + '%');
      }

      slider.addEventListener('pointerdown', e => {
        dragging = true;
        slider.setPointerCapture(e.pointerId);
        setPos(e.clientX);
      });
      slider.addEventListener('pointermove', e => {
        if (!dragging) return;
        setPos(e.clientX);
      });
      slider.addEventListener('pointerup', () => { dragging = false; });
      slider.addEventListener('pointercancel', () => { dragging = false; });
    });
  }

  function createDots() {
    dotsWrap.innerHTML = Array.from({ length: indicatorCount }, (_, i) =>
      `<button class="dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Перейти к части ${i + 1} списка результатов" data-dot="${i}"></button>`
    ).join('');

    dotsWrap.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const max = maxIndex();
        const segment = Number(dot.dataset.dot);
        const target = indicatorCount === 1 ? 0 : Math.round((segment / (indicatorCount - 1)) * max);
        setIndex(target);
      });
    });
  }

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function visibleCount() {
    return isMobile() ? 1 : 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount());
  }

  function renderDots() {
    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
    const max = maxIndex();
    const progress = max ? index / max : 0;
    const active = Math.min(indicatorCount - 1, Math.round(progress * (indicatorCount - 1)));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
  }

  function updateNavState() {
    const max = maxIndex();
    navButtons.forEach(btn => {
      btn.disabled = max === 0;
    });
  }

  function render() {
    if (!cards.length) return;

    if (isMobile()) {
      track.style.transform = `translateX(${-index * 100}%)`;
    } else {
      const gap = cards[0].parentElement.getBoundingClientRect().width * (1.1979 / 100);
      const step = cards[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(${-index * step}px)`;
    }

    renderDots();
    updateNavState();
  }

  function setIndex(next, loop = false) {
    const max = maxIndex();
    if (loop) {
      if (next > max) next = 0;
      if (next < 0) next = max;
    }
    index = Math.min(Math.max(next, 0), max);
    render();
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setIndex(index + (btn.dataset.dir === 'next' ? 1 : -1), true);
    });
  });

  let touchStartX = null;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    setIndex(index + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  window.addEventListener('resize', () => {
    index = Math.min(index, maxIndex());
    render();
  });

  createCards();
  createDots();
  render();
})();

/* ===================================================================
   Секция «Аппараты» — горизонтальная лента (Figma 977:9221): точки,
   автопрокрутка пока секция на экране, пауза при взаимодействии
   =================================================================== */
(() => {
  const scroller = document.getElementById('devices-scroller');
  const dotsWrap = document.getElementById('devices-dots');
  if (!scroller || !dotsWrap) return;

  const cards = Array.from(scroller.querySelectorAll('.device-card'));
  if (!cards.length) return;

  dotsWrap.innerHTML = cards.map((_, i) =>
    `<button class="dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Аппарат ${i + 1}" data-dot="${i}"></button>`
  ).join('');
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  const AUTO_MS = 4000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  let paused = false;

  const leftOf = card => card.offsetLeft - cards[0].offsetLeft;

  function currentIndex() {
    const x = scroller.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(leftOf(card) - x);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    // у правого края последняя карточка может не дойти до начала — считаем её активной
    if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2) best = cards.length - 1;
    return best;
  }

  function updateDots() {
    const idx = currentIndex();
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === idx));
  }

  function goTo(i) {
    scroller.scrollTo({ left: leftOf(cards[i]), behavior: 'smooth' });
  }

  function next() {
    const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
    if (atEnd) { scroller.scrollTo({ left: 0, behavior: 'smooth' }); return; }
    goTo(Math.min(currentIndex() + 1, cards.length - 1));
  }

  function start() {
    if (reduceMotion || timer || paused) return;
    timer = setInterval(next, AUTO_MS);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  dots.forEach(dot => dot.addEventListener('click', () => {
    goTo(Number(dot.dataset.dot));
    stop(); start();
  }));

  scroller.addEventListener('scroll', updateDots, { passive: true });

  ['mouseenter', 'focusin', 'touchstart', 'pointerdown', 'wheel'].forEach(ev =>
    scroller.addEventListener(ev, () => { paused = true; stop(); }, { passive: true }));
  ['mouseleave', 'focusout', 'touchend'].forEach(ev =>
    scroller.addEventListener(ev, () => { paused = false; start(); }, { passive: true }));

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start(); else stop();
    }, { threshold: 0.4 }).observe(scroller);
  }

  updateDots();
})();

/* ===================================================================
   Секция «Отзывы» — десктоп 1:228 (сетка из 4 карточек), мобайл 1:2052
   (карусель, свайп + точки). Отзывы подгружаются пачками из REVIEWS —
   сейчас там 4 карточки, поэтому кнопка «Загрузить ещё» скрыта; как
   только в массив добавят новые отзывы, кнопка появится сама и будет
   дозагружать следующую пачку.
   =================================================================== */
(() => {
  const section = document.querySelector('.reviews');
  if (!section) return;

  const grid = section.querySelector('#reviews-grid');
  const desktopDots = section.querySelector('#reviews-dots-desktop');
  const track = section.querySelector('#reviews-track');
  const mobileDotsWrap = section.querySelector('#reviews-dots-mobile');
  const loadMoreBtn = section.querySelector('#reviews-load-more');
  if (!grid || !track || !mobileDotsWrap || !loadMoreBtn) return;

  // Реальные отзывы из макета Figma (узлы 1:228 / 1:2052).
  // Чтобы добавить новый отзыв — просто дописать объект в конец массива.
  const REVIEWS = [
    { id: 1, image: 'assets/reviews/review-1.jpg', alt: 'Отзыв клиента о клинике Бетта в Нижнем Новгороде' },
    { id: 2, image: 'assets/reviews/review-2.jpg', alt: 'Отзыв клиента о клинике Бетта в Нижнем Новгороде' },
    { id: 3, image: 'assets/reviews/review-3.jpg', alt: 'Отзыв клиента о клинике Бетта в Нижнем Новгороде' },
    { id: 4, image: 'assets/reviews/review-4.jpg', alt: 'Отзыв клиента о клинике Бетта в Нижнем Новгороде' }
  ];

  const BATCH_SIZE = 4;
  let visibleCount = Math.min(BATCH_SIZE, REVIEWS.length);
  let index = 0;

  function cardMarkup(item) {
    return `
      <article class="review-card" data-review-id="${item.id}">
        <img src="${(section.dataset.base || '') + item.image}" alt="${item.alt}" loading="lazy">
      </article>
    `;
  }

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function renderCards() {
    const visible = REVIEWS.slice(0, visibleCount);
    const html = visible.map(cardMarkup).join('');

    grid.innerHTML = html;
    track.innerHTML = html;

    desktopDots.innerHTML = visible.map((_, i) =>
      `<span class="dot${i === 0 ? ' is-active' : ''}"></span>`
    ).join('');

    mobileDotsWrap.innerHTML = visible.map((_, i) =>
      `<button class="dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Отзыв ${i + 1}" data-dot="${i}"></button>`
    ).join('');
    mobileDotsWrap.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => setIndex(Number(dot.dataset.dot)));
    });

    loadMoreBtn.hidden = visibleCount >= REVIEWS.length;

    index = Math.min(index, visible.length - 1);
    renderCarousel();
  }

  function renderCarousel() {
    track.style.transform = `translateX(${-index * 100}%)`;
    const dots = Array.from(mobileDotsWrap.querySelectorAll('.dot'));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function setIndex(next) {
    const cards = track.querySelectorAll('.review-card');
    index = Math.min(Math.max(next, 0), cards.length - 1);
    renderCarousel();
  }

  loadMoreBtn.addEventListener('click', () => {
    visibleCount = Math.min(visibleCount + BATCH_SIZE, REVIEWS.length);
    renderCards();
  });

  let touchStartX = null;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    setIndex(index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (isMobile()) renderCarousel();
  });

  renderCards();
})();

/* ===================================================================
   Секция «Наши акции» (страница promo.html) — карусель картинок.
   Заголовок/цена уже впечатаны в саму картинку акции (готовый баннер),
   поэтому карточка — это просто фото. Акций будет много, поэтому
   десктоп листается кнопками (как «Услуги»/«Результаты работы»),
   мобайл — свайпом с точками.
   Как появятся реальные баннеры — положите файлы в assets/promo/ и
   допишите/замените записи в PROMO ниже (id, image, alt).
   =================================================================== */
(() => {
  const section = document.querySelector('.promo');
  if (!section) return;

  const grid = section.querySelector('#promo-grid');
  const track = section.querySelector('#promo-track');
  const mobileDotsWrap = section.querySelector('#promo-dots-mobile');
  const navButtons = Array.from(section.querySelectorAll('.promo__nav .nav-btn'));
  if (!grid || !track || !mobileDotsWrap) return;

  const PROMO = [
    { id: 1, image: 'assets/promo/promo-1.webp', alt: 'Акция «Ботулинотерапия»' },
    { id: 2, image: 'assets/promo/promo-2.webp', alt: 'Акция «Фотоомоложение»' },
    { id: 3, image: 'assets/promo/promo-3.webp', alt: 'Акция «PRP терапия»' },
    { id: 4, image: 'assets/promo/promo-4.webp', alt: 'Акция «Лазерное лечение акне»' },
    { id: 5, image: 'assets/promo/promo-5.webp', alt: 'Акция «Фототерапия декольте»' },
    { id: 6, image: 'assets/promo/promo-6.webp', alt: 'Акция «Биоревитализация»' },
    { id: 7, image: 'assets/promo/promo-7.webp', alt: 'Акция «Термолифтинг»' }
  ];

  let index = 0;
  let cards = [];

  function cardMarkup(item) {
    return `
      <article class="promo-card" data-promo-id="${item.id}">
        <img src="${item.image}" alt="${item.alt}" loading="lazy">
      </article>
    `;
  }

  function createCards() {
    const html = PROMO.map(cardMarkup).join('');
    grid.innerHTML = html;
    track.innerHTML = html;
    cards = Array.from(grid.querySelectorAll('.promo-card'));
  }

  function createMobileDots() {
    mobileDotsWrap.innerHTML = PROMO.map((_, i) =>
      `<button class="dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Акция ${i + 1}" data-dot="${i}"></button>`
    ).join('');
    mobileDotsWrap.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => setIndex(Number(dot.dataset.dot)));
    });
  }

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function visibleCount() {
    return isMobile() ? 1 : 4;
  }

  function maxIndex() {
    return Math.max(0, PROMO.length - visibleCount());
  }

  function updateNavState() {
    const max = maxIndex();
    navButtons.forEach(btn => {
      btn.disabled = max === 0;
    });
  }

  function render() {
    if (!cards.length) return;

    if (isMobile()) {
      track.style.transform = `translateX(${-index * 100}%)`;
      const dots = Array.from(mobileDotsWrap.querySelectorAll('.dot'));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    } else {
      const gap = cards[0].parentElement.getBoundingClientRect().width * (1.0208 / 100);
      const step = cards[0].getBoundingClientRect().width + gap;
      grid.style.transform = `translateX(${-index * step}px)`;
    }

    updateNavState();
  }

  function setIndex(next, loop = false) {
    const max = maxIndex();
    if (loop) {
      if (next > max) next = 0;
      if (next < 0) next = max;
    }
    index = Math.min(Math.max(next, 0), max);
    render();
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setIndex(index + (btn.dataset.dir === 'next' ? 1 : -1), true);
    });
  });

  let touchStartX = null;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    setIndex(index + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  window.addEventListener('resize', () => {
    index = Math.min(index, maxIndex());
    render();
  });

  createCards();
  createMobileDots();
  render();
})();

/* ===================================================================
   Блок «Оставьте заявку» — десктоп 1:459, мобайл 1:1872.
   Бэкенда для приёма заявок нет, поэтому просто гасим перезагрузку
   страницы по сабмиту (как и остальные CTA на сайте, форма пока
   декоративная и ждёт подключения реальной отправки).
   =================================================================== */
(() => {
  const form = document.querySelector('#apply-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
  });

  // Поле «Выберите процедуру» — выпадающий список всех услуг клиники
  // (направления → процедуры). Выбранное значение попадает в поле.
  const PROCEDURES = [{"group": "Лазерная косметология", "items": ["Фототерапия", "Лазерное омоложение и лазерная шлифовка", "Лазерная эпиляция", "Лазерная биоревитализация"]}, {"group": "Удаление шрамов, рубцов и новообразований", "items": ["Удаление новообразований", "Удаление шрамов, рубцов и стрий"]}, {"group": "Врачебная косметология", "items": ["Плазмотерапия лица и волосяной части головы", "Трихология", "Плацентарная терапия", "Криодеструкция", "Лечение акне и постакне", "Электрокоагуляция"]}, {"group": "Ботулинотерапия", "items": ["Ботулинотерапия", "Гипергидроз"]}, {"group": "Инъекционная косметология", "items": ["Контурная пластика лица и губ", "Липолитическая терапия", "Мезотерапия и биоревитализация", "Инъекционная карбокситерапия", "Коллагенотерапия лица и тела"]}, {"group": "Аппаратная косметология", "items": ["SMAS-лифтинг", "Микротоковая терапия", "Инъекционная карбокситерапия", "RF-лифтинг", "Лифтометрия", "Холодная плазма", "Безинъекционная мезотерапия"]}, {"group": "Моделирование силуэта и массаж", "items": ["RSL-скульптурирование", "Массажи", "Кавитация", "Прессотерапия"]}, {"group": "Эстетическая косметология", "items": ["Чистка кожи лица", "Массаж лица", "Безинъекционная карбокситерапия", "Программы красоты", "Пилинги лица", "Дарсонвализация"]}, {"group": "Реабилитация после пластики и хирургии", "items": ["Аппаратная терапия после хирургии", "Инъекционные методики после хирургии"]}];

  const procField = form.querySelector('.apply__field--procedure');
  const procInput = procField && procField.querySelector('input');
  if (procField && procInput) {
    const list = document.createElement('div');
    list.className = 'apply__select';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    list.innerHTML = PROCEDURES.map(g =>
      `<div class="apply__select-group">${g.group}</div>` +
      g.items.map(n => `<button type="button" class="apply__select-item" role="option">${n}</button>`).join('')
    ).join('');
    procField.appendChild(list);
    procInput.setAttribute('aria-haspopup', 'listbox');
    procInput.setAttribute('aria-expanded', 'false');

    const setOpen = (open) => {
      list.hidden = !open;
      procField.classList.toggle('is-open', open);
      procInput.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    procField.addEventListener('click', (e) => {
      if (e.target.closest('.apply__select-item')) {
        procInput.value = e.target.closest('.apply__select-item').textContent;
        list.querySelectorAll('.is-selected').forEach(el => el.classList.remove('is-selected'));
        e.target.closest('.apply__select-item').classList.add('is-selected');
        setOpen(false);
        return;
      }
      if (e.target.closest('.apply__select')) return;
      setOpen(list.hidden);
    });
    document.addEventListener('click', (e) => {
      if (!procField.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Поле «Выберите дату» — видимое текстовое поле показывает
  // отформатированную дату, а реальный выбор идёт через скрытый
  // нативный календарь <input type="date">, открытый поверх него.
  const dateField = form.querySelector('.apply__field--date');
  const dateDisplay = form.querySelector('#apply-date-display');
  const dateNative = form.querySelector('#apply-date-native');

  if (dateField && dateDisplay && dateNative) {
    const openPicker = () => {
      if (typeof dateNative.showPicker === 'function') {
        dateNative.showPicker();
      } else {
        dateNative.focus();
        dateNative.click();
      }
    };

    dateField.addEventListener('click', openPicker);

    dateNative.addEventListener('change', () => {
      if (!dateNative.value) {
        dateDisplay.value = '';
        return;
      }
      const [year, month, day] = dateNative.value.split('-');
      dateDisplay.value = `${day}.${month}.${year}`;
    });
  }
})();

/* ===================================================================
   Секция «Блог» — тот же паттерн, что «Отзывы»: сетка из 4 карточек
   на десктопе, карусель + точки на мобайле. Статьи подгружаются
   пачками из ARTICLES — сейчас там 4, поэтому кнопка «Читать ещё»
   скрыта; как только в массив добавят новую статью, кнопка появится
   сама и будет дозагружать следующую пачку.
   =================================================================== */
(() => {
  const section = document.querySelector('.blog');
  if (!section) return;

  const grid = section.querySelector('#blog-grid');
  const desktopDots = section.querySelector('#blog-dots-desktop');
  const track = section.querySelector('#blog-track');
  const mobileDotsWrap = section.querySelector('#blog-dots-mobile');
  const loadMoreBtn = section.querySelector('#blog-load-more');
  if (!grid || !track || !mobileDotsWrap || !loadMoreBtn) return;

  // Заглушки статей — чтобы добавить новую, просто дописать объект в конец массива.
  const ARTICLES = [
    { id: 1, image: 'assets/services/aes-chistka-kozhi.webp', date: '12.09.2026', title: 'Забота о коже: с чего начать', url: 'articles/kozha-s-chego-nachat.html' },
    { id: 2, image: 'assets/services/rehab-inektsionnye-metodiki.webp', date: '05.09.2026', title: 'Как подготовиться к визиту в клинику', url: 'articles/pered-vizitom-v-kliniku.html' },
    { id: 3, image: 'assets/services/aes-massazh-litsa.webp', date: '28.08.2026', title: 'Уход после процедур: общие рекомендации', url: 'articles/uhod-posle-procedur.html' },
    { id: 4, image: 'assets/services/med-plazmoterapiya-litsa.webp', date: '19.08.2026', title: 'Привычки, которые влияют на состояние кожи', url: 'articles/privychki-i-kozha.html' }
  ];

  const BATCH_SIZE = 4;
  let visibleCount = Math.min(BATCH_SIZE, ARTICLES.length);
  let index = 0;

  function cardMarkup(item) {
    return `
      <a class="blog-card" href="${item.url}" data-article-id="${item.id}">
        <img class="blog-card__image" src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="blog-card__body">
          <p class="blog-card__eyebrow">${item.date}</p>
          <h3 class="blog-card__title">${item.title}</h3>
          <span class="blog-card__link">
            Читать
            <img src="assets/services/help-arrow-desktop.svg" alt="">
          </span>
        </div>
      </a>
    `;
  }

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function renderCards() {
    const visible = ARTICLES.slice(0, visibleCount);
    const html = visible.map(cardMarkup).join('');

    grid.innerHTML = html;
    track.innerHTML = html;

    desktopDots.innerHTML = visible.map((_, i) =>
      `<span class="dot${i === 0 ? ' is-active' : ''}"></span>`
    ).join('');

    mobileDotsWrap.innerHTML = visible.map((_, i) =>
      `<button class="dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Статья ${i + 1}" data-dot="${i}"></button>`
    ).join('');
    mobileDotsWrap.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => setIndex(Number(dot.dataset.dot)));
    });

    loadMoreBtn.hidden = visibleCount >= ARTICLES.length;

    index = Math.min(index, visible.length - 1);
    renderCarousel();
  }

  function renderCarousel() {
    track.style.transform = `translateX(${-index * 100}%)`;
    const dots = Array.from(mobileDotsWrap.querySelectorAll('.dot'));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function setIndex(next) {
    const cards = track.querySelectorAll('.blog-card');
    index = Math.min(Math.max(next, 0), cards.length - 1);
    renderCarousel();
  }

  loadMoreBtn.addEventListener('click', () => {
    visibleCount = Math.min(visibleCount + BATCH_SIZE, ARTICLES.length);
    renderCards();
  });

  let touchStartX = null;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    setIndex(index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (isMobile()) renderCarousel();
  });

  renderCards();
})();

/* ===================================================================
   Закреплённое меню на главной странице — отдельная шапка (не герой),
   появляется, когда пользователь прокрутил больше высоты одного
   экрана. Исходное меню на первом экране остаётся как в макете.
   =================================================================== */
(() => {
  const pinnedHeader = document.querySelector('.page-header--pinned');
  if (!pinnedHeader) return;

  function update() {
    const visible = window.scrollY > window.innerHeight;
    pinnedHeader.classList.toggle('is-visible', visible);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ===================================================================
   Кнопка чата в углу — по клику раскрывает список: Max, ВКонтакте,
   почта, позвонить. Закрывается по повторному клику, Esc и клику мимо.
   =================================================================== */
(() => {
  const fab = document.getElementById('chatFab');
  const btn = document.getElementById('chatFabBtn');
  const menu = document.getElementById('chatFabMenu');
  if (!fab || !btn || !menu) return;

  function setOpen(open) {
    fab.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
  }

  /* Инверсия: если под кнопкой тёмный фон (баннеры на фото, футер,
     тёмные плашки) — кнопка становится светлой. */
  const DARK_SELECTOR = '.trust, .cta, .individual, .site-footer__body, .hero';
  function lum(rgb) {
    const m = rgb.match(/[\d.]+/g);
    if (!m) return 1;
    const [r, g, b] = m.map(Number);
    const a = m.length > 3 ? m[3] : 1;
    return a < 0.5 ? null : (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  function updateTone() {
    const r = btn.getBoundingClientRect();
    const stack = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    let dark = stack.some((el) => !fab.contains(el) && el.matches && el.matches(DARK_SELECTOR) && !el.matches('.hero'));
    if (!dark) {
      for (const el of stack) {
        if (fab.contains(el)) continue;
        const l = lum(getComputedStyle(el).backgroundColor);
        if (l !== null) { dark = l < 0.4; break; }
      }
    }
    fab.classList.toggle('is-on-dark', dark);
  }
  let tick = false;
  function onScroll() {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => { tick = false; updateTone(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateTone();

  btn.addEventListener('click', () => setOpen(menu.hidden));
  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();

// Висячие предлоги: короткие предлоги, союзы и частицы склеиваются со следующим словом
// неразрывным пробелом, тире — с предыдущим. Статический текст уже обработан
// (tools/nbsp.py), здесь — текст, который строят скрипты (карточки, отзывы и т. д.).
(function () {
  const WORDS = 'в во к ко с со у о об обо от до из за на по при про над под без для или и а но да не ни же бы ли как что то'
    .split(' ').sort((a, b) => b.length - a.length).join('|');
  const RE_WORD = new RegExp('(^|[^А-Яа-яЁё\\w])(' + WORDS + ')[ \\t]+', 'gi');
  const RE_DASH = /[ \t]+([—–])(?=[ \t ])/g;
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'TITLE', 'CODE', 'PRE']);

  function glueText(text) {
    for (let i = 0; i < 2; i++) text = text.replace(RE_WORD, '$1$2 ');
    return text.replace(RE_DASH, ' $1');
  }

  function walk(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentNode;
        return p && !SKIP.has(p.nodeName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const next = glueText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  let timer = 0;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => walk(document.body), 50);
  }

  function start() {
    walk(document.body);
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

// Плашка о файлах cookie: показывается, пока посетитель не нажмёт «Понятно».
(() => {
  const KEY = 'betta-cookie-ok';
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  const scriptEl = document.currentScript || document.querySelector('script[src*="script.js"]');
  const privacyUrl = new URL('privacy.html', scriptEl ? scriptEl.src : location.href).href;
  const show = () => {
    const box = document.createElement('div');
    box.className = 'cookie-banner';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Файлы cookie');
    box.innerHTML =
      '<p class="cookie-banner__text">Мы&nbsp;используем файлы cookie и&nbsp;счётчики Яндекс.Метрика для&nbsp;улучшения работы сайта. ' +
      'Продолжая использовать наш сайт, вы&nbsp;соглашаетесь на&nbsp;использование файлов cookie и&nbsp;программы Яндекс.Метрика, ' +
      'если вы&nbsp;не&nbsp;отключите их на&nbsp;этом устройстве, а&nbsp;также принимаете нашу ' +
      '<a href="' + privacyUrl + '" target="_blank" rel="noopener">политику конфиденциальности</a>.</p>' +
      '<button type="button" class="cookie-banner__btn">Понятно</button>';
    box.querySelector('button').addEventListener('click', () => {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      box.remove();
    });
    document.body.appendChild(box);
  };
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
