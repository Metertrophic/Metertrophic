(() => {
  const img = document.querySelector('#portraitFallback');
  const frame = document.querySelector('#portraitFrame');
  const label = document.querySelector('#angleLabel');
  const prev = document.querySelector('#anglePrev');
  const next = document.querySelector('#angleNext');
  const controls = document.querySelector('#angleControls');
  if (!img || !frame || !label) return;

  // Ordered as a clockwise 360-degree turntable.
  const views = [
    ['01-front.png', 'FRONT'],
    ['03-three-quarter-right.png', '3/4 RIGHT'],
    ['04-right-profile.png', 'RIGHT PROFILE'],
    ['08-back-three-quarter-right.png', 'BACK 3/4 RIGHT'],
    ['06-back.png', 'BACK'],
    ['07-back-three-quarter-left.png', 'BACK 3/4 LEFT'],
    ['05-left-profile.png', 'LEFT PROFILE'],
    ['02-three-quarter-left.png', '3/4 LEFT']
  ];
  let index = 0;
  let startX = null;
  let dragRemainder = 0;
  let lastChange = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const base = 'assets/angles/';

  function show(nextIndex) {
    index = (nextIndex + views.length) % views.length;
    lastChange = Date.now();
    img.src = base + views[index][0];
    img.alt = `Metertrophic CJ portrait, ${views[index][1].toLowerCase()} view`;
    label.textContent = `${String(index + 1).padStart(2, '0')} / 08 · ${views[index][1]}`;
  }
  prev?.addEventListener('click', () => show(index - 1));
  next?.addEventListener('click', () => show(index + 1));

  frame.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    startX = event.clientX;
    dragRemainder = 0;
    frame.classList.add('is-dragging');
    frame.setPointerCapture?.(event.pointerId);
  });
  frame.addEventListener('pointermove', event => {
    if (startX === null) return;
    const delta = event.clientX - startX;
    startX = event.clientX;
    dragRemainder += delta;
    const step = 34;
    while (Math.abs(dragRemainder) >= step) {
      show(index + (dragRemainder < 0 ? 1 : -1));
      dragRemainder += dragRemainder < 0 ? step : -step;
    }
  });
  const endDrag = () => { startX = null; frame.classList.remove('is-dragging'); };
  frame.addEventListener('pointerup', endDrag);
  frame.addEventListener('pointercancel', endDrag);
  frame.addEventListener('lostpointercapture', endDrag);
  frame.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
  frame.tabIndex = 0;
  frame.setAttribute('aria-label', 'Drag or use arrow keys to rotate through eight portrait angles');

  // A gentle automatic turn when the user is not interacting; stops for reduced motion.
  if (!reducedMotion) {
    window.setInterval(() => {
      if (startX === null && !frame.matches(':hover') && Date.now() - lastChange > 9000) show(index + 1);
    }, 9000);
  }
  show(0);
})();
