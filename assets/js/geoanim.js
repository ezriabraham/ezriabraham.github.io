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
     2. CSS
     ═══════════════════════════════════════════════════ */
  var S = document.createElement('style');
  S.textContent =
    /* birds in page-header */
    '.hdr-bird{position:absolute;pointer-events:none;z-index:2;opacity:0.28;}' +
    '.hdr-bird-1{top:18%;left:8%;animation:bFloat1 7s ease-in-out infinite;}' +
    '.hdr-bird-2{top:22%;right:10%;animation:bFloat2 9s ease-in-out infinite;}' +
    '@keyframes bFloat1{' +
    '0%{transform:translate(0,0) rotate(-3deg);}' +
    '25%{transform:translate(16px,-22px) rotate(4deg);}' +
    '55%{transform:translate(-10px,-14px) rotate(-2deg);}' +
    '78%{transform:translate(20px,-30px) rotate(5deg);}' +
    '100%{transform:translate(0,0) rotate(-3deg);}}' +
    '@keyframes bFloat2{' +
    '0%{transform:translate(0,0) rotate(2deg);}' +
    '30%{transform:translate(-18px,-18px) rotate(-4deg);}' +
    '60%{transform:translate(12px,-28px) rotate(3deg);}' +
    '85%{transform:translate(-6px,-10px) rotate(-1deg);}' +
    '100%{transform:translate(0,0) rotate(2deg);}}' +
    '.hdr-bird svg{animation:wFlap 0.65s ease-in-out infinite;}' +
    '.hdr-bird-2 svg{animation-duration:0.82s;}' +
    '@keyframes wFlap{0%,100%{transform:scaleY(1);}50%{transform:scaleY(0.60);}}' +

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

    /* coral */
    '.sea-coral{position:absolute;pointer-events:none;z-index:2;}' +

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
     3. BIRDS IN PAGE-HEADER (non-hero pages only)
     ═══════════════════════════════════════════════════ */
  if (!isHero) {
    var header = document.querySelector('.page-header');
    if (header) {
      function makeBird(color1, fill1, fill2) {
        return '<svg width="62" height="30" viewBox="0 0 62 30" fill="none">' +
          '<polygon points="20,15 2,6 14,17" stroke="' + color1 + '" stroke-width="1" fill="' + fill1 + '"/>' +
          '<polygon points="42,15 60,6 48,17" stroke="' + color1 + '" stroke-width="1" fill="' + fill1 + '"/>' +
          '<polygon points="31,9 40,15 31,21 22,15" stroke="' + color1 + '" stroke-width="1.2" fill="' + fill2 + '"/>' +
          '<polygon points="22,15 12,20 20,22" stroke="' + color1 + '" stroke-width="0.7" fill="' + fill1 + '"/>' +
          '</svg>';
      }
      var b1 = document.createElement('div');
      b1.className = 'hdr-bird hdr-bird-1'; b1.setAttribute('aria-hidden', 'true');
      b1.innerHTML = makeBird('rgba(26,61,143,0.88)', 'rgba(26,61,143,0.22)', 'rgba(28,163,88,0.3)');
      header.appendChild(b1);

      var b2 = document.createElement('div');
      b2.className = 'hdr-bird hdr-bird-2'; b2.setAttribute('aria-hidden', 'true');
      b2.innerHTML = makeBird('rgba(28,163,88,0.88)', 'rgba(28,163,88,0.22)', 'rgba(26,61,143,0.25)');
      header.appendChild(b2);
    }
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
    '<path d="M0 38 C80 22 160 54 240 38 C320 22 400 54 480 38 ' +
              'C560 22 640 54 720 38 C800 22 880 54 960 38 ' +
              'C1040 22 1120 54 1200 38 C1280 22 1360 54 1440 38 ' +
              'C1520 22 1600 54 1680 38 C1760 22 1800 38 1800 38 ' +
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

  /* Coral anchored at bottom:0 */
  var coral1 =
    '<div class="sea-coral" style="right:8%;bottom:0;opacity:0.44;" aria-hidden="true">' +
    '<svg width="58" height="78" viewBox="0 0 58 78" fill="none">' +
    '<path d="M29 78 L29 48 L29 28" stroke="rgba(26,61,143,0.68)" stroke-width="1.8" stroke-linecap="round" fill="none"/>' +
    '<path d="M29 62 L17 47 L10 32" stroke="rgba(26,61,143,0.56)" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
    '<path d="M29 55 L43 42 L50 28" stroke="rgba(26,61,143,0.56)" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
    '<path d="M17 47 L9 35 L5 22" stroke="rgba(26,61,143,0.40)" stroke-width="0.9" stroke-linecap="round" fill="none"/>' +
    '<circle cx="29" cy="28" r="3.5" fill="rgba(28,163,88,0.65)"/>' +
    '<circle cx="10" cy="32" r="3" fill="rgba(26,61,143,0.58)"/>' +
    '<circle cx="50" cy="28" r="3" fill="rgba(26,61,143,0.58)"/>' +
    '</svg></div>';

  var coral2 =
    '<div class="sea-coral" style="left:5%;bottom:0;opacity:0.40;" aria-hidden="true">' +
    '<svg width="46" height="62" viewBox="0 0 46 62" fill="none">' +
    '<path d="M23 62 L23 38 L23 18" stroke="rgba(28,163,88,0.68)" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
    '<path d="M23 50 L13 36 L7 22" stroke="rgba(28,163,88,0.54)" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
    '<path d="M23 43 L35 31 L41 16" stroke="rgba(28,163,88,0.54)" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
    '<circle cx="23" cy="18" r="3" fill="rgba(26,61,143,0.58)"/>' +
    '<circle cx="7" cy="22" r="2.5" fill="rgba(28,163,88,0.55)"/>' +
    '<circle cx="41" cy="16" r="2.5" fill="rgba(26,61,143,0.55)"/>' +
    '</svg></div>';

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

  var innerText = footer.innerHTML;
  footer.innerHTML =
    waveSVG + jelly1 + jelly2 + fish1 + fish2 + fish3 + coral1 + coral2 +
    linkORCID + linkLinkedIn + linkEmail +
    '<div style="position:relative;z-index:6;padding:2rem 2.5rem;">' + innerText + '</div>';

})();
