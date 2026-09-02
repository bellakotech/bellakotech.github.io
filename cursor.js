(function(){
  const canUseCustom = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canUseCustom) return;

  const el = document.getElementById('custom-cursor');
  if (!el) return;
  // enable global class so CSS can hide native cursor except in form controls
  document.documentElement.classList.add('has-custom-cursor');
  el.style.display = 'block';
  const outer = el.querySelector('.cursor-outer');
  const inner = el.querySelector('.cursor-inner');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let posX = mouseX;
  let posY = mouseY;
  let isDown = false;
  let isDragging = false;
  let lastDownPos = {x:0,y:0};
  let targetX = mouseX;
  let targetY = mouseY;

  const lerp = (a,b,n) => (1-n)*a + n*b;

  // use pointermove for better cross-browser consistency
  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    targetX = mouseX;
    targetY = mouseY + getScrollY();
  }, {passive:true});

  const getScrollY = () => {
    const root = document.scrollingElement || document.documentElement || document.body;
    return root ? (root.scrollTop || window.scrollY || 0) : (window.scrollY || 0);
  };

  // Keep the custom cursor aligned with both mouse movement and page scrolling.
  function syncNow(){
    targetX = mouseX;
    targetY = mouseY + getScrollY();
  }
  window.addEventListener('scroll', () => {
    syncNow();
  }, {passive:true});
  window.addEventListener('resize', () => {
    syncNow();
  });

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

  window.addEventListener('pointermove', (e) => {
    if (isDown) {
      const dx = e.clientX - lastDownPos.x;
      const dy = e.clientY - lastDownPos.y;
      if (!isDragging && Math.hypot(dx,dy) > 8) {
        isDragging = true;
        el.classList.add('cursor--dragging');
      }
    }
  }, {passive:true});

  const hoverSelector = 'a, button, label, [role="button"], .btn, .clickable';
  document.addEventListener('pointerover', (e) => {
    try {
      if (e.target && e.target.closest && e.target.closest(hoverSelector)) {
        el.classList.add('cursor--hover');
      }
    } catch (err) {}
  }, {passive:true});

  document.addEventListener('pointerout', (e) => {
    try {
      // If the relatedTarget is still inside a clickable, keep hover
      const related = e.relatedTarget;
      if (!related || !related.closest || !related.closest(hoverSelector)) {
        el.classList.remove('cursor--hover');
      }
    } catch (err) {}
  }, {passive:true});

  // Pause custom cursor (show native) when focusing form controls
  function pauseForNative(){
    el.style.display = 'none';
    document.documentElement.classList.add('custom-cursor-paused');
  }
  function resumeCustom(){
    el.style.display = 'block';
    document.documentElement.classList.remove('custom-cursor-paused');
  }

  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (!t) return;
    const tag = t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable) {
      pauseForNative();
    }
  });
  document.addEventListener('focusout', (e) => {
    resumeCustom();
  });

  function updateSizeOnHover(){
    // Keep small responsiveness if needed in future
  }

  function render(){
    targetY = mouseY + getScrollY();
    posX = lerp(posX, targetX, 0.08);
    posY = lerp(posY, targetY, 0.08);
    el.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

