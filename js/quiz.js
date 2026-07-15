/* =========================================================================
   quiz.js — motor de quizzes autocalificados
   Uso:
     renderQuiz("id-del-contenedor", [
       { q: "Pregunta (admite $\\LaTeX$)", opts: ["a", "b", "c", "d"],
         correct: 1, explain: "Por qué la respuesta es la b." },
       ...
     ]);
   Formato alineado a las evaluaciones de Blackboard del sílabo:
   opción múltiple con retroalimentación que muestra el proceso.
   ========================================================================= */

function renderQuiz(containerId, questions) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const name = (i) => `${containerId}-q${i}`;

  questions.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "quiz-q";
    card.dataset.index = i;

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
  });

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

  actions.querySelector('[data-action="grade"]').addEventListener("click", () => {
    let correct = 0;
    let answered = 0;

    container.querySelectorAll(".quiz-q").forEach((card) => {
      const i = Number(card.dataset.index);
      const item = questions[i];
      const chosen = card.querySelector("input:checked");
      const feedback = card.querySelector(".feedback");

      card.querySelectorAll(".opt").forEach((o) => o.classList.remove("correct", "wrong"));

      if (!chosen) {
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

    const total = questions.length;
    const nota = Math.round((correct / total) * 100);
    result.className = "quiz-result show";
    result.innerHTML = `
      <div class="score">${correct} / ${total}</div>
      <p><b>${nota} / 100</b> — ${
        nota >= 70
          ? "¡Aprobado! 🎉 (la nota mínima del curso es 70)"
          : answered < total
            ? "Respondiste " + answered + " de " + total + ". Completa las que faltan y vuelve a calificar."
            : "Aún no llegas a 70. Revisa la retroalimentación de cada pregunta y reintenta."
      }</p>`;

    if (window.renderMathInElement) {
      renderMathInElement(container, KATEX_OPTS);
    }
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  actions.querySelector('[data-action="reset"]').addEventListener("click", () => {
    container.querySelectorAll("input[type=radio]").forEach((r) => (r.checked = false));
    container.querySelectorAll(".opt").forEach((o) => o.classList.remove("correct", "wrong"));
    container.querySelectorAll(".feedback").forEach((f) => (f.className = "feedback"));
    result.className = "quiz-result";
    container.querySelector(".quiz-q").scrollIntoView({ behavior: "smooth", block: "center" });
  });

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
