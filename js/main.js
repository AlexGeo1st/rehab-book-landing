(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  // -------- Interactive background (canvas particles) --------
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas?.getContext?.('2d');
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  let W=0,H=0, DPR=1, particles=[], mouse={x:0,y:0,active:false};

  function resize(){
    if(!canvas||!ctx) return;
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function makeParticles(){
    const n = Math.round(Math.min(95, Math.max(55, (W*H)/22000)));
    particles = Array.from({length:n}, () => ({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: (Math.random()*2-1) * 0.22,
      vy: (Math.random()*2-1) * 0.22,
      r: 1.0 + Math.random()*1.8
    }));
  }

  function draw(){
    if(!canvas||!ctx) return;
    ctx.clearRect(0,0,W,H);

    const g = ctx.createRadialGradient(W*0.15,H*0.1,0, W*0.15,H*0.1, Math.max(W,H)*0.9);
    g.addColorStop(0,'rgba(47,111,237,0.18)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    const g2 = ctx.createRadialGradient(W*0.85,H*0.12,0, W*0.85,H*0.12, Math.max(W,H)*0.9);
    g2.addColorStop(0,'rgba(255,122,24,0.14)');
    g2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);

    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x< -20) p.x = W+20;
      if(p.x> W+20) p.x = -20;
      if(p.y< -20) p.y = H+20;
      if(p.y> H+20) p.y = -20;
    }

    for(let i=0;i<particles.length;i++){
      const a = particles[i];
      for(let j=i+1;j<particles.length;j++){
        const b = particles[j];
        const dx = a.x-b.x, dy=a.y-b.y;
        const d2 = dx*dx+dy*dy;
        const max = 135*135;
        if(d2<max){
          const alpha = 0.10*(1 - d2/max);
          ctx.strokeStyle = `rgba(234,240,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }

    for(const p of particles){
      ctx.fillStyle = 'rgba(234,240,255,0.72)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }

    if(mouse.active){
      const mg = ctx.createRadialGradient(mouse.x,mouse.y,0, mouse.x,mouse.y, 220);
      mg.addColorStop(0,'rgba(47,111,237,0.18)');
      mg.addColorStop(0.55,'rgba(255,122,24,0.07)');
      mg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = mg; ctx.fillRect(0,0,W,H);
    }
  }

  let raf = 0;
  function loop(){ draw(); raf = requestAnimationFrame(loop); }

  function startBg(){
    if(!canvas||!ctx) return;
    resize(); makeParticles();
    if(!prefersReduced) loop(); else draw();
  }

  window.addEventListener('resize', () => { resize(); makeParticles(); if(prefersReduced) draw(); });
  window.addEventListener('mousemove', (e) => { mouse.x=e.clientX; mouse.y=e.clientY; mouse.active=true; });
  window.addEventListener('mouseleave', () => { mouse.active=false; });
  startBg();

  // -------- Burger --------
  const burger = $('.burger');
  const menu = $('#navMenu');
  if (burger && menu) {
    const closeMenu = () => { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded','false'); };
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('.nav__link', menu).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!menu.contains(t) && !burger.contains(t)) closeMenu();
    });
  }

  // -------- Tabs --------
  const tabsRoot = $('[data-tabs]');
  if (tabsRoot) {
    const tabButtons = $$('[data-tab]', tabsRoot);
    const panes = $$('[data-pane]', tabsRoot);
    const activate = (key) => {
      tabButtons.forEach(btn => {
        const is = btn.dataset.tab === key;
        btn.classList.toggle('is-active', is);
        btn.setAttribute('aria-selected', String(is));
      });
      panes.forEach(p => p.classList.toggle('is-active', p.dataset.pane === key));
    };
    tabButtons.forEach(btn => btn.addEventListener('click', () => activate(btn.dataset.tab)));
  }

  // -------- Modal --------
  const modal = $('#modal');
  const openBtns = $$('[data-open-modal]');
  const closeBtns = $$('[data-close-modal]');
  const form = $('#leadForm');
  const note = $('#formNote');

  const openModal = () => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    const first = $('input, textarea, button', modal);
    first && first.focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  openBtns.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name')||'').toString().trim();
      const phone = (fd.get('phone')||'').toString().trim();
      if (!name || !phone) { note.textContent = 'Пожалуйста, заполните имя и телефон.'; return; }
      note.textContent = `Готово! (учебный режим) Заявка от «${name}» принята — в реальном проекте здесь была бы отправка на сервер.`;
      form.reset();
      setTimeout(closeModal, 900);
    });
  }

  // -------- Slider (gallery) --------
  const slides = [
    { src:'./assets/img/kobe_injury_court.jpg', alt:'Травма игрока на площадке', cap:'Реальные игровые эпизоды напоминают: риск травм всегда рядом.' },
    { src:'./assets/img/player_injury_warriors.jpg', alt:'Травма в матче', cap:'Острая боль → первичная оценка → решение по нагрузке.' },
    { src:'./assets/img/player_injury_lakers.jpg', alt:'Травма нижней конечности', cap:'Важно отличать перегрузку от повреждения и вовремя корректировать план.' },
    { src:'./assets/img/shockwave_therapy_knee.jpg', alt:'УВТ колена', cap:'УВТ: пример процедуры (иллюстрация).' },
    { src:'./assets/img/gallery_electrotherapy_knee.jpg', alt:'Электротерапия на колене', cap:'Физиотерапия: пример постановки электродов.' },
    { src:'./assets/img/knee_joint_injection.jpg', alt:'Инъекция в область колена', cap:'Инъекционные методы — по назначению врача (иллюстрация).' },
    { src:'./assets/img/shoulder_rotator_cuff_diagram.jpg', alt:'Ротаторная манжета плеча', cap:'Плечо: ротаторная манжета и зоны возможного повреждения.' },
    { src:'./assets/img/shoulder_impingement.png', alt:'Импиджмент синдром плеча', cap:'Импиджмент: конфликт структур, провоцирующий боль.' },
    { src:'./assets/img/subacromial_pain_arc.jpg', alt:'Болевая дуга', cap:'Субакромиальная боль: “болевая дуга” при подъёме руки.' },
    { src:'./assets/img/chondromalacia_patella.png', alt:'Хондромаляция', cap:'Колено: хондромаляция надколенника (схема).' },
    { src:'./assets/img/knee_joint_anatomy_labeled.jpg', alt:'Анатомия колена', cap:'Связки, мениски, суставной хрящ — ключевые ориентиры.' },
    { src:'./assets/img/knee_uvt_diagram.jpg', alt:'Схема УВТ', cap:'Схема зон воздействия УВТ на коленном суставе.' },
    { src:'./assets/img/knee_anatomy_full.jpg', alt:'Анатомия колена (полная)', cap:'Мышцы/связки — для понимания источника боли.' },
  ];

  const sliderRoot = document.querySelector('[data-slider]');
  if (sliderRoot) {
    const img = sliderRoot.querySelector('.slider__img');
    const cap = sliderRoot.querySelector('.slider__cap');
    const prev = sliderRoot.querySelector('[data-prev]');
    const next = sliderRoot.querySelector('[data-next]');
    const thumbs = document.querySelector('.thumbs');

    let idx = 0;
    const render = () => {
      const s = slides[idx];
      img.src = s.src; img.alt = s.alt; cap.textContent = s.cap;
      thumbs?.querySelectorAll('.thumb').forEach((t,i)=>t.classList.toggle('is-active', i===idx));
    };
    const go = (d) => { idx = (idx + d + slides.length) % slides.length; render(); };
    prev?.addEventListener('click', ()=>go(-1));
    next?.addEventListener('click', ()=>go(1));

    if (thumbs) {
      thumbs.innerHTML = slides.slice(0,6).map((s,i)=>`
        <button class="thumb ${i===0?'is-active':''}" type="button" aria-label="Слайд ${i+1}">
          <img src="${s.src}" alt="${s.alt}">
        </button>`).join('');
      thumbs.querySelectorAll('.thumb').forEach((b,i)=>b.addEventListener('click', ()=>{ idx=i; render(); }));
    }

    document.addEventListener('keydown', (e) => {
      const r = sliderRoot.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });

    render();
  }
})();