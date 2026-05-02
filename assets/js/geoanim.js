/* geoanim.js — animated nature + science + geometric background */
(function () {
  'use strict';

  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* colour constants — forest green + deep navy */
  const CG = '28,163,88';
  const CB = '26,61,143';

  /* ══════════════════════════════════════════
     1. FULL-PAGE BACKGROUND CANVAS
     ══════════════════════════════════════════ */
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    zIndex: '-1', pointerEvents: 'none',
  });
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Pt() {
    this.x   = Math.random() * W;
    this.y   = Math.random() * H;
    this.vx  = (Math.random() - 0.5) * (noMotion ? 0 : 0.15);
    this.vy  = (Math.random() - 0.5) * (noMotion ? 0 : 0.15);
    this.r   = Math.random() * 3.5 + 2;
    this.c   = Math.random() > 0.52 ? CB : CG;
    this.hex = Math.random() > 0.4;
    this.ph  = Math.random() * Math.PI * 2;
    this.ps  = 0.004 + Math.random() * 0.007;
  }
  Pt.prototype.tick = function () {
    this.x += this.vx; this.y += this.vy;
    this.ph += this.ps;
    if (this.x < -80) this.x = W + 80;
    if (this.x > W + 80) this.x = -80;
    if (this.y < -80) this.y = H + 80;
    if (this.y > H + 80) this.y = -80;
  };

  function hexPath(x, y, r) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = i * Math.PI / 3 - Math.PI / 6;
      i ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
        : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
  }

  var MAXD = 210;
  var pts  = Array.from({ length: 42 }, function () { return new Pt(); });

  function frame() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(function (p) { p.tick(); });

    /* connection lines between nearby nodes */
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < MAXD) {
          ctx.strokeStyle = 'rgba(' + pts[i].c + ',' + ((1 - d / MAXD) * 0.05) + ')';
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    /* draw particles (hex outlines + circles) */
    pts.forEach(function (p) {
      var a = 0.055 + 0.025 * Math.sin(p.ph);
      ctx.strokeStyle = 'rgba(' + p.c + ',' + a + ')';
      ctx.fillStyle   = 'rgba(' + p.c + ',' + (a * 0.22) + ')';
      ctx.lineWidth = 0.65;
      if (p.hex) {
        hexPath(p.x, p.y, p.r * 2.8);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();
    });

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', function () {
    resize();
    pts.forEach(function (p) { p.x = Math.random() * W; p.y = Math.random() * H; });
  });
  requestAnimationFrame(frame);

  if (noMotion) return;

  /* ══════════════════════════════════════════
     2. CSS FOR MARGIN + CORNER ORNAMENTS
     ══════════════════════════════════════════ */
  var styleEl = document.createElement('style');
  styleEl.textContent = '\
    .geo-orn { position:fixed; pointer-events:none; z-index:0; } \
    .geo-orn svg { display:block; } \
    \
    .geo-orn-l { \
      left:0; top:50%; transform:translateY(-50%); opacity:0.12; \
      animation: geoL 9s ease-in-out infinite; \
    } \
    @keyframes geoL { \
      0%,100% { transform:translateY(-50%) translateX(0); } \
      50%      { transform:translateY(-50%) translateX(6px); } \
    } \
    \
    .geo-orn-r { \
      right:0; top:50%; transform:translateY(-50%); opacity:0.12; \
      animation: geoR 11s ease-in-out infinite; \
    } \
    @keyframes geoR { \
      0%,100% { transform:translateY(-50%) translateX(0); } \
      50%      { transform:translateY(-50%) translateX(-6px); } \
    } \
    \
    .geo-orn-tr { \
      right:0; top:0; opacity:0.07; \
      animation: geoRotCW 34s linear infinite; \
    } \
    .geo-orn-bl { \
      left:0; bottom:0; opacity:0.07; \
      animation: geoRotCCW 46s linear infinite; \
    } \
    @keyframes geoRotCW  { from{transform:rotate(0deg);} to{transform:rotate(360deg);} } \
    @keyframes geoRotCCW { from{transform:rotate(0deg);} to{transform:rotate(-360deg);} } \
    \
    @media(max-width:900px){ .geo-orn-l,.geo-orn-r { display:none; } } \
    @media(max-width:640px){ .geo-orn-tr,.geo-orn-bl { display:none; } } \
  ';
  document.head.appendChild(styleEl);

  /* ══════════════════════════════════════════
     3. LEFT ORNAMENT — DNA double helix
     ══════════════════════════════════════════ */
  var STEPS = 16;
  var p1 = '', p2 = '';
  var rungs = [];
  for (var i = 0; i <= STEPS; i++) {
    var t  = (i / STEPS) * Math.PI * 3.8;
    var hy = 18 + (i / STEPS) * 284;
    var x1 = 20 + 14 * Math.sin(t);
    var x2 = 20 + 14 * Math.sin(t + Math.PI);
    p1 += (i === 0 ? 'M' : ' L') + ' ' + x1.toFixed(1) + ' ' + hy.toFixed(1);
    p2 += (i === 0 ? 'M' : ' L') + ' ' + x2.toFixed(1) + ' ' + hy.toFixed(1);
    if (i % 3 === 1) {
      rungs.push('<line x1="' + x1.toFixed(1) + '" y1="' + hy.toFixed(1) +
                 '" x2="' + x2.toFixed(1) + '" y2="' + hy.toFixed(1) +
                 '" stroke="rgba(26,61,143,0.55)" stroke-width="0.7"/>');
    }
  }
  var leftDiv = document.createElement('div');
  leftDiv.className = 'geo-orn geo-orn-l';
  leftDiv.setAttribute('aria-hidden', 'true');
  leftDiv.innerHTML =
    '<svg width="40" height="320" viewBox="0 0 40 320" fill="none">' +
      '<path d="' + p1 + '" stroke="rgba(28,163,88,0.8)" stroke-width="1.1" fill="none"/>' +
      '<path d="' + p2 + '" stroke="rgba(26,61,143,0.8)" stroke-width="1.1" fill="none"/>' +
      rungs.join('') +
    '</svg>';
  document.body.appendChild(leftDiv);

  /* ══════════════════════════════════════════
     4. RIGHT ORNAMENT — branching tree network
     ══════════════════════════════════════════ */
  var rightDiv = document.createElement('div');
  rightDiv.className = 'geo-orn geo-orn-r';
  rightDiv.setAttribute('aria-hidden', 'true');
  rightDiv.innerHTML =
    '<svg width="64" height="300" viewBox="0 0 64 300" fill="none">' +
      '<path d="M32 295 L32 180 L32 140" stroke="rgba(28,163,88,0.65)" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M32 230 L18 208 L10 188" stroke="rgba(28,163,88,0.55)" stroke-width="1" stroke-linecap="round" fill="none"/>' +
      '<path d="M32 215 L48 194 L56 174" stroke="rgba(28,163,88,0.55)" stroke-width="1" stroke-linecap="round" fill="none"/>' +
      '<path d="M32 175 L20 154 L14 132" stroke="rgba(28,163,88,0.45)" stroke-width="0.8" stroke-linecap="round" fill="none"/>' +
      '<path d="M32 165 L44 146 L52 124" stroke="rgba(28,163,88,0.45)" stroke-width="0.8" stroke-linecap="round" fill="none"/>' +
      '<path d="M20 154 L12 134 L8 114" stroke="rgba(28,163,88,0.32)" stroke-width="0.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M44 146 L50 126 L54 104" stroke="rgba(28,163,88,0.32)" stroke-width="0.6" stroke-linecap="round" fill="none"/>' +
      '<circle cx="32" cy="140" r="2.5" fill="rgba(28,163,88,0.5)"/>' +
      '<circle cx="18" cy="208" r="2" fill="rgba(26,61,143,0.5)"/>' +
      '<circle cx="48" cy="194" r="2" fill="rgba(26,61,143,0.5)"/>' +
      '<circle cx="20" cy="154" r="1.8" fill="rgba(28,163,88,0.45)"/>' +
      '<circle cx="44" cy="146" r="1.8" fill="rgba(26,61,143,0.42)"/>' +
      '<circle cx="10" cy="188" r="1.5" fill="rgba(28,163,88,0.35)"/>' +
      '<circle cx="56" cy="174" r="1.5" fill="rgba(26,61,143,0.35)"/>' +
    '</svg>';
  document.body.appendChild(rightDiv);

  /* ══════════════════════════════════════════
     5. CORNER ORNAMENTS — rotating hex rings
     ══════════════════════════════════════════ */
  var trDiv = document.createElement('div');
  trDiv.className = 'geo-orn geo-orn-tr';
  trDiv.setAttribute('aria-hidden', 'true');
  trDiv.innerHTML =
    '<svg width="160" height="160" viewBox="0 0 160 160" fill="none">' +
      '<polygon points="80,6 142,41 142,111 80,146 18,111 18,41" stroke="rgba(26,61,143,0.55)" stroke-width="0.7"/>' +
      '<polygon points="80,22 126,47 126,105 80,130 34,105 34,47" stroke="rgba(28,163,88,0.45)" stroke-width="0.6"/>' +
      '<polygon points="80,38 110,53 110,99 80,114 50,99 50,53" stroke="rgba(26,61,143,0.35)" stroke-width="0.5"/>' +
      '<circle cx="80" cy="80" r="3" fill="rgba(28,163,88,0.3)"/>' +
    '</svg>';
  document.body.appendChild(trDiv);

  var blDiv = document.createElement('div');
  blDiv.className = 'geo-orn geo-orn-bl';
  blDiv.setAttribute('aria-hidden', 'true');
  blDiv.innerHTML =
    '<svg width="140" height="140" viewBox="0 0 140 140" fill="none">' +
      '<polygon points="70,5 123,35 123,95 70,125 17,95 17,35" stroke="rgba(28,163,88,0.55)" stroke-width="0.7"/>' +
      '<polygon points="70,21 107,42 107,90 70,111 33,90 33,42" stroke="rgba(26,61,143,0.42)" stroke-width="0.6"/>' +
      '<polygon points="70,37 91,50 91,82 70,95 49,82 49,50" stroke="rgba(28,163,88,0.32)" stroke-width="0.5"/>' +
    '</svg>';
  document.body.appendChild(blDiv);

})();
