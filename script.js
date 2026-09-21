/* ============================================================
   Flores amarillas 🌻 — hecho por Sebas
   ============================================================ */
(() => {
  'use strict';

  /* ---------- Textos y tiempos: edita aquí ---------- */
  const CONFIG = {
    intro: ['No pude comprar flores amarillas…', 'pero puedo hacer esto'],
    title: 'Para ti',
    subtitle: 'Feliz Día de las Flores Amarillas',
    tagPrefix: 'de:',
    tag: 'Sebas',
    // milisegundos desde que abre la página
    timing: {
      introOut: 7600,  // el texto inicial se va
      field: 8000,     // crece el campo de girasoles
      bouquet: 12400,  // aparece el ramo y "Para ti"
      done: 16500      // aparece "Desliza" y se puede bajar a los créditos
    }
  };

  const body = document.body;
  const $ = (sel) => document.querySelector(sel);
  const rand = (a, b) => a + Math.random() * (b - a);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     Dibujos reutilizables (girasol, nube, degradados)
     ============================================================ */
  function buildDefs() {
    const N = 18;
    const step = 360 / N;
    const petalBack = 'M0 -17 C 10 -26 9 -40 0 -49 C -9 -40 -10 -26 0 -17Z';
    const petalFront = 'M0 -15 C 9 -23 8 -37 0 -45 C -8 -37 -9 -23 0 -15Z';

    let back = '';
    let front = '';
    for (let i = 0; i < N; i++) {
      back += `<path d="${petalBack}" transform="rotate(${(i * step).toFixed(2)})" fill="url(#sfBack)"/>`;
      front += `<g transform="rotate(${(i * step + step / 2).toFixed(2)})">` +
        `<path d="${petalFront}" fill="url(#sfFront)" stroke="rgba(196,120,0,.35)" stroke-width=".6"/>` +
        `<path d="M0 -19 L0 -37" stroke="rgba(214,140,0,.4)" stroke-width=".7" fill="none"/></g>`;
    }

    // semillas del centro: espiral de girasol (ángulo áureo)
    let seeds = '';
    for (let k = 1; k <= 80; k++) {
      const r = 2.0 * Math.sqrt(k);
      const a = k * 137.508 * Math.PI / 180;
      const x = (r * Math.cos(a)).toFixed(2);
      const y = (r * Math.sin(a)).toFixed(2);
      const dot = (0.85 + (r / 18) * 0.7).toFixed(2);
      seeds += `<circle cx="${x}" cy="${y}" r="${dot}" fill="${k % 2 ? '#e0a850' : '#8b5a24'}" opacity=".7"/>`;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    svg.innerHTML = `
      <defs>
        <linearGradient id="sfBack" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="#f08c00"/><stop offset=".55" stop-color="#ffb800"/><stop offset="1" stop-color="#ffd21f"/>
        </linearGradient>
        <linearGradient id="sfFront" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="#ffb000"/><stop offset=".6" stop-color="#ffd000"/><stop offset="1" stop-color="#ffe95c"/>
        </linearGradient>
        <radialGradient id="sfCore" cx=".42" cy=".38" r=".75">
          <stop offset="0" stop-color="#8a5322"/><stop offset=".55" stop-color="#52300f"/><stop offset="1" stop-color="#2b1606"/>
        </radialGradient>

        <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#b9e582"/><stop offset="1" stop-color="#86c957"/>
        </linearGradient>
        <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8ad24f"/><stop offset="1" stop-color="#5db22f"/>
        </linearGradient>
        <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#63b830"/><stop offset="1" stop-color="#3d8f22"/>
        </linearGradient>

        <symbol id="sf-head" viewBox="-50 -50 100 100">
          ${back}
          ${front}
          <circle r="20.5" fill="url(#sfCore)" stroke="#3a1f08" stroke-width="1.2"/>
          ${seeds}
        </symbol>

        <symbol id="cloud" viewBox="0 0 240 110">
          <g fill="#d6ebfb">
            <circle cx="62" cy="78" r="30"/><circle cx="104" cy="64" r="38"/>
            <circle cx="150" cy="58" r="34"/><circle cx="190" cy="80" r="28"/>
            <rect x="34" y="78" width="184" height="30" rx="15"/>
          </g>
          <g fill="#fff">
            <circle cx="62" cy="72" r="30"/><circle cx="104" cy="56" r="38"/>
            <circle cx="150" cy="50" r="34"/><circle cx="190" cy="72" r="28"/>
            <rect x="34" y="70" width="184" height="30" rx="15"/>
          </g>
        </symbol>
      </defs>`;
    body.prepend(svg);
  }

  /* ============================================================
     Cielo: nubes
     ============================================================ */
  function buildClouds() {
    const box = $('#clouds');
    const count = 8;
    for (let i = 0; i < count; i++) {
      const t = rand(80, 170);
      const el = document.createElement('div');
      el.className = 'cloud';
      el.style.cssText =
        `--y:${rand(2, 52).toFixed(1)}%;--w:${rand(120, 280).toFixed(0)}px;` +
        `--o:${rand(.72, .96).toFixed(2)};--t:${t.toFixed(0)}s;--d:${(-rand(0, t)).toFixed(1)}s`;
      el.innerHTML = '<svg viewBox="0 0 240 110"><use href="#cloud"/></svg>';
      box.appendChild(el);
    }
  }

  /* ============================================================
     1 · Texto inicial
     ============================================================ */
  function words(el, text) {
    el.textContent = '';
    text.split(/\s+/).forEach((word, i, all) => {
      const span = document.createElement('span');
      span.className = 'w';
      span.style.setProperty('--i', i);
      span.textContent = word;
      el.appendChild(span);
      if (i < all.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  /* ============================================================
     2 · Campo de girasoles
     ============================================================ */
  const LAYERS = [
    { // atrás, pequeñas
      grad: 'hillBack', hh: 44, f: .55, gap: .8, min: 8,
      by: [18, 27], L: [90, 170], delay: [0, 1.2], hillDelay: 0,
      wave: 'M0 70 C 200 45, 420 50, 640 68 S 1080 90, 1260 60 S 1400 55, 1440 62 L1440 200 L0 200Z'
    },
    { // en medio
      grad: 'hillMid', hh: 30, f: .85, gap: .85, min: 5,
      by: [10, 17], L: [110, 200], delay: [.5, 1.8], hillDelay: .35,
      wave: 'M0 60 C 240 88, 480 88, 720 62 S 1200 45, 1440 70 L1440 200 L0 200Z'
    },
    { // adelante, grandes
      grad: 'hillFront', hh: 17, f: 1.35, gap: .95, min: 3,
      by: [1, 7], L: [140, 240], delay: [1, 2.4], hillDelay: .7,
      wave: 'M0 72 C 300 48, 560 52, 800 76 S 1250 92, 1440 60 L1440 200 L0 200Z'
    }
  ];

  function baseSize() {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;height:0;width:var(--base)';
    body.appendChild(probe);
    const px = probe.offsetWidth || 80;
    probe.remove();
    return px;
  }

  function flowerSVG(L, bend, tilt) {
    const H = 100 + L;
    const stem = `M50 ${H} C ${50 + bend} ${100 + L * .7}, ${50 - bend} ${100 + L * .3}, 50 86`;
    const leaf = (y) =>
      `<path d="M50 ${y} C 62 ${y - 18}, 88 ${y - 16}, 96 ${y - 6} C 84 ${y + 8}, 62 ${y + 8}, 50 ${y}Z" fill="#58b53a"/>` +
      `<path d="M50 ${y} Q 72 ${y - 8} 92 ${y - 6}" stroke="#2f7d22" stroke-width="1.2" fill="none"/>`;
    const y1 = 100 + L * rand(.4, .5);
    const y2 = 100 + L * rand(.68, .78);
    return `<svg viewBox="0 0 100 ${H}">
      <path d="${stem}" stroke="#3f9a2b" stroke-width="5.5" stroke-linecap="round" fill="none"/>
      ${leaf(y1)}
      <g transform="translate(100 0) scale(-1 1)">${leaf(y2)}</g>
      <g transform="rotate(${tilt} 50 50)"><use href="#sf-head" x="0" y="0" width="100" height="100"/></g>
    </svg>`;
  }

  let fieldWidth = 0;

  function buildField() {
    const field = $('#field');
    field.textContent = '';
    fieldWidth = window.innerWidth;

    const base = baseSize();
    const late = body.classList.contains('s-field'); // reconstruido con el campo ya visible

    LAYERS.forEach((cfg) => {
      const layer = document.createElement('div');
      layer.className = 'layer';
      layer.style.setProperty('--hh', cfg.hh + '%');
      layer.style.setProperty('--hd', cfg.hillDelay + 's');
      layer.innerHTML =
        `<div class="hill"><svg viewBox="0 0 1440 200" preserveAspectRatio="none">` +
        `<path d="${cfg.wave}" fill="url(#${cfg.grad})"/></svg></div>`;

      const W = base * cfg.f;
      const n = Math.max(cfg.min, Math.ceil(fieldWidth / (W * cfg.gap)));
      const flowers = [];

      for (let i = 0; i < n; i++) {
        const el = document.createElement('div');
        el.className = 'flower';
        const by = rand(cfg.by[0], cfg.by[1]);
        const gd = late ? rand(0, .8) : rand(cfg.delay[0], cfg.delay[1]);
        el.style.cssText =
          `--x:${(((i + rand(.1, .9)) / n) * 100).toFixed(2)}%;` +
          `--w:${(W * rand(.88, 1.12)).toFixed(1)}px;` +
          `--by:${by.toFixed(2)}%;--gd:${gd.toFixed(2)}s;` +
          `--st:${rand(3, 5.5).toFixed(2)}s;--sd:${(-rand(0, 5)).toFixed(2)}s`;
        el.innerHTML = flowerSVG(rand(cfg.L[0], cfg.L[1]), rand(-7, 7), rand(-14, 14));
        flowers.push({ el, by });
      }

      // las más bajas se dibujan al final (quedan al frente)
      flowers.sort((a, b) => b.by - a.by).forEach((f) => layer.appendChild(f.el));
      field.appendChild(layer);
    });
  }

  /* ---------- Abejitas ---------- */
  const BEE = `
    <svg viewBox="0 0 44 32" aria-hidden="true">
      <defs><clipPath id="beeClip"><ellipse cx="20" cy="19" rx="13" ry="9"/></clipPath></defs>
      <ellipse class="wing" cx="17" cy="9" rx="8" ry="6" fill="#fff" opacity=".75"/>
      <ellipse class="wing" cx="26" cy="8" rx="8" ry="6" fill="#fff" opacity=".65"/>
      <ellipse cx="20" cy="19" rx="13" ry="9" fill="#ffcc1a"/>
      <g clip-path="url(#beeClip)" fill="#3a2508">
        <rect x="14" y="8" width="4" height="22"/><rect x="22" y="8" width="4" height="22"/>
      </g>
      <path d="M7 19 L2 19" stroke="#3a2508" stroke-width="2" stroke-linecap="round"/>
      <circle cx="34" cy="18" r="6" fill="#3a2508"/>
      <circle cx="36" cy="16.5" r="1.3" fill="#fff"/>
    </svg>`;

  /* ============================================================
     3 · Ramo
     ============================================================ */
  function buildBouquet() {
    const heads = [[160, 86], [84, 118], [236, 118], [52, 184], [268, 184], [160, 150], [104, 208], [216, 208]];
    $('#bqStems').innerHTML = heads
      .map(([x, y]) => `<path d="M${x} ${y} Q ${(x + 160) / 2} ${(y + 270) / 2 + 10} 160 272"/>`)
      .join('');

    const tips = [[22, 150], [36, 98], [66, 52], [104, 22], [216, 22], [254, 52], [284, 98], [298, 150], [14, 206], [306, 206]];
    const dots = [[0, 0], [-5, 4], [5, 3], [1, -6]];
    $('#bqFiller').innerHTML = tips.map(([x, y]) =>
      `<path d="M160 250 Q ${(160 + x) / 2} ${(250 + y) / 2 + 20} ${x} ${y}" stroke="#4fa03a" stroke-width="1.6" fill="none"/>` +
      dots.map(([dx, dy]) =>
        `<circle cx="${x + dx}" cy="${y + dy}" r="4.2" fill="#8fd0ff" stroke="#5fb0ea" stroke-width=".8"/>` +
        `<circle cx="${x + dx}" cy="${y + dy}" r="1.4" fill="#ffe45c"/>`).join('')
    ).join('');
  }

  /* ---------- Pétalos ---------- */
  const petals = () => $('#petals');

  function startPetals() {
    if (reduceMotion) return;
    const count = window.innerWidth < 600 ? 14 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'petal fall';
      p.style.cssText =
        `--l:${rand(0, 100).toFixed(1)}%;--s:${rand(9, 17).toFixed(1)}px;--dx:${rand(-90, 90).toFixed(0)}px;` +
        `--dur:${rand(9, 16).toFixed(1)}s;--del:${rand(0, 9).toFixed(1)}s`;
      petals().appendChild(p);
    }
  }

  function burst(x, y) {
    if (reduceMotion) return;
    const box = petals().getBoundingClientRect(); // la portada puede estar desplazada
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'petal burst';
      p.style.cssText =
        `left:${x - box.left}px;top:${y - box.top}px;--s:${rand(9, 16).toFixed(1)}px;` +
        `--dx:${rand(-130, 130).toFixed(0)}px;--dy:${rand(-190, -60).toFixed(0)}px;--r:${rand(-400, 400).toFixed(0)}deg`;
      p.addEventListener('animationend', () => p.remove());
      petals().appendChild(p);
    }
  }

  /* ============================================================
     Línea de tiempo
     ============================================================ */
  const STAGES = ['s-intro', 's-introOut', 's-field', 's-bouquet', 's-done'];
  let timers = [];
  const after = (ms, fn) => timers.push(setTimeout(fn, ms));

  function play() {
    const T = CONFIG.timing;
    buildField();
    body.classList.add('s-intro');
    after(T.introOut, () => body.classList.add('s-introOut'));
    after(T.field, () => body.classList.add('s-field'));
    after(T.bouquet, () => { body.classList.add('s-bouquet'); startPetals(); });
    after(T.done, () => body.classList.add('s-done'));
  }

  function replay() {
    timers.forEach(clearTimeout);
    timers = [];
    // primero subir a la portada (esperando a llegar de verdad), luego reiniciar
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const t0 = performance.now();
    const check = () => {
      if (window.scrollY > 2 && performance.now() - t0 < 2500) {
        setTimeout(check, 50);
        return;
      }
      window.scrollTo(0, 0);
      body.classList.remove('s-done');
      $('#scene').classList.add('hide');
      setTimeout(() => {
        body.classList.remove(...STAGES);
        petals().textContent = '';
        void body.offsetWidth; // reinicia las animaciones CSS
        $('#scene').classList.remove('hide');
        play();
      }, 800);
    };
    check();
  }

  /* ---------- Créditos: aparecen al deslizar ---------- */
  function watchReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.add('no-io');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    items.forEach((el) => io.observe(el));
  }

  /* ============================================================
     Inicio
     ============================================================ */
  buildDefs();
  buildClouds();
  buildBouquet();

  words($('#introLine1'), CONFIG.intro[0]);
  words($('#introLine2'), CONFIG.intro[1]);
  $('#title').textContent = CONFIG.title;
  $('#subtitle').textContent = CONFIG.subtitle;
  $('#bqTagPre').textContent = CONFIG.tagPrefix;
  $('#bqTag').textContent = CONFIG.tag;
  $('#bee1').innerHTML = BEE;
  $('#bee2').innerHTML = BEE.replace('id="beeClip"', 'id="beeClip2"').replace('url(#beeClip)', 'url(#beeClip2)');

  $('#replay').addEventListener('click', replay);
  watchReveals();

  // toca la portada al final y salen pétalos (click, no pointerdown: así deslizar no los activa)
  document.addEventListener('click', (e) => {
    if (!body.classList.contains('s-bouquet') || !e.target.closest('#scene')) return;
    burst(e.clientX, e.clientY);
  });

  // si giran el celular, rehacer el campo para que llene el ancho
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (Math.abs(window.innerWidth - fieldWidth) > 60) buildField();
    }, 250);
  });

  // esperar a que carguen las tipografías para que el texto no "salte"
  const start = () => play();
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(start);
  } else {
    start();
  }
})();
