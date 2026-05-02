/* geoanim.js — living nature+science+geometric world */
(function () {
  'use strict';

  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CG = '28,163,88';   /* forest green */
  var CB = '26,61,143';   /* deep navy    */
  var CW = '180,210,255'; /* underwater pale blue */

  /* ═══════════════════════════════════════════════════
     1. BACKGROUND PARTICLE CANVAS
     ═══════════════════════════════════════════════════ */
  var bg = document.createElement('canvas');
  bg.setAttribute('aria-hidden','true');
  Object.assign(bg.style,{position:'fixed',top:'0',left:'0',width:'100%',height:'100%',zIndex:'-1',pointerEvents:'none'});
  document.body.prepend(bg);
  var bx = bg.getContext('2d');
  var W, H;

  function resize() { W = bg.width = window.innerWidth; H = bg.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function Pt() {
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.vx = (Math.random()-0.5)*(noMotion?0:0.14);
    this.vy = (Math.random()-0.5)*(noMotion?0:0.14);
    this.r = Math.random()*3+2;
    this.c = Math.random()>0.5 ? CB : CG;
    this.hex = Math.random()>0.38;
    this.ph = Math.random()*Math.PI*2; this.ps = 0.004+Math.random()*0.007;
  }
  Pt.prototype.tick = function(){
    this.x+=this.vx; this.y+=this.vy; this.ph+=this.ps;
    if(this.x<-80) this.x=W+80; if(this.x>W+80) this.x=-80;
    if(this.y<-80) this.y=H+80; if(this.y>H+80) this.y=-80;
  };
  function hexPath(x,y,r){
    bx.beginPath();
    for(var i=0;i<6;i++){var a=i*Math.PI/3-Math.PI/6; i?bx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a)):bx.moveTo(x+r*Math.cos(a),y+r*Math.sin(a));}
    bx.closePath();
  }
  var MAXD=200, pts=Array.from({length:40},function(){return new Pt();});
  function bgFrame(){
    bx.clearRect(0,0,W,H);
    pts.forEach(function(p){p.tick();});
    for(var i=0;i<pts.length;i++){for(var j=i+1;j<pts.length;j++){
      var d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
      if(d<MAXD){bx.strokeStyle='rgba('+pts[i].c+','+(1-d/MAXD)*0.045+')';bx.lineWidth=0.4;
        bx.beginPath();bx.moveTo(pts[i].x,pts[i].y);bx.lineTo(pts[j].x,pts[j].y);bx.stroke();}
    }}
    pts.forEach(function(p){
      var a=0.05+0.022*Math.sin(p.ph);
      bx.strokeStyle='rgba('+p.c+','+a+')';bx.fillStyle='rgba('+p.c+','+(a*0.2)+')';bx.lineWidth=0.6;
      if(p.hex){hexPath(p.x,p.y,p.r*2.8);}else{bx.beginPath();bx.arc(p.x,p.y,p.r,0,Math.PI*2);}
      bx.fill();bx.stroke();
    });
    requestAnimationFrame(bgFrame);
  }
  requestAnimationFrame(bgFrame);

  if(noMotion) return;

  /* ═══════════════════════════════════════════════════
     2. INJECT CSS FOR ALL ORNAMENTS
     ═══════════════════════════════════════════════════ */
  var S = document.createElement('style');
  S.textContent = [
    /* left helix */
    '.geo-l{position:fixed;left:0;top:50%;transform:translateY(-50%);pointer-events:none;z-index:1;opacity:0.38;',
    'animation:geoFloatL 7s ease-in-out infinite;}',
    '@keyframes geoFloatL{0%,100%{transform:translateY(-50%) translateX(0);}50%{transform:translateY(-50%) translateX(8px);}}',

    /* right branch */
    '.geo-r{position:fixed;right:0;top:50%;transform:translateY(-50%);pointer-events:none;z-index:1;opacity:0.38;',
    'animation:geoFloatR 9s ease-in-out infinite;}',
    '@keyframes geoFloatR{0%,100%{transform:translateY(-50%) translateX(0);}50%{transform:translateY(-50%) translateX(-8px);}}',

    /* top-right: breathing/pulsing hex cluster */
    '.geo-tr{position:fixed;right:-20px;top:-20px;pointer-events:none;z-index:1;opacity:0.28;',
    'animation:geoPulse 5s ease-in-out infinite;}',
    '@keyframes geoPulse{0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.15) rotate(12deg);}}',

    /* bottom-left: breathing hex */
    '.geo-bl{position:fixed;left:-20px;bottom:-20px;pointer-events:none;z-index:1;opacity:0.28;',
    'animation:geoPulse2 6.5s ease-in-out infinite;}',
    '@keyframes geoPulse2{0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.18) rotate(-14deg);}}',

    /* geometric bird (top-left area, drifting across) */
    '.geo-bird{position:fixed;pointer-events:none;z-index:1;opacity:0.3;',
    'animation:birdFly 28s linear infinite;}',
    '@keyframes birdFly{',
    '0%{transform:translateX(-120px) translateY(0) scaleX(1);}',
    '48%{transform:translateX(calc(100vw + 120px)) translateY(-40px) scaleX(1);}',
    '50%{transform:translateX(calc(100vw + 120px)) translateY(-40px) scaleX(-1);}',
    '98%{transform:translateX(-120px) translateY(0) scaleX(-1);}',
    '100%{transform:translateX(-120px) translateY(0) scaleX(1);}}',

    /* underwater footer */
    '.sea-zone{position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(180,210,255,0) 0%,rgba(180,215,255,0.55) 18%,rgba(140,190,245,0.75) 100%);}',
    '.sea-wave{position:absolute;top:0;left:0;width:200%;height:40px;animation:waveSurf 4s linear infinite;}',
    '@keyframes waveSurf{from{transform:translateX(0);}to{transform:translateX(-50%);}}',

    /* jellyfish */
    '.geo-jelly{position:absolute;pointer-events:none;opacity:0.45;animation:jellyDrift 8s ease-in-out infinite;}',
    '@keyframes jellyDrift{0%,100%{transform:translateY(0) rotate(-4deg);}50%{transform:translateY(-18px) rotate(4deg);}}',

    /* sea fish */
    '.geo-fish{position:absolute;pointer-events:none;opacity:0.38;animation:fishSwim 14s linear infinite;}',
    '@keyframes fishSwim{0%{transform:translateX(-80px) scaleX(1);}49%{transform:translateX(calc(100% + 80px)) scaleX(1);}',
    '50%{transform:translateX(calc(100% + 80px)) scaleX(-1);}99%{transform:translateX(-80px) scaleX(-1);}100%{transform:translateX(-80px) scaleX(1);}}',

    /* hide side ornaments on narrow screens */
    '@media(max-width:860px){.geo-l,.geo-r{display:none;}}',
    '@media(max-width:540px){.geo-tr,.geo-bl{display:none;}}',
  ].join('');
  document.head.appendChild(S);

  /* ═══════════════════════════════════════════════════
     3. LEFT ORNAMENT — DNA double helix (bigger, bolder)
     ═══════════════════════════════════════════════════ */
  var N=18, lp1='', lp2='', lrungs=[];
  for(var i=0;i<=N;i++){
    var t=(i/N)*Math.PI*4.2, hy=10+(i/N)*340;
    var lx1=22+17*Math.sin(t), lx2=22+17*Math.sin(t+Math.PI);
    lp1+=(i===0?'M ':' L ')+lx1.toFixed(1)+' '+hy.toFixed(1);
    lp2+=(i===0?'M ':' L ')+lx2.toFixed(1)+' '+hy.toFixed(1);
    if(i%3===1) lrungs.push('<line x1="'+lx1.toFixed(1)+'" y1="'+hy.toFixed(1)+'" x2="'+lx2.toFixed(1)+'" y2="'+hy.toFixed(1)+'" stroke="rgba(26,61,143,0.7)" stroke-width="1.2"/>');
  }
  var lDiv=document.createElement('div'); lDiv.className='geo-l'; lDiv.setAttribute('aria-hidden','true');
  lDiv.innerHTML='<svg width="48" height="360" viewBox="0 0 48 360" fill="none">'+
    '<path d="'+lp1+'" stroke="rgba(28,163,88,0.9)" stroke-width="1.6" fill="none"/>'+
    '<path d="'+lp2+'" stroke="rgba(26,61,143,0.9)" stroke-width="1.6" fill="none"/>'+
    lrungs.join('')+'</svg>';
  document.body.appendChild(lDiv);

  /* ═══════════════════════════════════════════════════
     4. RIGHT ORNAMENT — branching mycelium network
     ═══════════════════════════════════════════════════ */
  var rDiv=document.createElement('div'); rDiv.className='geo-r'; rDiv.setAttribute('aria-hidden','true');
  rDiv.innerHTML='<svg width="72" height="360" viewBox="0 0 72 360" fill="none">'+
    /* main trunk */
    '<path d="M36 355 L36 240 L36 180" stroke="rgba(28,163,88,0.8)" stroke-width="1.8" stroke-linecap="round" fill="none"/>'+
    /* primary branches */
    '<path d="M36 300 L20 272 L10 248" stroke="rgba(28,163,88,0.72)" stroke-width="1.4" stroke-linecap="round" fill="none"/>'+
    '<path d="M36 285 L54 258 L64 234" stroke="rgba(28,163,88,0.72)" stroke-width="1.4" stroke-linecap="round" fill="none"/>'+
    '<path d="M36 245 L22 220 L14 196" stroke="rgba(28,163,88,0.62)" stroke-width="1.1" stroke-linecap="round" fill="none"/>'+
    '<path d="M36 232 L50 210 L60 186" stroke="rgba(28,163,88,0.62)" stroke-width="1.1" stroke-linecap="round" fill="none"/>'+
    /* secondary branches */
    '<path d="M22 220 L12 200 L7 178" stroke="rgba(28,163,88,0.48)" stroke-width="0.8" stroke-linecap="round" fill="none"/>'+
    '<path d="M50 210 L58 192 L64 168" stroke="rgba(28,163,88,0.48)" stroke-width="0.8" stroke-linecap="round" fill="none"/>'+
    '<path d="M14 196 L7 180 L4 162" stroke="rgba(28,163,88,0.35)" stroke-width="0.6" stroke-linecap="round" fill="none"/>'+
    /* leaf nodes (small hex) */
    '<polygon points="36,168 42,172 42,180 36,184 30,180 30,172" stroke="rgba(26,61,143,0.65)" stroke-width="0.9" fill="rgba(26,61,143,0.1)"/>'+
    '<circle cx="36" cy="180" r="3.5" fill="rgba(28,163,88,0.6)"/>'+
    '<circle cx="20" cy="272" r="2.8" fill="rgba(26,61,143,0.6)"/>'+
    '<circle cx="54" cy="258" r="2.8" fill="rgba(26,61,143,0.6)"/>'+
    '<circle cx="22" cy="220" r="2.4" fill="rgba(28,163,88,0.55)"/>'+
    '<circle cx="50" cy="210" r="2.4" fill="rgba(26,61,143,0.52)"/>'+
    '<circle cx="10" cy="248" r="2" fill="rgba(28,163,88,0.45)"/>'+
    '<circle cx="64" cy="234" r="2" fill="rgba(26,61,143,0.45)"/>'+
    '</svg>';
  document.body.appendChild(rDiv);

  /* ═══════════════════════════════════════════════════
     5. TOP-RIGHT — pulsing/breathing hex rosette
     ═══════════════════════════════════════════════════ */
  var trDiv=document.createElement('div'); trDiv.className='geo-tr'; trDiv.setAttribute('aria-hidden','true');
  trDiv.innerHTML='<svg width="200" height="200" viewBox="0 0 200 200" fill="none">'+
    '<polygon points="100,5 169,43 169,119 100,157 31,119 31,43" stroke="rgba(26,61,143,0.7)" stroke-width="1.2" fill="rgba(26,61,143,0.04)"/>'+
    '<polygon points="100,22 154,53 154,115 100,146 46,115 46,53" stroke="rgba(28,163,88,0.6)" stroke-width="0.9" fill="rgba(28,163,88,0.03)"/>'+
    '<polygon points="100,39 139,63 139,111 100,135 61,111 61,63" stroke="rgba(26,61,143,0.5)" stroke-width="0.8"/>'+
    '<polygon points="100,56 124,70 124,98 100,112 76,98 76,70" stroke="rgba(28,163,88,0.45)" stroke-width="0.7"/>'+
    '<circle cx="100" cy="84" r="5" fill="rgba(28,163,88,0.4)" stroke="none"/>'+
    '<circle cx="100" cy="84" r="10" stroke="rgba(26,61,143,0.3)" stroke-width="0.8" fill="none"/>'+
    '</svg>';
  document.body.appendChild(trDiv);

  /* ═══════════════════════════════════════════════════
     6. BOTTOM-LEFT — breathing green hex rosette
     ═══════════════════════════════════════════════════ */
  var blDiv=document.createElement('div'); blDiv.className='geo-bl'; blDiv.setAttribute('aria-hidden','true');
  blDiv.innerHTML='<svg width="180" height="180" viewBox="0 0 180 180" fill="none">'+
    '<polygon points="90,5 153,41 153,113 90,149 27,113 27,41" stroke="rgba(28,163,88,0.7)" stroke-width="1.2" fill="rgba(28,163,88,0.04)"/>'+
    '<polygon points="90,22 141,51 141,109 90,138 39,109 39,51" stroke="rgba(26,61,143,0.58)" stroke-width="0.9" fill="rgba(26,61,143,0.03)"/>'+
    '<polygon points="90,39 129,61 129,109 90,131 51,109 51,61" stroke="rgba(28,163,88,0.46)" stroke-width="0.8"/>'+
    '<polygon points="90,56 117,71 117,109 90,124 63,109 63,71" stroke="rgba(26,61,143,0.36)" stroke-width="0.7"/>'+
    '<circle cx="90" cy="90" r="5" fill="rgba(26,61,143,0.4)" stroke="none"/>'+
    '</svg>';
  document.body.appendChild(blDiv);

  /* ═══════════════════════════════════════════════════
     7. GEOMETRIC BIRD — drifts across screen (top area)
     ═══════════════════════════════════════════════════ */
  var birdDiv=document.createElement('div');
  birdDiv.className='geo-bird'; birdDiv.setAttribute('aria-hidden','true');
  birdDiv.style.cssText='top:12vh;left:0;';
  /* Geometric bird: body=diamond, wings=two triangles, tail=small triangle */
  birdDiv.innerHTML='<svg width="64" height="32" viewBox="0 0 64 32" fill="none">'+
    /* left wing */
    '<polygon points="32,16 4,6 18,18" stroke="rgba(26,61,143,0.9)" stroke-width="1" fill="rgba(26,61,143,0.2)"/>'+
    /* right wing */
    '<polygon points="32,16 60,6 46,18" stroke="rgba(26,61,143,0.9)" stroke-width="1" fill="rgba(26,61,143,0.2)"/>'+
    /* body diamond */
    '<polygon points="32,10 40,16 32,22 24,16" stroke="rgba(26,61,143,0.95)" stroke-width="1.2" fill="rgba(28,163,88,0.25)"/>'+
    /* tail */
    '<polygon points="24,16 14,20 22,22" stroke="rgba(26,61,143,0.7)" stroke-width="0.8" fill="rgba(26,61,143,0.15)"/>'+
    '</svg>';
  document.body.appendChild(birdDiv);

  /* second bird, different timing & height */
  var bird2=document.createElement('div');
  bird2.className='geo-bird'; bird2.setAttribute('aria-hidden','true');
  bird2.style.cssText='top:22vh;left:0;animation-duration:38s;animation-delay:-16s;opacity:0.2;';
  bird2.innerHTML='<svg width="44" height="22" viewBox="0 0 64 32" fill="none">'+
    '<polygon points="32,16 4,6 18,18" stroke="rgba(28,163,88,0.9)" stroke-width="1" fill="rgba(28,163,88,0.2)"/>'+
    '<polygon points="32,16 60,6 46,18" stroke="rgba(28,163,88,0.9)" stroke-width="1" fill="rgba(28,163,88,0.2)"/>'+
    '<polygon points="32,10 40,16 32,22 24,16" stroke="rgba(28,163,88,0.95)" stroke-width="1.2" fill="rgba(26,61,143,0.2)"/>'+
    '<polygon points="24,16 14,20 22,22" stroke="rgba(28,163,88,0.7)" stroke-width="0.8" fill="rgba(28,163,88,0.15)"/>'+
    '</svg>';
  document.body.appendChild(bird2);

  /* ═══════════════════════════════════════════════════
     8. UNDERWATER FOOTER
     ═══════════════════════════════════════════════════ */
  var footer=document.querySelector('.site-footer');
  if(!footer) return;

  footer.classList.add('sea-zone');

  /* wave SVG at the top of the footer */
  var waveSVG='<svg class="sea-wave" viewBox="0 0 1200 40" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<path d="M0 20 C60 8 120 32 180 20 C240 8 300 32 360 20 C420 8 480 32 540 20 C600 8 660 32 720 20 C780 8 840 32 900 20 C960 8 1020 32 1080 20 C1140 8 1200 32 1200 20 L1200 40 L0 40 Z" fill="rgba(140,190,245,0.35)"/>'+
    '<path d="M0 24 C50 14 110 34 170 24 C230 14 290 34 350 24 C410 14 470 34 530 24 C590 14 650 34 710 24 C770 14 830 34 890 24 C950 14 1010 34 1070 24 C1130 14 1190 34 1200 24 L1200 40 L0 40 Z" fill="rgba(160,205,255,0.2)"/>'+
    '</svg>';

  /* jellyfish 1 */
  var jelly1='<div class="geo-jelly" style="left:15%;bottom:30px;animation-delay:0s;">'+
    '<svg width="36" height="48" viewBox="0 0 36 48" fill="none">'+
    '<ellipse cx="18" cy="16" rx="14" ry="12" stroke="rgba(26,61,143,0.7)" stroke-width="1.2" fill="rgba(140,190,255,0.3)"/>'+
    '<path d="M10 26 Q8 36 6 44" stroke="rgba(26,61,143,0.45)" stroke-width="0.8" fill="none"/>'+
    '<path d="M14 27 Q13 37 11 46" stroke="rgba(26,61,143,0.4)" stroke-width="0.7" fill="none"/>'+
    '<path d="M18 28 Q18 38 18 47" stroke="rgba(28,163,88,0.45)" stroke-width="0.8" fill="none"/>'+
    '<path d="M22 27 Q23 37 25 46" stroke="rgba(26,61,143,0.4)" stroke-width="0.7" fill="none"/>'+
    '<path d="M26 26 Q28 36 30 44" stroke="rgba(26,61,143,0.45)" stroke-width="0.8" fill="none"/>'+
    '<ellipse cx="18" cy="14" rx="7" ry="5" stroke="rgba(180,210,255,0.5)" stroke-width="0.7" fill="none"/>'+
    '</svg></div>';

  /* jellyfish 2 — larger, slightly different timing */
  var jelly2='<div class="geo-jelly" style="left:62%;bottom:20px;animation-delay:-3.5s;animation-duration:11s;opacity:0.35;">'+
    '<svg width="48" height="60" viewBox="0 0 48 60" fill="none">'+
    '<ellipse cx="24" cy="20" rx="18" ry="15" stroke="rgba(28,163,88,0.7)" stroke-width="1.2" fill="rgba(28,163,88,0.12)"/>'+
    '<path d="M13 33 Q10 46 8 56" stroke="rgba(28,163,88,0.4)" stroke-width="0.9" fill="none"/>'+
    '<path d="M18 34 Q17 47 15 58" stroke="rgba(28,163,88,0.35)" stroke-width="0.8" fill="none"/>'+
    '<path d="M24 35 Q24 48 24 58" stroke="rgba(26,61,143,0.45)" stroke-width="0.9" fill="none"/>'+
    '<path d="M30 34 Q31 47 33 58" stroke="rgba(28,163,88,0.35)" stroke-width="0.8" fill="none"/>'+
    '<path d="M35 33 Q38 46 40 56" stroke="rgba(28,163,88,0.4)" stroke-width="0.9" fill="none"/>'+
    '<ellipse cx="24" cy="17" rx="9" ry="7" stroke="rgba(140,210,140,0.55)" stroke-width="0.8" fill="none"/>'+
    '</svg></div>';

  /* geometric fish */
  var fish1='<div class="geo-fish" style="bottom:45px;left:0;animation-duration:16s;animation-delay:-4s;">'+
    '<svg width="52" height="26" viewBox="0 0 52 26" fill="none">'+
    /* body */
    '<polygon points="8,13 28,4 44,13 28,22" stroke="rgba(26,61,143,0.85)" stroke-width="1.1" fill="rgba(140,190,255,0.35)"/>'+
    /* tail */
    '<polygon points="8,13 0,5 2,13 0,21" stroke="rgba(26,61,143,0.7)" stroke-width="0.9" fill="rgba(26,61,143,0.2)"/>'+
    /* fins */
    '<polygon points="20,8 26,4 28,10" stroke="rgba(26,61,143,0.55)" stroke-width="0.7" fill="rgba(26,61,143,0.12)"/>'+
    /* eye */
    '<circle cx="36" cy="13" r="2.5" fill="rgba(26,61,143,0.6)" stroke="none"/>'+
    '<circle cx="36.8" cy="12.4" r="0.9" fill="rgba(240,248,255,0.9)" stroke="none"/>'+
    /* scale lines */
    '<path d="M20 10 Q24 13 20 16" stroke="rgba(26,61,143,0.3)" stroke-width="0.6" fill="none"/>'+
    '</svg></div>';

  var fish2='<div class="geo-fish" style="bottom:65px;left:0;animation-duration:22s;animation-delay:-10s;opacity:0.3;">'+
    '<svg width="38" height="20" viewBox="0 0 52 26" fill="none">'+
    '<polygon points="8,13 28,4 44,13 28,22" stroke="rgba(28,163,88,0.85)" stroke-width="1.1" fill="rgba(28,163,88,0.2)"/>'+
    '<polygon points="8,13 0,5 2,13 0,21" stroke="rgba(28,163,88,0.7)" stroke-width="0.9" fill="rgba(28,163,88,0.18)"/>'+
    '<circle cx="36" cy="13" r="2.5" fill="rgba(28,163,88,0.65)" stroke="none"/>'+
    '</svg></div>';

  /* coral structure */
  var coral='<div style="position:absolute;right:8%;bottom:0;pointer-events:none;opacity:0.4;">'+
    '<svg width="60" height="80" viewBox="0 0 60 80" fill="none">'+
    '<path d="M30 80 L30 50 L30 30" stroke="rgba(26,61,143,0.7)" stroke-width="1.8" stroke-linecap="round" fill="none"/>'+
    '<path d="M30 65 L18 50 L12 36" stroke="rgba(26,61,143,0.6)" stroke-width="1.3" stroke-linecap="round" fill="none"/>'+
    '<path d="M30 58 L44 44 L50 30" stroke="rgba(26,61,143,0.6)" stroke-width="1.3" stroke-linecap="round" fill="none"/>'+
    '<path d="M18 50 L10 38 L6 24" stroke="rgba(26,61,143,0.45)" stroke-width="0.9" stroke-linecap="round" fill="none"/>'+
    '<circle cx="30" cy="30" r="3.5" fill="rgba(28,163,88,0.65)"/>'+
    '<circle cx="12" cy="36" r="3" fill="rgba(26,61,143,0.6)"/>'+
    '<circle cx="50" cy="30" r="3" fill="rgba(26,61,143,0.6)"/>'+
    '<circle cx="6" cy="24" r="2.5" fill="rgba(28,163,88,0.5)"/>'+
    '</svg></div>';

  var coral2='<div style="position:absolute;left:5%;bottom:0;pointer-events:none;opacity:0.35;">'+
    '<svg width="48" height="64" viewBox="0 0 48 64" fill="none">'+
    '<path d="M24 64 L24 40 L24 20" stroke="rgba(28,163,88,0.7)" stroke-width="1.6" stroke-linecap="round" fill="none"/>'+
    '<path d="M24 52 L14 38 L8 24" stroke="rgba(28,163,88,0.58)" stroke-width="1.1" stroke-linecap="round" fill="none"/>'+
    '<path d="M24 44 L36 32 L42 18" stroke="rgba(28,163,88,0.58)" stroke-width="1.1" stroke-linecap="round" fill="none"/>'+
    '<circle cx="24" cy="20" r="3" fill="rgba(26,61,143,0.6)"/>'+
    '<circle cx="8" cy="24" r="2.5" fill="rgba(28,163,88,0.55)"/>'+
    '<circle cx="42" cy="18" r="2.5" fill="rgba(26,61,143,0.55)"/>'+
    '</svg></div>';

  footer.style.position='relative';
  footer.innerHTML=waveSVG+jelly1+jelly2+fish1+fish2+coral+coral2+
    '<div style="position:relative;z-index:2;padding:2.5rem;">'+footer.innerHTML+'</div>';

})();
