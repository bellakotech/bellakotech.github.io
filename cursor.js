(function(){
  // Solo en escritorio con ratón y si el usuario no pide reducir animaciones
  const mq = q => window.matchMedia && window.matchMedia(q).matches
  if (!mq('(hover: hover) and (pointer: fine)') || mq('(prefers-reduced-motion: reduce)')) return

  const el = document.getElementById('custom-cursor');
  if (!el) return;
  // enable global class so CSS can hide native cursor except in form controls
  document.documentElement.classList.add('has-custom-cursor');
  el.style.display = 'block';

  const lerp = (a,b,n) => (1-n)*a + n*b;

  // #custom-cursor es position:fixed, así que trabajamos en coordenadas de viewport
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let posX = mouseX;
  let posY = mouseY;
  let isDown = false;
  let isDragging = false;
  let lastDownPos = {x:0,y:0};
  let rafId = 0;

  // El bucle solo corre mientras el cursor no ha alcanzado al ratón
  function render(){
    posX = lerp(posX, mouseX, 0.18);
    posY = lerp(posY, mouseY, 0.18);
    el.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
    if (Math.abs(mouseX - posX) > 0.1 || Math.abs(mouseY - posY) > 0.1) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = 0;
    }
  }
  const wake = () => { if (!rafId) rafId = requestAnimationFrame(render); };

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (isDown && !isDragging && Math.hypot(e.clientX - lastDownPos.x, e.clientY - lastDownPos.y) > 8) {
      isDragging = true;
      el.classList.add('cursor--dragging');
    }
    wake();
  }, {passive:true});

  window.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    isDown = true;
    el.classList.add('cursor--active');
    lastDownPos = {x: e.clientX, y: e.clientY};
  });

  window.addEventListener('pointerup', (e) => {
    if (e.button !== 0) return;
    isDown = false;
    el.classList.remove('cursor--active');
    if (isDragging) {
      isDragging = false;
      el.classList.remove('cursor--dragging');
    }
  });

  const hoverSelector = 'a, button, label, [role="button"], .btn, .clickable';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest && e.target.closest(hoverSelector)) el.classList.add('cursor--hover');
  }, {passive:true});
  document.addEventListener('pointerout', (e) => {
    const related = e.relatedTarget;
    if (!related || !related.closest || !related.closest(hoverSelector)) el.classList.remove('cursor--hover');
  }, {passive:true});

  // Volver al cursor nativo en formularios y en ventanas modales (<dialog> se pinta
  // en una capa superior y taparía el cursor personalizado)
  const pause = () => document.documentElement.classList.add('custom-cursor-paused');
  const resume = () => {
    if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('custom-cursor-paused');
  };
  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (t && (t.matches('input, textarea, select') || t.isContentEditable || t.closest('dialog[open]'))) pause();
  });
  document.addEventListener('focusout', () => setTimeout(resume));
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('close', resume));

  wake();
})();
