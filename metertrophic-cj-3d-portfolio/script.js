const stage = document.querySelector('#portraitStage');
const frame = document.querySelector('#portraitFrame');
const cursor = document.querySelector('.cursor');
const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');

// Cursor glow follows the pointer; portrait responds with a restrained 3D tilt.
window.addEventListener('pointermove', e => {
  if (cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
  if (!stage || !frame || innerWidth < 681) return;
  const r = stage.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5;
  const y = (e.clientY - r.top) / r.height - .5;
  frame.style.animationPlayState = 'paused';
  frame.style.transform = `translateY(-2px) rotateY(${x * 11}deg) rotateX(${-y * 8}deg)`;
});
stage?.addEventListener('pointerleave', () => { if (frame) { frame.style.animationPlayState = 'running'; frame.style.transform = ''; } });

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? '×' : '☰';
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); if (menu) menu.textContent = '☰';
}));

// Reveal sections as they enter the viewport.
const revealTargets = document.querySelectorAll('.section-label,.about-grid,.stats,.work-heading,.project,.sound-inner,.contact h2,.contact-mail');
revealTargets.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: .12 });
revealTargets.forEach(el => observer.observe(el));

// Small parallax drift for the orbit decorations.
if (stage && matchMedia('(pointer:fine)').matches) {
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    stage.querySelectorAll('.orbit').forEach((orbit, i) => orbit.style.translate = `${x * (i ? -12 : 12)}px ${y * (i ? -8 : 8)}px`);
  });
}
