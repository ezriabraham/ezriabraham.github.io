/* geoanim.js — living nature+science+geometric world */
(function () {
  'use strict';

  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isHero   = !!document.querySelector('.hero'); /* home page has hero canvas already */

  /* ═══════════════════════════════════════════════════
     1. BACKGROUND PARTICLE CANVAS (all pages)
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
    this.r  = Math.random() * 3 + 2;
    this.c  = Math.random() > 0.5 ? '26,61,143' : '28,163,88';
    this.hex = Math.random() > 0.38;
    this.ph = Math.random() * Math.PI * 2;
    this.ps = 0.004 + Math.random() * 0.007;
  }
  Pt.prototype.tick = function () {
    this.x += this.vx; this.y += this.vy; this.ph += this.ps;
    if (this.x < -80) this.x = W + 80; if (this.x > W + 80) this.x = -80;
    if (this.y < -80) this.y = H + 80; if (this.y > H + 80) this.y = -80;
  };
  function hexPath(x, y, r) {
    bx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = i * Math.PI / 3 - Math.PI / 6;
      i ? bx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
        : bx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    bx.closePath();
  }
  var MAXD = 200;
  var pts  = Array.from({ length: 40 }, function () { return new Pt(); });

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
      var a = 0.05 + 0.022 * Math.sin(p.ph);
      bx.strokeStyle = 'rgba(' + p.c + ',' + a + ')';
      bx.fillStyle   = 'rgba(' + p.c + ',' + (a * 0.2) + ')';
      bx.lineWidth = 0.6;
      if (p.hex) { hexPath(p.x, p.y, p.r * 2.8); }
      else       { bx.beginPath(); bx.arc(p.x, p.y, p.r, 0, Math.PI * 2); }
      bx.fill(); bx.stroke();
    });
    requestAnimationFrame(bgFrame);
  }
  requestAnimationFrame(bgFrame);

  if (noMotion) return;

  /* ═══════════════════════════════════════════════════
     2. CSS (injected once)
     ═══════════════════════════════════════════════════ */
  var S = document.createElement('style');
  S.textContent =
    /* ── Corner hex rosettes: breathe (scale + slight rotate) ── */
    '.geo-tr{position:fixed;right:-24px;top:-24px;pointer-events:none;z-index:1;opacity:0.32;' +
    'animation:geoBreathe 5s ease-in-out infinite;}' +
    '@keyframes geoBreathe{0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.18) rotate(14deg);}}' +

    '.geo-bl{position:fixed;left:-24px;bottom:-24px;pointer-events:none;z-index:1;opacity:0.32;' +
    'animation:geoBreathe2 6.5s ease-in-out infinite;}' +
    '@keyframes geoBreathe2{0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.22) rotate(-16deg);}}' +

    /* ── Geometric birds: float irregularly + wing flap ── */
    '.geo-bird{position:fixed;pointer-events:none;z-index:1;opacity:0.32;}' +
    '.geo-bird-1{top:14vh;left:12vw;animation:bFloat1 7s ease-in-out infinite;}' +
    '.geo-bird-2{top:20vh;right:16vw;animation:bFloat2 9s ease-in-out infinite;}' +
    '@keyframes bFloat1{' +
    '0%{transform:translate(0,0) rotate(-3deg);}' +
    '25%{transform:translate(18px,-28px) rotate(4deg);}' +
    '55%{transform:translate(-12px,-18px) rotate(-2deg);}' +
    '78%{transform:translate(22px,-38px) rotate(5deg);}' +
    '100%{transform:translate(0,0) rotate(-3deg);}}' +
    '@keyframes bFloat2{' +
    '0%{transform:translate(0,0) rotate(2deg);}' +
    '30%{transform:translate(-20px,-22px) rotate(-4deg);}' +
    '60%{transform:translate(14px,-36px) rotate(3deg);}' +
    '85%{transform:translate(-8px,-14px) rotate(-1deg);}' +
    '100%{transform:translate(0,0) rotate(2deg);}}' +
    /* wing flap on the SVG element inside the bird div */
    '.geo-bird svg{animation:wFlap 0.65s ease-in-out infinite;}' +
    '.geo-bird-2 svg{animation:wFlap 0.82s ease-in-out infinite;}' +
    '@keyframes wFlap{0%,100%{transform:scaleY(1);}50%{transform:scaleY(0.62);}}' +

    /* ── Underwater footer ── */
    '.sea-zone{position:relative;overflow:hidden;background:rgba(148,196,238,0.58);}' +
    '.sea-wave{position:absolute;top:0;left:0;width:300%;height:50px;pointer-events:none;' +
    'animation:waveSurf 7s linear infinite;}' +
    /* 300% wide SVG, seamless tile every 1/3 → one period per screen width */
    '@keyframes waveSurf{from{transform:translateX(0);}to{transform:translateX(-33.333%);}}' +
    '.geo-jelly{position:absolute;pointer-events:none;opacity:0.5;animation:jellyBob 8s ease-in-out infinite;}' +
    '.geo-jelly-2{animation-duration:11s;animation-delay:-4s;}' +
    '@keyframes jellyBob{0%,100%{transform:translateY(0) rotate(-4deg);}50%{transform:translateY(-20px) rotate(4deg);}}' +
    '.geo-fish{position:absolute;pointer-events:none;opacity:0.42;animation:fishSwim 15s linear infinite;}' +
    '.geo-fish-2{animation-duration:21s;animation-delay:-8s;}' +
    '@keyframes fishSwim{' +
    '0%{transform:translateX(-80px) scaleX(1);}' +
    '49%{transform:translateX(calc(100vw + 80px)) scaleX(1);}' +
    '50%{transform:translateX(calc(100vw + 80px)) scaleX(-1);}' +
    '99%{transform:translateX(-80px) scaleX(-1);}' +
    '100%{transform:translateX(-80px) scaleX(1);}}' +

    '@media(max-width:640px){.geo-tr,.geo-bl,.geo-bird{display:none;}}';

  document.head.appendChild(S);

  /* ═══════════════════════════════════════════════════
     3. CORNER + BIRD ORNAMENTS — skip on hero/home page
     ═══════════════════════════════════════════════════ */
  if (!isHero) {

    /* Top-right: breathing multi-ring hex rosette */
    var trDiv = document.createElement('div');
    trDiv.className = 'geo-tr'; trDiv.setAttribute('aria-hidden', 'true');
    trDiv.innerHTML =
      '<svg width="210" height="210" viewBox="0 0 210 210" fill="none">' +
      '<polygon points="105,5 178,44 178,126 105,165 32,126 32,44" stroke="rgba(26,61,143,0.72)" stroke-width="1.3" fill="rgba(26,61,143,0.05)"/>' +
      '<polygon points="105,22 161,55 161,121 105,154 49,121 49,55" stroke="rgba(28,163,88,0.62)" stroke-width="1" fill="rgba(28,163,88,0.04)"/>' +
      '<polygon points="105,39 144,66 144,116 105,143 66,116 66,66" stroke="rgba(26,61,143,0.50)" stroke-width="0.9"/>' +
      '<polygon points="105,56 127,69 127,113 105,126 83,113 83,69" stroke="rgba(28,163,88,0.40)" stroke-width="0.8"/>' +
      '<circle cx="105" cy="98" r="6" fill="rgba(28,163,88,0.45)" stroke="none"/>' +
      '<circle cx="105" cy="98" r="12" stroke="rgba(26,61,143,0.28)" stroke-width="0.9" fill="none"/>' +
      '</svg>';
    document.body.appendChild(trDiv);

    /* Bottom-left: breathing green hex rosette */
    var blDiv = document.createElement('div');
    blDiv.className = 'geo-bl'; blDiv.setAttribute('aria-hidden', 'true');
    blDiv.innerHTML =
      '<svg width="190" height="190" viewBox="0 0 190 190" fill="none">' +
      '<polygon points="95,5 162,43 162,119 95,157 28,119 28,43" stroke="rgba(28,163,88,0.72)" stroke-width="1.3" fill="rgba(28,163,88,0.05)"/>' +
      '<polygon points="95,22 148,53 148,115 95,146 42,115 42,53" stroke="rgba(26,61,143,0.60)" stroke-width="1" fill="rgba(26,61,143,0.04)"/>' +
      '<polygon points="95,39 131,61 131,111 95,133 59,111 59,61" stroke="rgba(28,163,88,0.48)" stroke-width="0.9"/>' +
      '<polygon points="95,56 114,67 114,105 95,116 76,105 76,67" stroke="rgba(26,61,143,0.36)" stroke-width="0.8"/>' +
      '<circle cx="95" cy="95" r="6" fill="rgba(26,61,143,0.45)" stroke="none"/>' +
      '</svg>';
    document.body.appendChild(blDiv);

    /* Bird 1 — navy */
    var b1 = document.createElement('div');
    b1.className = 'geo-bird geo-bird-1'; b1.setAttribute('aria-hidden', 'true');
    b1.innerHTML =
      '<svg width="62" height="30" viewBox="0 0 62 30" fill="none">' +
      '<polygon points="20,15 2,6 14,17" stroke="rgba(26,61,143,0.88)" stroke-width="1" fill="rgba(26,61,143,0.22)"/>' +
      '<polygon points="42,15 60,6 48,17" stroke="rgba(26,61,143,0.88)" stroke-width="1" fill="rgba(26,61,143,0.22)"/>' +
      '<polygon points="31,9 40,15 31,21 22,15" stroke="rgba(26,61,143,0.95)" stroke-width="1.2" fill="rgba(28,163,88,0.28)"/>' +
      '<polygon points="22,15 12,20 20,22" stroke="rgba(26,61,143,0.6)" stroke-width="0.7" fill="rgba(26,61,143,0.14)"/>' +
      '</svg>';
    document.body.appendChild(b1);

    /* Bird 2 — green, slightly smaller */
    var b2 = document.createElement('div');
    b2.className = 'geo-bird geo-bird-2'; b2.setAttribute('aria-hidden', 'true');
    b2.innerHTML =
      '<svg width="48" height="24" viewBox="0 0 62 30" fill="none">' +
      '<polygon points="20,15 2,6 14,17" stroke="rgba(28,163,88,0.88)" stroke-width="1" fill="rgba(28,163,88,0.22)"/>' +
      '<polygon points="42,15 60,6 48,17" stroke="rgba(28,163,88,0.88)" stroke-width="1" fill="rgba(28,163,88,0.22)"/>' +
      '<polygon points="31,9 40,15 31,21 22,15" stroke="rgba(28,163,88,0.95)" stroke-width="1.2" fill="rgba(26,61,143,0.22)"/>' +
      '<polygon points="22,15 12,20 20,22" stroke="rgba(28,163,88,0.6)" stroke-width="0.7" fill="rgba(28,163,88,0.14)"/>' +
      '</svg>';
    document.body.appendChild(b2);
  }

  /* ═══════════════════════════════════════════════════
     4. UNDERWATER FOOTER (all pages)
     ═══════════════════════════════════════════════════ */
  var footer = document.querySelector('.site-footer');
  if (!footer) return;

  footer.classList.add('sea-zone');
  footer.style.position = 'relative';

  /* Seamless wave: period = exactly 1/3 of SVG width
     SVG is 300% wide → one period per viewport width → translate -33.33% is seamless */
  var waveBlue = 'rgba(148,196,238,0.55)';
  var waveLight = 'rgba(170,212,248,0.38)';
  var waveSVG =
    '<svg class="sea-wave" viewBox="0 0 1800 50" preserveAspectRatio="none" fill="none" aria-hidden="true">' +
    /* each period is 600 units: starts and ends at y=25 */
    '<path d="M0 25 C100 8 200 42 300 25 C400 8 500 42 600 25 ' +
              'C700 8 800 42 900 25 C1000 8 1100 42 1200 25 ' +
              'C1300 8 1400 42 1500 25 C1600 8 1700 42 1800 25 ' +
              'L1800 50 L0 50 Z" fill="' + waveBlue + '"/>' +
    '<path d="M0 30 C80 16 160 44 240 30 C320 16 400 44 480 30 ' +
              'C560 16 640 44 720 30 C800 16 880 44 960 30 ' +
              'C1040 16 1120 44 1200 30 C1280 16 1360 44 1440 30 ' +
              'C1520 16 1600 44 1680 30 C1760 16 1800 30 1800 30 ' +
              'L1800 50 L0 50 Z" fill="' + waveLight + '"/>' +
    '</svg>';

  var jelly1 =
    '<div class="geo-jelly" style="left:18%;bottom:28px;">' +
    '<svg width="38" height="52" viewBox="0 0 38 52" fill="none">' +
    '<ellipse cx="19" cy="17" rx="15" ry="13" stroke="rgba(26,61,143,0.7)" stroke-width="1.2" fill="rgba(148,196,238,0.35)"/>' +
    '<ellipse cx="19" cy="14" rx="8" ry="6" stroke="rgba(200,225,255,0.55)" stroke-width="0.7" fill="none"/>' +
    '<path d="M11 28 Q9 38 7 48" stroke="rgba(26,61,143,0.42)" stroke-width="0.8" fill="none"/>' +
    '<path d="M15 29 Q14 39 12 50" stroke="rgba(26,61,143,0.35)" stroke-width="0.7" fill="none"/>' +
    '<path d="M19 30 Q19 40 19 50" stroke="rgba(28,163,88,0.42)" stroke-width="0.8" fill="none"/>' +
    '<path d="M23 29 Q24 39 26 50" stroke="rgba(26,61,143,0.35)" stroke-width="0.7" fill="none"/>' +
    '<path d="M27 28 Q29 38 31 48" stroke="rgba(26,61,143,0.42)" stroke-width="0.8" fill="none"/>' +
    '</svg></div>';

  var jelly2 =
    '<div class="geo-jelly geo-jelly-2" style="left:58%;bottom:18px;">' +
    '<svg width="50" height="65" viewBox="0 0 50 65" fill="none">' +
    '<ellipse cx="25" cy="21" rx="20" ry="17" stroke="rgba(28,163,88,0.68)" stroke-width="1.3" fill="rgba(148,196,238,0.28)"/>' +
    '<ellipse cx="25" cy="17" rx="10" ry="8" stroke="rgba(180,230,180,0.5)" stroke-width="0.8" fill="none"/>' +
    '<path d="M13 36 Q10 48 8 60" stroke="rgba(28,163,88,0.38)" stroke-width="0.9" fill="none"/>' +
    '<path d="M18 37 Q17 49 15 62" stroke="rgba(26,61,143,0.32)" stroke-width="0.8" fill="none"/>' +
    '<path d="M25 38 Q25 50 25 63" stroke="rgba(26,61,143,0.42)" stroke-width="0.9" fill="none"/>' +
    '<path d="M32 37 Q33 49 35 62" stroke="rgba(26,61,143,0.32)" stroke-width="0.8" fill="none"/>' +
    '<path d="M37 36 Q40 48 42 60" stroke="rgba(28,163,88,0.38)" stroke-width="0.9" fill="none"/>' +
    '</svg></div>';

  var fish1 =
    '<div class="geo-fish" style="bottom:50px;left:0;">' +
    '<svg width="54" height="26" viewBox="0 0 54 26" fill="none">' +
    '<polygon points="10,13 30,4 46,13 30,22" stroke="rgba(26,61,143,0.82)" stroke-width="1.1" fill="rgba(148,196,238,0.45)"/>' +
    '<polygon points="10,13 0,5 2,13 0,21" stroke="rgba(26,61,143,0.65)" stroke-width="0.9" fill="rgba(26,61,143,0.22)"/>' +
    '<polygon points="22,8 28,4 30,10" stroke="rgba(26,61,143,0.5)" stroke-width="0.7" fill="rgba(26,61,143,0.14)"/>' +
    '<circle cx="38" cy="13" r="2.5" fill="rgba(26,61,143,0.62)"/>' +
    '<circle cx="38.8" cy="12.3" r="0.9" fill="rgba(240,248,255,0.95)"/>' +
    '</svg></div>';

  var fish2 =
    '<div class="geo-fish geo-fish-2" style="bottom:68px;left:0;opacity:0.3;">' +
    '<svg width="40" height="20" viewBox="0 0 54 26" fill="none">' +
    '<polygon points="10,13 30,4 46,13 30,22" stroke="rgba(28,163,88,0.82)" stroke-width="1.1" fill="rgba(28,163,88,0.2)"/>' +
    '<polygon points="10,13 0,5 2,13 0,21" stroke="rgba(28,163,88,0.65)" stroke-width="0.9" fill="rgba(28,163,88,0.18)"/>' +
    '<circle cx="38" cy="13" r="2.5" fill="rgba(28,163,88,0.65)"/>' +
    '</svg></div>';

  var coral1 =
    '<div style="position:absolute;right:9%;bottom:0;pointer-events:none;opacity:0.46;">' +
    '<svg width="58" height="78" viewBox="0 0 58 78" fill="none">' +
    '<path d="M29 78 L29 48 L29 28" stroke="rgba(26,61,143,0.72)" stroke-width="1.8" stroke-linecap="round" fill="none"/>' +
    '<path d="M29 62 L17 47 L10 32" stroke="rgba(26,61,143,0.6)" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
    '<path d="M29 55 L43 42 L50 28" stroke="rgba(26,61,143,0.6)" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
    '<path d="M17 47 L9 35 L5 22" stroke="rgba(26,61,143,0.44)" stroke-width="0.9" stroke-linecap="round" fill="none"/>' +
    '<circle cx="29" cy="28" r="3.5" fill="rgba(28,163,88,0.68)"/>' +
    '<circle cx="10" cy="32" r="3" fill="rgba(26,61,143,0.62)"/>' +
    '<circle cx="50" cy="28" r="3" fill="rgba(26,61,143,0.62)"/>' +
    '<circle cx="5" cy="22" r="2.5" fill="rgba(28,163,88,0.5)"/>' +
    '</svg></div>';

  var coral2 =
    '<div style="position:absolute;left:6%;bottom:0;pointer-events:none;opacity:0.40;">' +
    '<svg width="46" height="62" viewBox="0 0 46 62" fill="none">' +
    '<path d="M23 62 L23 38 L23 18" stroke="rgba(28,163,88,0.72)" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
    '<path d="M23 50 L13 36 L7 22" stroke="rgba(28,163,88,0.58)" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
    '<path d="M23 43 L35 31 L41 16" stroke="rgba(28,163,88,0.58)" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
    '<circle cx="23" cy="18" r="3" fill="rgba(26,61,143,0.62)"/>' +
    '<circle cx="7" cy="22" r="2.5" fill="rgba(28,163,88,0.58)"/>' +
    '<circle cx="41" cy="16" r="2.5" fill="rgba(26,61,143,0.58)"/>' +
    '</svg></div>';

  var innerText = footer.innerHTML;
  footer.innerHTML =
    waveSVG + jelly1 + jelly2 + fish1 + fish2 + coral1 + coral2 +
    '<div style="position:relative;z-index:2;padding:2.5rem;">' + innerText + '</div>';

})();
