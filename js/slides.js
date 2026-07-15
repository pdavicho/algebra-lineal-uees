/* =========================================================================
   slides.js — motor de presentación del curso
   Uso: initDeck({ label: "Clase 01 · ¿Qué es una matriz?" });
   - Navegación: ← → (teclado), espacio, PageUp/Down, Home/End,
     botones en pantalla y deslizamiento táctil.
   - F: pantalla completa. La posición se guarda en el hash (#7) para
     poder recargar sin perder el slide.
   ========================================================================= */

function initDeck(opts = {}) {
  const deck = document.querySelector(".deck");
  if (!deck) return;

  document.body.classList.add("slides-mode");
  const slides = [...deck.querySelectorAll("section.slide")];
  const total = slides.length;
  let current = -1;

  /* ---------- ajuste adaptativo: todo el slide dentro de la pantalla ----------
     Si el contenido excede el área visible, se reduce con transform: scale()
     manteniéndolo centrado. Se recalcula al cambiar de slide, al redimensionar
     la ventana y cuando el contenido cambia de tamaño (demos interactivas). */

  function fitSlide(slide) {
    const inner = slide.querySelector(".slide-inner");
    if (!inner) return;
    inner.style.transform = "none";
    const cs = getComputedStyle(slide);
    const padTop = parseFloat(cs.paddingTop);
    const availH = slide.clientHeight - padTop - parseFloat(cs.paddingBottom);
    const availW = slide.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const scale = Math.min(1, availH / inner.offsetHeight, availW / inner.offsetWidth);
    if (scale >= 1) return;

    inner.style.transform = `scale(${scale})`;
    // Cuando el contenido excede el área, flexbox lo ancla arriba en vez de
    // centrarlo; se compensa con una traslación para centrar el bloque escalado.
    const sr = slide.getBoundingClientRect();
    const ir = inner.getBoundingClientRect();
    const dy = (sr.top + padTop + availH / 2) - (ir.top + ir.height / 2);
    if (Math.abs(dy) > 0.5) inner.style.transform = `translateY(${dy}px) scale(${scale})`;
  }

  const refit = () => { if (current >= 0) fitSlide(slides[current]); };
  window.addEventListener("resize", refit);

  const ro = new ResizeObserver(refit);
  slides.forEach((s) => {
    const inner = s.querySelector(".slide-inner");
    if (inner) ro.observe(inner);
  });

  /* ---------- chrome fijo ---------- */

  const brand = document.createElement("a");
  brand.className = "deck-brand";
  brand.href = "../../index.html";
  brand.title = "Ir al inicio del curso";
  brand.innerHTML = `
    <img src="../../assets/logo-uees.png" alt="UEES">
    ${opts.label ? `<span class="deck-label">${opts.label}</span>` : ""}`;
  document.body.appendChild(brand);

  const home = document.createElement("a");
  home.className = "deck-home";
  home.href = "../../index.html#clases";
  home.textContent = "⌂ Todas las clases";
  document.body.appendChild(home);

  const controls = document.createElement("div");
  controls.className = "deck-controls";
  controls.innerHTML = `
    <button data-nav="prev" title="Anterior (←)" aria-label="Slide anterior">‹</button>
    <span class="counter">1 / ${total}</span>
    <button data-nav="next" title="Siguiente (→)" aria-label="Slide siguiente">›</button>`;
  document.body.appendChild(controls);

  const progress = document.createElement("div");
  progress.className = "deck-progress";
  document.body.appendChild(progress);

  const btnPrev = controls.querySelector('[data-nav="prev"]');
  const btnNext = controls.querySelector('[data-nav="next"]');
  const counter = controls.querySelector(".counter");

  /* ---------- navegación ---------- */

  function goTo(n, dir = 1) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === current) return;
    slides.forEach((s) => s.classList.remove("active", "from-left"));
    const slide = slides[n];
    if (dir < 0) slide.classList.add("from-left");
    slide.classList.add("active");
    slide.scrollTop = 0;
    current = n;

    // Ajuste inmediato (no usar rAF: en pestañas ocultas Chrome lo pausa
    // y el slide quedaría sin escalar hasta volver a ser visible).
    fitSlide(slide);

    counter.textContent = `${n + 1} / ${total}`;
    progress.style.width = `${((n + 1) / total) * 100}%`;
    btnPrev.disabled = n === 0;
    btnNext.disabled = n === total - 1;
    history.replaceState(null, "", `#${n + 1}`);
  }

  const next = () => goTo(current + 1, 1);
  const prev = () => goTo(current - 1, -1);

  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  document.addEventListener("keydown", (e) => {
    // No interceptar cuando se escribe en las demos interactivas.
    const t = e.target;
    if (t.matches("input, select, textarea, button, [contenteditable]")) return;

    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
      case " ":
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home":
        e.preventDefault(); goTo(0, -1); break;
      case "End":
        e.preventDefault(); goTo(total - 1, 1); break;
      case "f":
      case "F":
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
        break;
    }
  });

  // Deslizamiento táctil (tablets / pizarras digitales).
  let touchX = null;
  deck.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  deck.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) (dx < 0 ? next() : prev());
    touchX = null;
  }, { passive: true });

  // Posición inicial desde el hash (#7 → slide 7), y saltos si el hash cambia.
  function goToHash() {
    const fromHash = parseInt(location.hash.slice(1), 10);
    goTo(Number.isFinite(fromHash) ? fromHash - 1 : 0);
  }
  window.addEventListener("hashchange", goToHash);
  goToHash();
}
