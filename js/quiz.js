/* =========================================================================
   quiz.js — motor de quizzes autocalificados, paginado (1 pregunta por vez)
   Uso:
     renderQuiz("id-del-contenedor", [
       { q: "Pregunta (admite $\\LaTeX$)", opts: ["a", "b", "c", "d"],
         correct: 1, explain: "Por qué la respuesta es la b." },
       ...
     ]);
   Formato alineado a las evaluaciones de Blackboard del sílabo:
   opción múltiple con retroalimentación que muestra el proceso.
   Diseñado para caber en un slide: se muestra una pregunta a la vez.
   ========================================================================= */

function renderQuiz(containerId, questions) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const name = (i) => `${containerId}-q${i}`;
  const total = questions.length;
  let page = 0;
  let graded = false;

  /* ---------- paginador ---------- */

  const pager = document.createElement("div");
  pager.className = "quiz-pager";
  pager.innerHTML = `
    <button class="btn secondary" data-page="prev" aria-label="Pregunta anterior">‹ Anterior</button>
    <span class="quiz-pos"></span>
    <button class="btn secondary" data-page="next" aria-label="Pregunta siguiente">Siguiente ›</button>`;
  container.appendChild(pager);

  const pos = pager.querySelector(".quiz-pos");
  const btnPagePrev = pager.querySelector('[data-page="prev"]');
  const btnPageNext = pager.querySelector('[data-page="next"]');

  /* ---------- tarjetas de preguntas ---------- */

  const cards = questions.map((item, i) => {
    const card = document.createElement("div");
    card.className = "quiz-q";
    card.dataset.index = i;
    card.style.display = "none";

    const opts = item.opts
      .map(
        (opt, j) => `
        <label class="opt" data-opt="${j}">
          <input type="radio" name="${name(i)}" value="${j}">
          <span>${opt}</span>
        </label>`
      )
      .join("");

    card.innerHTML = `
      <p class="q-text"><span class="q-num">${i + 1}.</span> <span>${item.q}</span></p>
      <div class="opts">${opts}</div>
      <div class="feedback"></div>`;
    container.appendChild(card);
    return card;
  });

  /* ---------- acciones y resultado ---------- */

  const actions = document.createElement("div");
  actions.className = "controls";
  actions.style.justifyContent = "center";
  actions.innerHTML = `
    <button class="btn" data-action="grade">Calificar quiz</button>
    <button class="btn secondary" data-action="reset">Reintentar</button>`;
  container.appendChild(actions);

  const result = document.createElement("div");
  result.className = "quiz-result";
  container.appendChild(result);

  /* ---------- navegación entre preguntas ---------- */

  function answeredCount() {
    return cards.filter((c) => c.querySelector("input:checked")).length;
  }

  function showPage(n) {
    page = Math.max(0, Math.min(total - 1, n));
    cards.forEach((c, i) => (c.style.display = i === page ? "" : "none"));
    pos.innerHTML = `Pregunta <b>${page + 1}</b> de ${total} · respondidas: ${answeredCount()}/${total}`;
    btnPagePrev.disabled = page === 0;
    btnPageNext.disabled = page === total - 1;
  }

  btnPagePrev.addEventListener("click", () => showPage(page - 1));
  btnPageNext.addEventListener("click", () => showPage(page + 1));

  // Al responder, avanza sola a la siguiente pregunta sin responder (si no se calificó aún).
  container.addEventListener("change", (e) => {
    if (!e.target.matches("input[type=radio]")) return;
    if (!graded) {
      const next = cards.findIndex((c, i) => i > page && !c.querySelector("input:checked"));
      setTimeout(() => showPage(next !== -1 ? next : page), 350);
    } else {
      showPage(page); // refresca el contador de respondidas
    }
  });

  /* ---------- calificación ---------- */

  actions.querySelector('[data-action="grade"]').addEventListener("click", () => {
    let correct = 0;
    let answered = 0;
    let firstPending = -1;

    cards.forEach((card) => {
      const i = Number(card.dataset.index);
      const item = questions[i];
      const chosen = card.querySelector("input:checked");
      const feedback = card.querySelector(".feedback");

      card.querySelectorAll(".opt").forEach((o) => o.classList.remove("correct", "wrong"));

      if (!chosen) {
        if (firstPending === -1) firstPending = i;
        feedback.className = "feedback show miss";
        feedback.innerHTML = "Sin responder — elige una opción.";
        return;
      }

      answered++;
      const chosenIdx = Number(chosen.value);
      const correctOpt = card.querySelector(`.opt[data-opt="${item.correct}"]`);
      correctOpt.classList.add("correct");

      if (chosenIdx === item.correct) {
        correct++;
        feedback.className = "feedback show good";
        feedback.innerHTML = `✅ <b>¡Correcto!</b> ${item.explain}`;
      } else {
        card.querySelector(`.opt[data-opt="${chosenIdx}"]`).classList.add("wrong");
        feedback.className = "feedback show miss";
        feedback.innerHTML = `❌ <b>No es esa.</b> ${item.explain}`;
      }
    });

    if (answered < total) {
      // Faltan preguntas: lleva a la primera pendiente en vez de calificar a medias.
      result.className = "quiz-result show";
      result.innerHTML = `<p>Respondiste <b>${answered} de ${total}</b>. Completa las que faltan y vuelve a calificar.</p>`;
      showPage(firstPending);
      return;
    }

    graded = true;
    const nota = Math.round((correct / total) * 100);
    result.className = "quiz-result show";
    result.innerHTML = `
      <div class="score">${correct} / ${total}</div>
      <p><b>${nota} / 100</b> — ${
        nota >= 70
          ? "¡Aprobado! 🎉 (la nota mínima del curso es 70)"
          : "Aún no llegas a 70. Navega con ‹ › para revisar la retroalimentación y reintenta."
      }</p>`;
    showPage(0);

    if (window.renderMathInElement) {
      renderMathInElement(container, KATEX_OPTS);
    }
  });

  actions.querySelector('[data-action="reset"]').addEventListener("click", () => {
    graded = false;
    container.querySelectorAll("input[type=radio]").forEach((r) => (r.checked = false));
    container.querySelectorAll(".opt").forEach((o) => o.classList.remove("correct", "wrong"));
    container.querySelectorAll(".feedback").forEach((f) => (f.className = "feedback"));
    result.className = "quiz-result";
    result.innerHTML = "";
    showPage(0);
  });

  showPage(0);

  if (window.renderMathInElement) {
    renderMathInElement(container, KATEX_OPTS);
  }
}

/* Opciones estándar de KaTeX auto-render usadas en todo el sitio. */
const KATEX_OPTS = {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
  ],
  throwOnError: false,
};
