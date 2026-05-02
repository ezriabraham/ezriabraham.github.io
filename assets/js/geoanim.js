/* geoanim.js — living nature+science+geometric world */
(function () {
  'use strict';

  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isHero   = !!document.querySelector('.hero');

  /* ═══════════════════════════════════════════════════
     1. BACKGROUND PARTICLE CANVAS — circles only, no hexagons
     ═══════════════════════════════════════════════════ */
  var bg = document.createElement('canvas');
  bg.setAttribute('aria-hidden', 'true');
  Object.assign(bg.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    zIndex: '-1', pointerEvents: 'none',
  });
  document.body.prepend(bg);
  var bx = bg.getContext('2d');
  var W, H;
  function resize() { W = bg.width = window.innerWidth; H = bg.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function Pt() {
    this.x  = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * (noMotion ? 0 : 0.14);
    this.vy = (Math.random() - 0.5) * (noMotion ? 0 : 0.14);
    this.r  = Math.random() * 3 + 1.5;
    this.c  = Math.random() > 0.5 ? '26,61,143' : '28,163,88';
    this.ph = Math.random() * Math.PI * 2;
    this.ps = 0.004 + Math.random() * 0.007;
  }
  Pt.prototype.tick = function () {
    this.x += this.vx; this.y += this.vy; this.ph += this.ps;
    if (this.x < -80) this.x = W + 80; if (this.x > W + 80) this.x = -80;
    if (this.y < -80) this.y = H + 80; if (this.y > H + 80) this.y = -80;
  };
  var MAXD = 200;
  var pts  = Array.from({ length: 38 }, function () { return new Pt(); });
  function bgFrame() {
    bx.clearRect(0, 0, W, H);
    pts.forEach(function (p) { p.tick(); });
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < MAXD) {
          bx.strokeStyle = 'rgba(' + pts[i].c + ',' + ((1 - d / MAXD) * 0.04) + ')';
          bx.lineWidth = 0.4;
          bx.beginPath(); bx.moveTo(pts[i].x, pts[i].y); bx.lineTo(pts[j].x, pts[j].y); bx.stroke();
        }
      }
    }
    pts.forEach(function (p) {
      var a = 0.048 + 0.02 * Math.sin(p.ph);
      bx.strokeStyle = 'rgba(' + p.c + ',' + a + ')';
      bx.fillStyle   = 'rgba(' + p.c + ',' + (a * 0.2) + ')';
      bx.lineWidth = 0.5;
      bx.beginPath();
      bx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bx.fill(); bx.stroke();
    });
    requestAnimationFrame(bgFrame);
  }
  requestAnimationFrame(bgFrame);

  if (noMotion) return;

  /* ═══════════════════════════════════════════════════
     2. MOBILE NAV (hamburger)
     ═══════════════════════════════════════════════════ */
  (function () {
    var mS = document.createElement('style');
    mS.textContent =
      '.nav-hamburger{display:none;background:none;border:none;cursor:pointer;padding:0.4rem;' +
      'color:var(--text2);flex-direction:column;gap:5px;align-items:center;justify-content:center;}' +
      '@media(max-width:768px){.nav-hamburger{display:flex;}}' +
      '.nav-hamburger span{display:block;width:22px;height:1.5px;background:currentColor;' +
      'transition:transform 0.25s,opacity 0.25s,background 0.2s;border-radius:1px;}' +
      '.nav-hamburger.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg);}' +
      '.nav-hamburger.open span:nth-child(2){opacity:0;}' +
      '.nav-hamburger.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg);}' +
      '.nav-mobile{display:none;position:fixed;top:var(--nav-h);left:0;right:0;' +
      'background:rgba(var(--bg-rgb),0.97);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);' +
      'border-bottom:1px solid var(--border);z-index:998;flex-direction:column;padding:0.5rem 0;}' +
      '.nav-mobile.open{display:flex;}' +
      '.nav-mobile a{font-family:var(--font-mono);font-size:0.78rem;font-weight:700;' +
      'letter-spacing:0.18em;text-transform:uppercase;color:var(--text2);' +
      'padding:0.95rem 1.5rem;border-bottom:1px solid var(--border);transition:color 0.2s,background 0.2s;}' +
      '.nav-mobile a:last-child{border-bottom:none;}' +
      '.nav-mobile a:hover,.nav-mobile a.active{color:var(--text);background:rgba(26,61,143,0.05);}';
    document.head.appendChild(mS);

    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var btn = document.createElement('button');
    btn.className = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    /* build mobile menu by cloning the existing nav links */
    var menu = document.createElement('div');
    menu.className = 'nav-mobile';
    var srcLinks = nav.querySelectorAll('.nav-links a');
    srcLinks.forEach(function (a) {
      var link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent;
      if (a.classList.contains('active')) link.classList.add('active');
      link.addEventListener('click', close);
      menu.appendChild(link);
    });
    document.body.appendChild(menu);

    function open()  { btn.classList.add('open'); menu.classList.add('open'); btn.setAttribute('aria-expanded','true'); document.body.style.overflow=''; }
    function close() { btn.classList.remove('open'); menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
    btn.addEventListener('click', function () { menu.classList.contains('open') ? close() : open(); });

    /* close on outside click */
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) close();
    });
    /* close on resize to desktop */
    window.addEventListener('resize', function () { if (window.innerWidth > 768) close(); });
  })();

  /* ═══════════════════════════════════════════════════
     3. CSS
     ═══════════════════════════════════════════════════ */
  var S = document.createElement('style');
  S.textContent =
    /* margin creatures — absolute on page, visible only when margins exist */
    '.mgn-creature{position:absolute;pointer-events:none;opacity:0.42;z-index:200;}' +
    '@media(max-width:960px){.mgn-creature{display:none;}}' +

    '@keyframes frogHop{' +
    '0%,30%,100%{transform:translateY(0) scaleY(1);}' +
    '8%{transform:translateY(-38px) scaleY(0.82) rotate(-10deg);}' +
    '16%{transform:translateY(0) scaleY(1.1);}' +
    '55%{transform:translateY(-22px) scaleY(0.88) rotate(7deg);}' +
    '63%{transform:translateY(0) scaleY(1.06);}' +
    '70%,95%{transform:translateY(0) scaleY(1);}}' +

    '@keyframes snakeSlither{' +
    '0%,100%{transform:translateX(0) rotate(0deg);}' +
    '20%{transform:translateX(9px) rotate(4deg);}' +
    '40%{transform:translateX(-6px) rotate(-3deg);}' +
    '60%{transform:translateX(11px) rotate(5deg);}' +
    '80%{transform:translateX(-9px) rotate(-4deg);}}' +

    '@keyframes pelicanGlide{' +
    '0%,100%{transform:translateY(0) rotate(-1.5deg);}' +
    '50%{transform:translateY(-20px) rotate(1.5deg);}}' +
    '@keyframes pelicanWing{' +
    '0%,100%{transform:scaleY(1);}' +
    '45%{transform:scaleY(0.28);}' +
    '50%{transform:scaleY(0.28);}' +
    '65%{transform:scaleY(1);}}' +

    /* ocean footer: wave SVG provides both the wavy top edge AND all the fill below */
    '.sea-zone{position:relative;overflow:hidden;min-height:280px;background:transparent;}' +
    '.sea-wave{position:absolute;top:0;left:0;width:300%;height:100%;min-height:280px;pointer-events:none;z-index:1;' +
    'animation:waveSurf 7s linear infinite;}' +
    '@keyframes waveSurf{from{transform:translateX(0);}to{transform:translateX(-33.333%);}}' +

    /* jellyfish */
    '.geo-jelly{position:absolute;pointer-events:none;opacity:0.55;z-index:2;' +
    'animation:jellyBob 8s ease-in-out infinite;}' +
    '.geo-jelly-2{animation-duration:11s;animation-delay:-4.5s;}' +
    '@keyframes jellyBob{0%,100%{transform:translateY(0) rotate(-4deg);}50%{transform:translateY(-20px) rotate(4deg);}}' +

    /* fish: outer div swims X, inner div bobs Y */
    '.fish-x{position:absolute;pointer-events:none;z-index:2;}' +
    '.fish-x-1{bottom:80px;animation:fishX1 28s linear infinite;}' +
    '.fish-x-2{bottom:110px;animation:fishX2 38s linear infinite;opacity:0.72;}' +
    '.fish-x-3{bottom:55px;animation:fishX3 33s linear infinite;animation-delay:-12s;opacity:0.68;}' +
    '@keyframes fishX1{' +
    '0%{transform:translateX(-80px) scaleX(1);}' +
    '49%{transform:translateX(calc(100vw + 80px)) scaleX(1);}' +
    '50%{transform:translateX(calc(100vw + 80px)) scaleX(-1);}' +
    '99%{transform:translateX(-80px) scaleX(-1);}' +
    '100%{transform:translateX(-80px) scaleX(1);}}' +
    '@keyframes fishX2{' +
    '0%{transform:translateX(calc(100vw + 80px)) scaleX(-1);}' +
    '49%{transform:translateX(-80px) scaleX(-1);}' +
    '50%{transform:translateX(-80px) scaleX(1);}' +
    '99%{transform:translateX(calc(100vw + 80px)) scaleX(1);}' +
    '100%{transform:translateX(calc(100vw + 80px)) scaleX(-1);}}' +
    '@keyframes fishX3{' +
    '0%{transform:translateX(-80px) scaleX(1);}' +
    '49%{transform:translateX(calc(100vw + 80px)) scaleX(1);}' +
    '50%{transform:translateX(calc(100vw + 80px)) scaleX(-1);}' +
    '99%{transform:translateX(-80px) scaleX(-1);}' +
    '100%{transform:translateX(-80px) scaleX(1);}}' +
    '.fish-y{animation:fishY 5s ease-in-out infinite;}' +
    '.fish-y-2{animation:fishY2 7s ease-in-out infinite;}' +
    '.fish-y-3{animation:fishY3 6s ease-in-out infinite;animation-delay:-3s;}' +
    '@keyframes fishY{0%,100%{transform:translateY(0);}50%{transform:translateY(-22px);}}' +
    '@keyframes fishY2{0%,100%{transform:translateY(-10px);}50%{transform:translateY(14px);}}' +
    '@keyframes fishY3{0%,100%{transform:translateY(-5px);}50%{transform:translateY(18px);}}' +

    /* sharks */
    '.sea-shark{position:absolute;pointer-events:none;z-index:2;}' +
    '.sea-shark-1{bottom:90px;animation:sharkX1 45s linear infinite;}' +
    '.sea-shark-2{bottom:140px;animation:sharkX2 58s linear infinite;animation-delay:-22s;opacity:0.78;}' +
    '@keyframes sharkX1{' +
    '0%{transform:translateX(-120px) scaleX(1);}' +
    '49%{transform:translateX(calc(100vw + 120px)) scaleX(1);}' +
    '50%{transform:translateX(calc(100vw + 120px)) scaleX(-1);}' +
    '99%{transform:translateX(-120px) scaleX(-1);}' +
    '100%{transform:translateX(-120px) scaleX(1);}}' +
    '@keyframes sharkX2{' +
    '0%{transform:translateX(calc(100vw + 120px)) scaleX(-1);}' +
    '49%{transform:translateX(-120px) scaleX(-1);}' +
    '50%{transform:translateX(-120px) scaleX(1);}' +
    '99%{transform:translateX(calc(100vw + 120px)) scaleX(1);}' +
    '100%{transform:translateX(calc(100vw + 120px)) scaleX(-1);}}' +
    '.shark-y{animation:sharkY 9s ease-in-out infinite;}' +
    '.shark-y-2{animation:sharkY 12s ease-in-out infinite;animation-delay:-5s;}' +
    '@keyframes sharkY{0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);}}' +

    /* octopi */
    '.sea-octo{position:absolute;pointer-events:none;z-index:2;' +
    'animation:octoFloat 10s ease-in-out infinite;}' +
    '.sea-octo-2{animation-duration:13s;animation-delay:-6s;}' +
    '@keyframes octoFloat{0%,100%{transform:translateY(0) rotate(-3deg);}50%{transform:translateY(-16px) rotate(3deg);}}' +

    /* ocean treasure chest — bottom-right, underwater (z-index 2 = same layer as fish) */
    '.sea-chest-wrap{position:absolute;bottom:42px;right:3.5%;z-index:2;cursor:pointer;width:68px;text-align:center;opacity:0.72;}' +
    '.sea-chest-wrap:hover{opacity:1;}' +
    '.sea-chest-svg{display:block;margin:0 auto;transition:filter 0.2s;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.4));}' +
    '.sea-chest-wrap:hover .sea-chest-svg{filter:drop-shadow(0 0 10px rgba(200,155,40,0.7));}' +
    '.chest-lid-g{transform-origin:34px 30px;transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1);}' +
    '.sea-chest-wrap.open .chest-lid-g{transform:rotateX(-140deg);}' +
    '.chest-map-pop{position:absolute;bottom:105%;left:50%;width:44px;margin-left:-22px;' +
    'transform:scale(0) translateY(8px);opacity:0;cursor:pointer;' +
    'transition:transform 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.28s,opacity 0.3s 0.28s;}' +
    '.sea-chest-wrap.open .chest-map-pop{transform:scale(1) translateY(0);opacity:1;}' +
    '.chest-map-pop:hover{transform:scale(1.12) translateY(-3px) !important;}' +

    /* floating sea links */
    '.sea-link{position:absolute;z-index:6;' +
    'font-family:var(--font-mono);font-size:0.6rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;' +
    'color:rgba(26,61,143,0.75);text-decoration:none;' +
    'border:1px solid rgba(26,61,143,0.32);border-radius:20px;' +
    'padding:0.3rem 0.75rem;background:rgba(180,215,245,0.45);' +
    'transition:background 0.2s,color 0.2s,border-color 0.2s;}' +
    '.sea-link:hover{background:rgba(26,61,143,0.18);color:rgba(26,61,143,1);border-color:rgba(26,61,143,0.6);}' +
    '.sea-link-1{animation:seaFloat1 6s ease-in-out infinite;}' +
    '.sea-link-2{animation:seaFloat2 8s ease-in-out infinite;}' +
    '.sea-link-3{animation:seaFloat3 7s ease-in-out infinite;}' +
    '@keyframes seaFloat1{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-14px) rotate(1.5deg);}}' +
    '@keyframes seaFloat2{0%,100%{transform:translateY(-6px) rotate(1deg);}50%{transform:translateY(10px) rotate(-1.5deg);}}' +
    '@keyframes seaFloat3{0%,100%{transform:translateY(4px) rotate(-2deg);}50%{transform:translateY(-18px) rotate(1deg);}}';

  document.head.appendChild(S);

  /* ═══════════════════════════════════════════════════
     3. MARGIN CREATURES — spread along page, repeat on longer pages
     ═══════════════════════════════════════════════════ */
  document.body.style.position = 'relative';

  var creatureSVGs = [
    /* 0: pelican */
    '<svg width="58" height="34" viewBox="0 0 58 34" fill="none">' +
    '<ellipse cx="30" cy="20" rx="16" ry="8" stroke="rgba(26,61,143,0.68)" stroke-width="1.1" fill="rgba(26,61,143,0.16)"/>' +
    '<ellipse cx="47" cy="15" rx="6" ry="5" stroke="rgba(26,61,143,0.65)" stroke-width="1" fill="rgba(26,61,143,0.14)"/>' +
    '<path d="M51 14 L58 12 L51 16Z" stroke="rgba(26,61,143,0.58)" stroke-width="0.9" fill="rgba(26,61,143,0.1)"/>' +
    '<circle cx="49" cy="13.5" r="1.8" fill="rgba(26,61,143,0.7)"/>' +
    '<circle cx="49.6" cy="13" r="0.7" fill="rgba(220,235,255,0.9)"/>' +
    '<path d="M14 20 L2 14 L0 24Z" stroke="rgba(26,61,143,0.5)" stroke-width="0.9" fill="rgba(26,61,143,0.12)"/>' +
    '<path d="M22 17 Q12 4 2 2 Q14 11 30 17Z" stroke="rgba(26,61,143,0.6)" stroke-width="1" fill="rgba(26,61,143,0.14)" style="transform-origin:22px 17px;animation:pelicanWing 2.5s ease-in-out infinite;"/>' +
    '<path d="M22 21 Q12 30 4 32 Q16 25 30 21Z" stroke="rgba(26,61,143,0.48)" stroke-width="0.9" fill="rgba(26,61,143,0.1)" style="transform-origin:22px 21px;animation:pelicanWing 2.5s ease-in-out infinite;animation-delay:0.1s;"/>' +
    '</svg>',
    /* 1: frog */
    '<svg width="50" height="54" viewBox="0 0 50 54" fill="none">' +
    '<ellipse cx="25" cy="34" rx="13" ry="11" stroke="rgba(28,163,88,0.7)" stroke-width="1.2" fill="rgba(28,163,88,0.18)"/>' +
    '<ellipse cx="25" cy="20" rx="10" ry="8" stroke="rgba(28,163,88,0.7)" stroke-width="1.1" fill="rgba(28,163,88,0.2)"/>' +
    '<circle cx="18" cy="15" r="3.8" stroke="rgba(28,163,88,0.65)" stroke-width="1" fill="rgba(28,163,88,0.14)"/>' +
    '<circle cx="32" cy="15" r="3.8" stroke="rgba(28,163,88,0.65)" stroke-width="1" fill="rgba(28,163,88,0.14)"/>' +
    '<circle cx="18.8" cy="14.3" r="1.6" fill="rgba(26,61,143,0.7)"/>' +
    '<circle cx="32.8" cy="14.3" r="1.6" fill="rgba(26,61,143,0.7)"/>' +
    '<path d="M13 30 Q6 33 2 35" stroke="rgba(28,163,88,0.58)" stroke-width="1.2" fill="none"/>' +
    '<path d="M37 30 Q44 33 48 35" stroke="rgba(28,163,88,0.58)" stroke-width="1.2" fill="none"/>' +
    '<path d="M13 42 Q5 47 1 52" stroke="rgba(28,163,88,0.52)" stroke-width="1.1" fill="none"/>' +
    '<path d="M37 42 Q45 47 49 52" stroke="rgba(28,163,88,0.52)" stroke-width="1.1" fill="none"/>' +
    '<circle cx="1" cy="52" r="2" fill="rgba(28,163,88,0.38)"/>' +
    '<circle cx="49" cy="52" r="2" fill="rgba(28,163,88,0.38)"/>' +
    '</svg>',
    /* 2: snake */
    '<svg width="24" height="80" viewBox="0 0 24 80" fill="none">' +
    '<path d="M12 2 Q18 12 12 22 Q6 32 12 42 Q18 52 12 62 Q6 72 10 78" stroke="rgba(26,61,143,0.65)" stroke-width="5" stroke-linecap="round" fill="none"/>' +
    '<path d="M12 2 Q18 12 12 22 Q6 32 12 42 Q18 52 12 62 Q6 72 10 78" stroke="rgba(148,196,238,0.3)" stroke-width="2.5" stroke-linecap="round" fill="none"/>' +
    '<ellipse cx="12" cy="5" rx="6" ry="4" stroke="rgba(26,61,143,0.7)" stroke-width="1.1" fill="rgba(26,61,143,0.2)"/>' +
    '<circle cx="9.5" cy="4" r="1.5" fill="rgba(26,61,143,0.8)"/>' +
    '<circle cx="14.5" cy="4" r="1.5" fill="rgba(26,61,143,0.8)"/>' +
    '<circle cx="9.9" cy="3.6" r="0.6" fill="rgba(220,235,255,0.9)"/>' +
    '<circle cx="14.9" cy="3.6" r="0.6" fill="rgba(220,235,255,0.9)"/>' +
    '<path d="M12 8 L11 11 M12 8 L13 11" stroke="rgba(210,50,50,0.7)" stroke-width="0.8" fill="none"/>' +
    '</svg>'
  ];
  var creatureAnims = [
    'pelicanGlide 8s ease-in-out infinite',
    'frogHop 14s ease-in-out infinite',
    'snakeSlither 5s ease-in-out infinite'
  ];

  function placeCreatures() {
    var footerEl = document.querySelector('.site-footer');
    var pageH   = document.body.scrollHeight;
    var stopAt  = footerEl ? (pageH - footerEl.offsetHeight - 320) : (pageH - 320);
    /* on hero pages, start below the full-height hero section */
    var heroEl  = document.querySelector('.hero');
    var startAt = heroEl ? (heroEl.offsetTop + heroEl.offsetHeight + 80) : 340;
    var spacing = 420;
    var idx = 0;
    for (var top = startAt; top <= stopAt; top += spacing) {
      var side = (idx % 2 === 0) ? 'right' : 'left';
      var type = idx % 3;
      var el = document.createElement('div');
      el.className = 'mgn-creature';
      el.setAttribute('aria-hidden', 'true');
      el.style.cssText = side + ':8px;top:' + top + 'px;animation:' + creatureAnims[type] + ';animation-delay:-' + (idx * 1.7) + 's;';
      el.innerHTML = creatureSVGs[type];
      document.body.appendChild(el);
      idx++;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', placeCreatures);
  } else {
    placeCreatures();
  }

  /* ═══════════════════════════════════════════════════
     4. UNDERWATER FOOTER (all pages)
     ═══════════════════════════════════════════════════ */
  var footer = document.querySelector('.site-footer');
  if (!footer) return;

  footer.classList.add('sea-zone');
  footer.style.position = 'relative';

  /* Wave: 300% wide SVG covers full sea-zone height — wave path IS the top boundary */
  var wBase = 'rgba(148,196,238,0.62)';
  var waveSVG =
    '<svg class="sea-wave" viewBox="0 0 1800 280" preserveAspectRatio="none" fill="none" aria-hidden="true">' +
    '<path d="M0 30 C100 10 200 50 300 30 C400 10 500 50 600 30 ' +
              'C700 10 800 50 900 30 C1000 10 1100 50 1200 30 ' +
              'C1300 10 1400 50 1500 30 C1600 10 1700 50 1800 30 ' +
              'L1800 280 L0 280 Z" fill="' + wBase + '"/>' +
    '<path d="M0 38 C200 18 400 58 600 38 C800 18 1000 58 1200 38 C1400 18 1600 58 1800 38 ' +
              'L1800 280 L0 280 Z" fill="' + wBase + '"/>' +
    '</svg>';

  /* Jellyfish */
  var jelly1 =
    '<div class="geo-jelly" style="left:20%;bottom:50px;" aria-hidden="true">' +
    '<svg width="38" height="52" viewBox="0 0 38 52" fill="none">' +
    '<ellipse cx="19" cy="17" rx="15" ry="13" stroke="rgba(26,61,143,0.65)" stroke-width="1.2" fill="rgba(148,196,238,0.32)"/>' +
    '<ellipse cx="19" cy="14" rx="8" ry="6" stroke="rgba(200,225,255,0.5)" stroke-width="0.7" fill="none"/>' +
    '<path d="M11 28 Q9 38 7 48" stroke="rgba(26,61,143,0.4)" stroke-width="0.8" fill="none"/>' +
    '<path d="M15 29 Q14 39 12 50" stroke="rgba(26,61,143,0.32)" stroke-width="0.7" fill="none"/>' +
    '<path d="M19 30 Q19 40 19 50" stroke="rgba(28,163,88,0.4)" stroke-width="0.8" fill="none"/>' +
    '<path d="M23 29 Q24 39 26 50" stroke="rgba(26,61,143,0.32)" stroke-width="0.7" fill="none"/>' +
    '<path d="M27 28 Q29 38 31 48" stroke="rgba(26,61,143,0.4)" stroke-width="0.8" fill="none"/>' +
    '</svg></div>';

  var jelly2 =
    '<div class="geo-jelly geo-jelly-2" style="left:60%;bottom:40px;" aria-hidden="true">' +
    '<svg width="50" height="65" viewBox="0 0 50 65" fill="none">' +
    '<ellipse cx="25" cy="21" rx="20" ry="17" stroke="rgba(28,163,88,0.62)" stroke-width="1.3" fill="rgba(148,196,238,0.24)"/>' +
    '<ellipse cx="25" cy="17" rx="10" ry="8" stroke="rgba(180,230,180,0.45)" stroke-width="0.8" fill="none"/>' +
    '<path d="M13 36 Q10 48 8 60" stroke="rgba(28,163,88,0.35)" stroke-width="0.9" fill="none"/>' +
    '<path d="M18 37 Q17 49 15 62" stroke="rgba(26,61,143,0.28)" stroke-width="0.8" fill="none"/>' +
    '<path d="M25 38 Q25 50 25 63" stroke="rgba(26,61,143,0.38)" stroke-width="0.9" fill="none"/>' +
    '<path d="M32 37 Q33 49 35 62" stroke="rgba(26,61,143,0.28)" stroke-width="0.8" fill="none"/>' +
    '<path d="M37 36 Q40 48 42 60" stroke="rgba(28,163,88,0.35)" stroke-width="0.9" fill="none"/>' +
    '</svg></div>';

  /* Fish: outer = X swim, inner = Y bob */
  var fishSVG1 =
    '<svg width="54" height="26" viewBox="0 0 54 26" fill="none">' +
    '<polygon points="10,13 30,4 46,13 30,22" stroke="rgba(26,61,143,0.78)" stroke-width="1.1" fill="rgba(148,196,238,0.5)"/>' +
    '<polygon points="10,13 0,5 2,13 0,21" stroke="rgba(26,61,143,0.62)" stroke-width="0.9" fill="rgba(26,61,143,0.2)"/>' +
    '<polygon points="22,8 28,4 30,10" stroke="rgba(26,61,143,0.48)" stroke-width="0.7" fill="rgba(26,61,143,0.12)"/>' +
    '<circle cx="38" cy="13" r="2.5" fill="rgba(26,61,143,0.6)"/>' +
    '<circle cx="38.8" cy="12.3" r="0.9" fill="rgba(240,248,255,0.95)"/>' +
    '</svg>';

  var fishSVG2 =
    '<svg width="40" height="20" viewBox="0 0 54 26" fill="none">' +
    '<polygon points="10,13 30,4 46,13 30,22" stroke="rgba(28,163,88,0.78)" stroke-width="1.1" fill="rgba(28,163,88,0.22)"/>' +
    '<polygon points="10,13 0,5 2,13 0,21" stroke="rgba(28,163,88,0.62)" stroke-width="0.9" fill="rgba(28,163,88,0.18)"/>' +
    '<polygon points="22,8 28,4 30,10" stroke="rgba(28,163,88,0.48)" stroke-width="0.7" fill="rgba(28,163,88,0.12)"/>' +
    '<circle cx="38" cy="13" r="2.5" fill="rgba(28,163,88,0.62)"/>' +
    '<circle cx="38.8" cy="12.3" r="0.9" fill="rgba(240,255,245,0.95)"/>' +
    '</svg>';

  /* salmon fish */
  var fishSVG3 =
    '<svg width="46" height="22" viewBox="0 0 54 26" fill="none">' +
    '<polygon points="10,13 30,4 46,13 30,22" stroke="rgba(210,100,80,0.72)" stroke-width="1.1" fill="rgba(240,140,110,0.28)"/>' +
    '<polygon points="10,13 0,5 2,13 0,21" stroke="rgba(210,100,80,0.58)" stroke-width="0.9" fill="rgba(210,100,80,0.18)"/>' +
    '<polygon points="22,8 28,4 30,10" stroke="rgba(210,100,80,0.44)" stroke-width="0.7" fill="rgba(210,100,80,0.12)"/>' +
    '<circle cx="38" cy="13" r="2.5" fill="rgba(210,100,80,0.6)"/>' +
    '<circle cx="38.8" cy="12.3" r="0.9" fill="rgba(255,240,235,0.95)"/>' +
    '</svg>';

  var fish1 = '<div class="fish-x fish-x-1" aria-hidden="true"><div class="fish-y">' + fishSVG1 + '</div></div>';
  var fish2 = '<div class="fish-x fish-x-2" aria-hidden="true"><div class="fish-y fish-y-2">' + fishSVG2 + '</div></div>';
  var fish3 = '<div class="fish-x fish-x-3" aria-hidden="true"><div class="fish-y fish-y-3">' + fishSVG3 + '</div></div>';

  /* Sharks */
  var sharkSVG =
    '<svg width="110" height="50" viewBox="0 0 110 50" fill="none">' +
    /* body */
    '<path d="M8 30 Q30 18 70 26 Q90 28 102 30 Q90 34 70 34 Q30 38 8 30Z"' +
    ' stroke="rgba(26,61,143,0.65)" stroke-width="1.1" fill="rgba(26,61,143,0.22)"/>' +
    /* dorsal fin */
    '<path d="M48 26 L55 8 L65 26Z"' +
    ' stroke="rgba(26,61,143,0.6)" stroke-width="1" fill="rgba(26,61,143,0.18)"/>' +
    /* tail */
    '<path d="M8 30 L0 18 L0 42Z"' +
    ' stroke="rgba(26,61,143,0.55)" stroke-width="1" fill="rgba(26,61,143,0.16)"/>' +
    /* pectoral fin */
    '<path d="M60 30 L72 42 L80 30Z"' +
    ' stroke="rgba(26,61,143,0.45)" stroke-width="0.9" fill="rgba(26,61,143,0.12)"/>' +
    /* eye */
    '<circle cx="90" cy="29" r="2.2" fill="rgba(26,61,143,0.7)"/>' +
    '<circle cx="90.8" cy="28.3" r="0.8" fill="rgba(220,235,255,0.9)"/>' +
    /* gills */
    '<path d="M76 25 Q75 30 76 35" stroke="rgba(26,61,143,0.35)" stroke-width="0.8" fill="none"/>' +
    '<path d="M80 24 Q79 30 80 36" stroke="rgba(26,61,143,0.3)" stroke-width="0.8" fill="none"/>' +
    '</svg>';

  var shark1 = '<div class="sea-shark sea-shark-1" aria-hidden="true"><div class="shark-y">' + sharkSVG + '</div></div>';
  var shark2 = '<div class="sea-shark sea-shark-2" aria-hidden="true"><div class="shark-y shark-y-2">' + sharkSVG + '</div></div>';

  /* Octopi */
  function makeOcto(sc, sc2) {
    return '<svg width="52" height="64" viewBox="0 0 52 64" fill="none">' +
      /* mantle */
      '<ellipse cx="26" cy="20" rx="17" ry="15"' +
      ' stroke="' + sc + '" stroke-width="1.2" fill="rgba(26,61,143,0.14)"/>' +
      '<ellipse cx="26" cy="16" rx="9" ry="7"' +
      ' stroke="rgba(200,220,255,0.4)" stroke-width="0.7" fill="none"/>' +
      /* eyes */
      '<circle cx="20" cy="18" r="3" stroke="' + sc + '" stroke-width="1" fill="rgba(26,61,143,0.1)"/>' +
      '<circle cx="32" cy="18" r="3" stroke="' + sc + '" stroke-width="1" fill="rgba(26,61,143,0.1)"/>' +
      '<circle cx="20.8" cy="17.3" r="1.1" fill="' + sc2 + '"/>' +
      '<circle cx="32.8" cy="17.3" r="1.1" fill="' + sc2 + '"/>' +
      /* 8 arms */
      '<path d="M12 30 Q7 40 10 52 Q11 58 8 63" stroke="' + sc + '" stroke-width="1.1" fill="none"/>' +
      '<path d="M16 33 Q12 43 14 53 Q15 59 12 64" stroke="' + sc + '" stroke-width="1.1" fill="none"/>' +
      '<path d="M20 35 Q18 45 20 55 Q21 61 19 64" stroke="' + sc + '" stroke-width="1.1" fill="none"/>' +
      '<path d="M26 36 Q26 46 26 56 Q26 62 24 64" stroke="' + sc + '" stroke-width="1.1" fill="none"/>' +
      '<path d="M32 35 Q34 45 32 55 Q31 61 33 64" stroke="' + sc + '" stroke-width="1.1" fill="none"/>' +
      '<path d="M36 33 Q40 43 38 53 Q37 59 40 64" stroke="' + sc + '" stroke-width="1.1" fill="none"/>' +
      '<path d="M40 30 Q45 40 42 52 Q41 58 44 63" stroke="' + sc + '" stroke-width="1.1" fill="none"/>' +
      '<path d="M43 27 Q50 36 47 48 Q46 55 50 60" stroke="' + sc + '" stroke-width="1" fill="none"/>' +
      '</svg>';
  }

  var octo1 = '<div class="sea-octo" style="left:15%;bottom:35px;opacity:0.6;" aria-hidden="true">' +
    makeOcto('rgba(26,61,143,0.62)', 'rgba(26,61,143,0.75)') + '</div>';
  var octo2 = '<div class="sea-octo sea-octo-2" style="right:18%;bottom:25px;opacity:0.52;" aria-hidden="true">' +
    makeOcto('rgba(28,163,88,0.58)', 'rgba(28,163,88,0.8)') + '</div>';

  /* Floating links in ocean */
  var linkORCID =
    '<a class="sea-link sea-link-1" href="https://orcid.org/0009-0005-9580-2712" ' +
    'target="_blank" rel="noopener" style="left:38%;bottom:130px;">ORCID ↗</a>';
  var linkLinkedIn =
    '<a class="sea-link sea-link-2" href="https://www.linkedin.com/in/ezriabraham/" ' +
    'target="_blank" rel="noopener" style="left:52%;bottom:95px;">LinkedIn ↗</a>';
  var linkEmail =
    '<a class="sea-link sea-link-3" href="mailto:ezribabraham@gmail.com" ' +
    'style="left:44%;bottom:160px;">Email ↗</a>';

  var scrollSVG =
    '<svg width="44" height="54" viewBox="0 0 44 54" fill="none">' +
    '<rect x="4" y="8" width="36" height="38" rx="1" fill="#c9a84c" stroke="rgba(120,80,10,0.6)" stroke-width="1"/>' +
    '<ellipse cx="22" cy="8" rx="18" ry="6" fill="#e8cc78"/>' +
    '<ellipse cx="22" cy="8" rx="13" ry="4" fill="#c9a84c"/>' +
    '<ellipse cx="22" cy="46" rx="18" ry="6" fill="#e8cc78"/>' +
    '<ellipse cx="22" cy="46" rx="13" ry="4" fill="#c9a84c"/>' +
    '<path d="M10 22 Q16 18 22 22 Q26 20 30 22" stroke="rgba(100,60,10,0.5)" stroke-width="1.2" fill="none"/>' +
    '<path d="M10 28 Q14 26 18 28 Q21 27 24 28" stroke="rgba(100,60,10,0.45)" stroke-width="1" fill="none"/>' +
    '<path d="M26 25 Q29 24 33 26" stroke="rgba(100,60,10,0.4)" stroke-width="1" fill="none"/>' +
    '<circle cx="28" cy="33" r="3" fill="rgba(180,40,20,0.7)"/>' +
    '<line x1="26" y1="31" x2="30" y2="35" stroke="rgba(255,200,150,0.9)" stroke-width="1.2"/>' +
    '<line x1="30" y1="31" x2="26" y2="35" stroke="rgba(255,200,150,0.9)" stroke-width="1.2"/>' +
    '</svg>';

  var chestBodySVG =
    '<svg class="sea-chest-svg" width="68" height="58" viewBox="0 0 68 58" fill="none">' +
    '<rect x="4" y="28" width="60" height="28" rx="3" fill="#5a2d0c" stroke="#c8922a" stroke-width="1.5"/>' +
    '<rect x="4" y="38" width="60" height="4" fill="rgba(200,146,42,0.5)"/>' +
    '<rect x="27" y="34" width="14" height="12" rx="2" fill="rgba(200,146,42,0.8)"/>' +
    '<circle cx="34" cy="39" r="3" stroke="#3a1800" stroke-width="1.5" fill="rgba(200,146,42,0.3)"/>' +
    '<circle cx="10" cy="32" r="2.5" fill="rgba(200,146,42,0.8)"/>' +
    '<circle cx="58" cy="32" r="2.5" fill="rgba(200,146,42,0.8)"/>' +
    '<circle cx="10" cy="52" r="2.5" fill="rgba(200,146,42,0.8)"/>' +
    '<circle cx="58" cy="52" r="2.5" fill="rgba(200,146,42,0.8)"/>' +
    '<g class="chest-lid-g">' +
    '<path d="M4 28 C4 14 64 14 64 28 L64 30 L4 30 Z" fill="#7a3d1a" stroke="#c8922a" stroke-width="1.5"/>' +
    '<path d="M6 27 C6 16 62 16 62 27" fill="none" stroke="rgba(220,170,70,0.3)" stroke-width="1.2"/>' +
    '</g>' +
    '</svg>';

  var chestHtml =
    '<div class="sea-chest-wrap" id="seaChest">' +
    '<div class="chest-map-pop" id="chestMapPop" role="button" tabindex="0" aria-label="Open adventure map">' +
    scrollSVG + '</div>' +
    '<div style="perspective:200px;display:inline-block;">' + chestBodySVG + '</div>' +
    '</div>';

  var innerText = footer.innerHTML;
  footer.innerHTML =
    waveSVG + jelly1 + jelly2 + fish1 + fish2 + fish3 + shark1 + shark2 + octo1 + octo2 +
    linkORCID + linkLinkedIn + linkEmail + chestHtml +
    '<div style="position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);' +
    'z-index:6;font-family:var(--font-mono);font-size:0.62rem;letter-spacing:0.14em;' +
    'color:rgba(26,61,143,0.55);white-space:nowrap;">' + innerText + '</div>';

  /* ═══════════════════════════════════════════════════
     5. OCEAN CHEST — click to open, map pops out → navigate
     ═══════════════════════════════════════════════════ */
  (function () {
    var parts = location.pathname.split('/');
    var parentDir = parts[parts.length - 2];
    var inSubdir = ['photos', 'art', 'music'].indexOf(parentDir) !== -1;
    var mapHref = (inSubdir ? '../' : '') + 'map.html';

    if (location.pathname.indexOf('map.html') !== -1) return;

    var chestEl  = document.getElementById('seaChest');
    var mapPopEl = document.getElementById('chestMapPop');
    if (!chestEl || !mapPopEl) return;

    chestEl.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!chestEl.classList.contains('open')) chestEl.classList.add('open');
    });

    document.addEventListener('click', function (e) {
      if (chestEl.classList.contains('open') && !chestEl.contains(e.target)) {
        chestEl.classList.remove('open');
      }
    });

    function goToMap() {
      var rect = mapPopEl.getBoundingClientRect();
      var cx   = rect.left + rect.width  / 2;
      var cy   = rect.top  + rect.height / 2;
      var size = Math.ceil(Math.sqrt(
        window.innerWidth  * window.innerWidth +
        window.innerHeight * window.innerHeight) * 2.5);
      var ov = document.createElement('div');
      ov.style.cssText =
        'position:fixed;border-radius:50%;background:#c9a84c;z-index:9999;pointer-events:all;' +
        'width:0;height:0;top:' + cy + 'px;left:' + cx + 'px;transform:translate(-50%,-50%);' +
        'transition:width 0.75s cubic-bezier(0.55,0,0.45,1),height 0.75s cubic-bezier(0.55,0,0.45,1);';
      document.body.appendChild(ov);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          ov.style.width  = size + 'px';
          ov.style.height = size + 'px';
        });
      });
      setTimeout(function () { window.location.href = mapHref; }, 750);
    }

    mapPopEl.addEventListener('click',   function (e) { e.stopPropagation(); goToMap(); });
    mapPopEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToMap(); }
    });
  })();

})();
