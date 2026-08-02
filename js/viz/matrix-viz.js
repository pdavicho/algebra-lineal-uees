/* =========================================================================
   matrix-viz.js — visualizaciones interactivas de matrices
   Demos: imagen→píxeles, matriz editable con clasificación,
          suma, multiplicación por escalar y producto animado fila×columna.
   Esta librería crece clase a clase.
   ========================================================================= */

/* ---------- utilidades de construcción ---------- */

/** Crea una cuadrícula de <input> numéricos con corchetes de matriz. */
function buildMatrixInputs(parent, rows, cols, values, onChange) {
  const m = document.createElement("div");
  m.className = "matrix";
  m.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  const inputs = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const inp = document.createElement("input");
      inp.type = "number";
      inp.step = "1";
      inp.className = "cell";
      inp.value = values?.[i]?.[j] ?? 0;
      inp.dataset.i = i;
      inp.dataset.j = j;
      if (onChange) inp.addEventListener("input", onChange);
      m.appendChild(inp);
      inputs.push(inp);
    }
  }
  parent.appendChild(m);
  return { el: m, inputs, rows, cols };
}

/** Crea una cuadrícula de celdas de solo lectura. */
function buildMatrixDisplay(parent, rows, cols) {
  const m = document.createElement("div");
  m.className = "matrix";
  m.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  const cells = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const c = document.createElement("div");
      c.className = "cell";
      c.dataset.i = i;
      c.dataset.j = j;
      c.textContent = "·";
      m.appendChild(c);
      cells.push(c);
    }
  }
  parent.appendChild(m);
  return { el: m, cells, rows, cols, at: (i, j) => cells[i * cols + j] };
}

/** Lee los valores numéricos de una matriz de inputs. */
function readMatrix({ inputs, rows, cols }) {
  const A = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (const inp of inputs) {
    A[inp.dataset.i][inp.dataset.j] = Number(inp.value) || 0;
  }
  return A;
}

function randInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/* =========================================================================
   DEMO 1 — Una imagen ES una matriz
   Dibuja una carita en 16×16 píxeles en escala de grises y permite
   "revelar" con un slider los números que hay detrás de cada píxel.
   ========================================================================= */

function initPixelDemo(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const N = 16;           // imagen de N×N píxeles
  const CELL = 30;        // tamaño de cada píxel en pantalla
  const SIZE = N * CELL;

  root.innerHTML = `
    <div class="pixel-stage">
      <canvas width="${SIZE}" height="${SIZE}" aria-label="Imagen de ${N} por ${N} píxeles"></canvas>
    </div>
    <div class="controls" style="justify-content:center">
      <label>Foto</label>
      <input type="range" min="0" max="100" value="0" aria-label="Revelar la matriz de números">
      <label>Matriz de números</label>
    </div>
    <p class="step-caption">Esta “foto” es una matriz de dimensión <b>${N} × ${N}</b> — mueve el control para ver sus ${N * N} números.</p>
    <p class="hint">Cada número va de 0 (negro) a 255 (blanco). Pasa el mouse sobre un píxel para ver su valor a<sub>ij</sub>.</p>`;

  const canvas = root.querySelector("canvas");
  const slider = root.querySelector("input[type=range]");
  const caption = root.querySelector(".step-caption");
  const ctx = canvas.getContext("2d");

  // Genera la imagen procedimentalmente: una carita sonriente 😀 en 16×16.
  const off = document.createElement("canvas");
  off.width = off.height = N;
  const octx = off.getContext("2d");
  octx.fillStyle = "#f2f2f2";
  octx.fillRect(0, 0, N, N);
  octx.fillStyle = "#666";
  octx.beginPath();
  octx.arc(N / 2, N / 2, 6.4, 0, Math.PI * 2);   // cara
  octx.fill();
  octx.fillStyle = "#111";
  octx.beginPath();
  octx.arc(5.6, 6.2, 1.15, 0, Math.PI * 2);      // ojo izquierdo
  octx.arc(10.4, 6.2, 1.15, 0, Math.PI * 2);     // ojo derecho
  octx.fill();
  octx.strokeStyle = "#111";
  octx.lineWidth = 1.3;
  octx.beginPath();
  octx.arc(N / 2, 8.4, 3.4, 0.25 * Math.PI, 0.75 * Math.PI);  // sonrisa
  octx.stroke();

  const data = octx.getImageData(0, 0, N, N).data;
  const gray = [];
  for (let i = 0; i < N; i++) {
    gray.push([]);
    for (let j = 0; j < N; j++) {
      const k = (i * N + j) * 4;
      gray[i].push(Math.round((data[k] + data[k + 1] + data[k + 2]) / 3));
    }
  }

  let hover = null; // [i, j] bajo el mouse

  function draw() {
    const t = Number(slider.value) / 100; // 0 = foto, 1 = números
    ctx.clearRect(0, 0, SIZE, SIZE);

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const v = gray[i][j];
        // El color del píxel se aclara a medida que aparecen los números.
        const bg = Math.round(v + (250 - v) * t * 0.82);
        ctx.fillStyle = `rgb(${bg},${bg},${bg})`;
        ctx.fillRect(j * CELL, i * CELL, CELL, CELL);

        if (t > 0.08) {
          ctx.globalAlpha = Math.min(1, (t - 0.08) / 0.5);
          ctx.fillStyle = v < 128 ? "#1e293b" : "#475569";
          ctx.font = `600 ${9 + 2 * t}px Consolas, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(v, j * CELL + CELL / 2, i * CELL + CELL / 2);
          ctx.globalAlpha = 1;
        }
      }
    }

    if (t > 0.4) {
      ctx.strokeStyle = "rgba(100,110,140,.25)";
      ctx.lineWidth = 1;
      for (let k = 0; k <= N; k++) {
        ctx.beginPath(); ctx.moveTo(k * CELL, 0); ctx.lineTo(k * CELL, SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, k * CELL); ctx.lineTo(SIZE, k * CELL); ctx.stroke();
      }
    }

    if (hover) {
      const [i, j] = hover;
      ctx.strokeStyle = "#821436";
      ctx.lineWidth = 3;
      ctx.strokeRect(j * CELL + 1.5, i * CELL + 1.5, CELL - 3, CELL - 3);
    }
  }

  slider.addEventListener("input", draw);

  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    const scale = canvas.width / r.width; // el canvas puede estar reescalado por CSS
    const j = Math.floor(((e.clientX - r.left) * scale) / CELL);
    const i = Math.floor(((e.clientY - r.top) * scale) / CELL);
    if (i >= 0 && i < N && j >= 0 && j < N) {
      hover = [i, j];
      caption.innerHTML = `a<sub>${i + 1},${j + 1}</sub> = <b>${gray[i][j]}</b> &nbsp;(fila ${i + 1}, columna ${j + 1})`;
    }
    draw();
  });

  canvas.addEventListener("mouseleave", () => {
    hover = null;
    caption.innerHTML = `Esta “foto” es una matriz de dimensión <b>${N} × ${N}</b> — mueve el control para ver sus ${N * N} números.`;
    draw();
  });

  draw();
}

/* =========================================================================
   DEMO 2 — Explorador de matrices
   Matriz editable con filas/columnas variables; clasifica el tipo en vivo
   (fila, columna, cuadrada, identidad, nula, diagonal, triangular…).
   ========================================================================= */

function initMatrixExplorer(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = `
    <div class="controls">
      <label>Filas (m):</label>
      <select data-role="rows">${[1, 2, 3, 4].map((n) => `<option ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}</select>
      <label>Columnas (n):</label>
      <select data-role="cols">${[1, 2, 3, 4].map((n) => `<option ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}</select>
      <button class="btn secondary" data-role="identidad">Identidad</button>
      <button class="btn secondary" data-role="nula">Nula</button>
      <button class="btn secondary" data-role="aleatoria">Aleatoria</button>
    </div>
    <div class="matrix-wrap">
      <div>
        <div data-role="matrix-host"></div>
        <div class="dim-tag" data-role="dim"></div>
      </div>
    </div>
    <p class="step-caption" data-role="tipo"></p>
    <p class="hint">Edita los valores o cambia las dimensiones: la clasificación se actualiza sola.
       Haz clic en una celda para ver su nombre a<sub>ij</sub>.</p>`;

  const host = root.querySelector('[data-role="matrix-host"]');
  const selRows = root.querySelector('[data-role="rows"]');
  const selCols = root.querySelector('[data-role="cols"]');
  const dimTag = root.querySelector('[data-role="dim"]');
  const tipoTag = root.querySelector('[data-role="tipo"]');

  let grid = null;

  function clasificar(A) {
    const m = A.length, n = A[0].length;
    const tipos = [];
    const esCuadrada = m === n;

    if (m === 1 && n === 1) tipos.push("matriz de un solo elemento (1×1)");
    else if (m === 1) tipos.push("matriz <b>fila</b>");
    else if (n === 1) tipos.push("matriz <b>columna</b>");

    const nula = A.every((f) => f.every((v) => v === 0));
    if (nula) tipos.push("matriz <b>nula</b> (todos sus elementos son 0)");

    if (esCuadrada) {
      tipos.push("matriz <b>cuadrada</b>");
      if (!nula) {
        const diagonal = A.every((f, i) => f.every((v, j) => i === j || v === 0));
        const identidad = diagonal && A.every((f, i) => f[i] === 1);
        const triSup = A.every((f, i) => f.every((v, j) => j >= i || v === 0));
        const triInf = A.every((f, i) => f.every((v, j) => j <= i || v === 0));
        const simetrica = A.every((f, i) => f.every((v, j) => v === A[j][i]));
        if (identidad) tipos.push("es la <b>identidad</b> I<sub>" + m + "</sub> 🌟");
        else if (diagonal) tipos.push("matriz <b>diagonal</b>");
        else {
          if (triSup) tipos.push("<b>triangular superior</b>");
          if (triInf) tipos.push("<b>triangular inferior</b>");
        }
        if (simetrica && !identidad && !diagonal) tipos.push("<b>simétrica</b> (a<sub>ij</sub> = a<sub>ji</sub>)");
      }
    } else if (m > 1 && n > 1) {
      tipos.push("matriz <b>rectangular</b>");
    }
    return tipos;
  }

  function actualizar() {
    const A = readMatrix(grid);
    dimTag.textContent = `dimensión ${grid.rows} × ${grid.cols} · ${grid.rows * grid.cols} elementos`;
    tipoTag.innerHTML = "Tipo: " + clasificar(A).join(" · ");
  }

  function reconstruir(valores) {
    const rows = Number(selRows.value);
    const cols = Number(selCols.value);
    host.innerHTML = "";
    grid = buildMatrixInputs(host, rows, cols, valores, actualizar);
    grid.inputs.forEach((inp) => {
      inp.addEventListener("focus", () => {
        const i = Number(inp.dataset.i) + 1, j = Number(inp.dataset.j) + 1;
        tipoTag.innerHTML = `Esa celda se llama <b>a<sub>${i}${j}</sub></b>: fila ${i}, columna ${j}. Su valor es ${inp.value || 0}.`;
      });
      inp.addEventListener("blur", actualizar);
    });
    actualizar();
  }

  selRows.addEventListener("change", () => reconstruir());
  selCols.addEventListener("change", () => reconstruir());

  root.querySelector('[data-role="identidad"]').addEventListener("click", () => {
    const n = Math.max(Number(selRows.value), Number(selCols.value));
    selRows.value = n; selCols.value = n;
    reconstruir(Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))));
  });

  root.querySelector('[data-role="nula"]').addEventListener("click", () => {
    reconstruir(Array.from({ length: Number(selRows.value) }, () => Array(Number(selCols.value)).fill(0)));
  });

  root.querySelector('[data-role="aleatoria"]').addEventListener("click", () => {
    reconstruir(
      Array.from({ length: Number(selRows.value) }, () =>
        Array.from({ length: Number(selCols.value) }, () => randInt(-5, 9))
      )
    );
  });

  reconstruir([[2, -1, 0], [4, 5, 3], [0, 7, 1]]);
}

/* =========================================================================
   DEMO 3 — Suma de matrices (elemento a elemento)
   Al pasar el mouse por una celda del resultado, se iluminan las celdas
   correspondientes de A y B.
   ========================================================================= */

function initMatrixSum(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = `
    <div class="matrix-wrap">
      <div><div data-role="A"></div><div class="matrix-label">A</div></div>
      <span class="op-symbol">+</span>
      <div><div data-role="B"></div><div class="matrix-label">B</div></div>
      <span class="op-symbol">=</span>
      <div><div data-role="C"></div><div class="matrix-label">A + B</div></div>
    </div>
    <p class="step-caption" data-role="cap">Pasa el mouse por el resultado para ver de dónde sale cada elemento.</p>`;

  const R = 2, C = 2;
  const A = buildMatrixInputs(root.querySelector('[data-role="A"]'), R, C, [[3, -1], [2, 5]], recalc);
  const B = buildMatrixInputs(root.querySelector('[data-role="B"]'), R, C, [[1, 4], [-2, 0]], recalc);
  const S = buildMatrixDisplay(root.querySelector('[data-role="C"]'), R, C);
  const cap = root.querySelector('[data-role="cap"]');

  function recalc() {
    const a = readMatrix(A), b = readMatrix(B);
    for (let i = 0; i < R; i++)
      for (let j = 0; j < C; j++) S.at(i, j).textContent = a[i][j] + b[i][j];
  }

  S.cells.forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
      const i = Number(cell.dataset.i), j = Number(cell.dataset.j);
      const a = readMatrix(A), b = readMatrix(B);
      A.inputs[i * C + j].classList.add("hl-row");
      B.inputs[i * C + j].classList.add("hl-col");
      cell.classList.add("hl-out");
      cap.innerHTML = `c<sub>${i + 1}${j + 1}</sub> = a<sub>${i + 1}${j + 1}</sub> + b<sub>${i + 1}${j + 1}</sub> = ${a[i][j]} + ${b[i][j]} = <b>${a[i][j] + b[i][j]}</b>`;
    });
    cell.addEventListener("mouseleave", () => {
      root.querySelectorAll(".hl-row, .hl-col, .hl-out").forEach((el) =>
        el.classList.remove("hl-row", "hl-col", "hl-out"));
      cap.textContent = "Pasa el mouse por el resultado para ver de dónde sale cada elemento.";
    });
  });

  recalc();
}

/* =========================================================================
   DEMO 4 — Multiplicación por escalar
   Un slider k multiplica toda la matriz en vivo.
   ========================================================================= */

function initScalarDemo(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = `
    <div class="controls" style="justify-content:center">
      <label>Escalar k = <b data-role="kval">2</b></label>
      <input type="range" min="-4" max="4" step="1" value="2" data-role="k">
    </div>
    <div class="matrix-wrap">
      <span class="op-symbol" data-role="ksym">2 ·</span>
      <div><div data-role="A"></div><div class="matrix-label">A</div></div>
      <span class="op-symbol">=</span>
      <div><div data-role="kA"></div><div class="matrix-label">k·A</div></div>
    </div>
    <p class="hint">El escalar multiplica <b>cada uno</b> de los elementos. Observa qué pasa con k = 0, k = 1 y k negativo.</p>`;

  const A = buildMatrixInputs(root.querySelector('[data-role="A"]'), 2, 2, [[1, -2], [3, 0]], recalc);
  const KA = buildMatrixDisplay(root.querySelector('[data-role="kA"]'), 2, 2);
  const slider = root.querySelector('[data-role="k"]');
  const kval = root.querySelector('[data-role="kval"]');
  const ksym = root.querySelector('[data-role="ksym"]');

  function recalc() {
    const k = Number(slider.value);
    kval.textContent = k;
    ksym.textContent = `${k} ·`;
    const a = readMatrix(A);
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++) KA.at(i, j).textContent = k * a[i][j];
  }

  slider.addEventListener("input", recalc);
  recalc();
}

/* =========================================================================
   DEMO 5 — Producto de matrices, paso a paso
   Anima fila×columna: ilumina la fila de A y la columna de B que producen
   cada elemento del resultado, mostrando la cuenta completa.
   ========================================================================= */

function initMatrixProduct(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = `
    <div class="controls">
      <label>A:</label>
      <select data-role="m">${[2, 3].map((n) => `<option ${n === 2 ? "selected" : ""}>${n}</option>`).join("")}</select>
      <span>×</span>
      <select data-role="n">${[2, 3].map((n) => `<option ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}</select>
      <label style="margin-left:1rem">B:</label>
      <span data-role="bdim" style="font-family:var(--mono);font-weight:600"></span>
      <label style="margin-left:1rem">columnas de B:</label>
      <select data-role="p">${[2, 3].map((n) => `<option ${n === 2 ? "selected" : ""}>${n}</option>`).join("")}</select>
    </div>
    <div class="matrix-wrap">
      <div><div data-role="A"></div><div class="matrix-label">A</div><div class="dim-tag" data-role="dimA"></div></div>
      <span class="op-symbol">×</span>
      <div><div data-role="B"></div><div class="matrix-label">B</div><div class="dim-tag" data-role="dimB"></div></div>
      <span class="op-symbol">=</span>
      <div><div data-role="C"></div><div class="matrix-label">A·B</div><div class="dim-tag" data-role="dimC"></div></div>
    </div>
    <p class="step-caption" data-role="cap">Presiona “Siguiente paso” para calcular el producto celda por celda.</p>
    <div class="controls" style="justify-content:center">
      <button class="btn" data-role="step">Siguiente paso ▸</button>
      <button class="btn secondary" data-role="auto">▶ Automático</button>
      <button class="btn secondary" data-role="reset">↺ Reiniciar</button>
    </div>
    <p class="hint">Regla de oro: la <b>fila i de A</b> “choca” con la <b>columna j de B</b> — se multiplican
       elemento a elemento y se suman. Por eso las columnas de A deben coincidir con las filas de B.</p>`;

  const selM = root.querySelector('[data-role="m"]');
  const selN = root.querySelector('[data-role="n"]');
  const selP = root.querySelector('[data-role="p"]');
  const cap = root.querySelector('[data-role="cap"]');
  const btnStep = root.querySelector('[data-role="step"]');
  const btnAuto = root.querySelector('[data-role="auto"]');
  const btnReset = root.querySelector('[data-role="reset"]');

  let A, B, C, step, timer = null;

  function build() {
    stopAuto();
    const m = Number(selM.value), n = Number(selN.value), p = Number(selP.value);
    root.querySelector('[data-role="bdim"]').textContent = `${n} × ${p}`;
    root.querySelector('[data-role="dimA"]').textContent = `${m} × ${n}`;
    root.querySelector('[data-role="dimB"]').textContent = `${n} × ${p}`;
    root.querySelector('[data-role="dimC"]').textContent = `${m} × ${p}`;

    const hostA = root.querySelector('[data-role="A"]');
    const hostB = root.querySelector('[data-role="B"]');
    const hostC = root.querySelector('[data-role="C"]');
    hostA.innerHTML = hostB.innerHTML = hostC.innerHTML = "";

    A = buildMatrixInputs(hostA, m, n, Array.from({ length: m }, () => Array.from({ length: n }, () => randInt(-2, 5))), resetProgress);
    B = buildMatrixInputs(hostB, n, p, Array.from({ length: n }, () => Array.from({ length: p }, () => randInt(-2, 5))), resetProgress);
    C = buildMatrixDisplay(hostC, m, p);
    resetProgress();
  }

  function resetProgress() {
    stopAuto();
    step = 0;
    C.cells.forEach((c) => { c.textContent = "?"; c.classList.remove("done", "hl-out"); });
    clearHighlights();
    btnStep.disabled = false;
    cap.innerHTML = "Presiona “Siguiente paso” para calcular el producto celda por celda.";
  }

  function clearHighlights() {
    root.querySelectorAll(".hl-row, .hl-col, .hl-out").forEach((el) =>
      el.classList.remove("hl-row", "hl-col", "hl-out"));
  }

  function doStep() {
    const m = A.rows, n = A.cols, p = B.cols;
    const total = m * p;
    if (step >= total) return;

    clearHighlights();
    const i = Math.floor(step / p);
    const j = step % p;
    const a = readMatrix(A), b = readMatrix(B);

    for (let k = 0; k < n; k++) {
      A.inputs[i * n + k].classList.add("hl-row");
      B.inputs[k * p + j].classList.add("hl-col");
    }

    const terms = [];
    let sum = 0;
    for (let k = 0; k < n; k++) {
      terms.push(`(${a[i][k]})·(${b[k][j]})`);
      sum += a[i][k] * b[k][j];
    }

    const cell = C.at(i, j);
    cell.textContent = sum;
    cell.classList.add("hl-out");
    cap.innerHTML = `c<sub>${i + 1}${j + 1}</sub> = fila ${i + 1} de A · columna ${j + 1} de B = ${terms.join(" + ")} = <b>${sum}</b>`;

    // Marca como completadas las celdas de pasos anteriores.
    for (let s = 0; s < step; s++) {
      C.at(Math.floor(s / p), s % p).classList.add("done");
    }

    step++;
    if (step >= total) {
      btnStep.disabled = true;
      stopAuto();
      cap.innerHTML += " &nbsp;🎉 ¡Producto completo!";
    }
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; btnAuto.textContent = "▶ Automático"; }
  }

  btnStep.addEventListener("click", doStep);
  btnReset.addEventListener("click", resetProgress);
  btnAuto.addEventListener("click", () => {
    if (timer) { stopAuto(); return; }
    if (btnStep.disabled) resetProgress();
    btnAuto.textContent = "⏸ Pausar";
    doStep();
    timer = setInterval(() => {
      if (btnStep.disabled) stopAuto();
      else doStep();
    }, 2200);
  });
  selM.addEventListener("change", build);
  selN.addEventListener("change", build);
  selP.addEventListener("change", build);

  build();
}

/* =========================================================================
   DEMO 6 — Eliminación de Gauss-Jordan, paso a paso
   Reduce una matriz aumentada [A|b] a su forma escalonada reducida (RREF)
   usando pivoteo parcial, un renglón elemental por clic, hasta leer la
   solución directamente en la última columna.
   ========================================================================= */

function fmtNum(x) {
  if (Math.abs(x) < 1e-9) x = 0;
  const r = Math.round(x * 10000) / 10000;
  return Number.isInteger(r) ? String(r) : String(parseFloat(r.toFixed(2)));
}

function buildAugmentedInputs(parent, rows, cols, values, onChange) {
  const grid = buildMatrixInputs(parent, rows, cols, values, onChange);
  grid.inputs.forEach((inp) => {
    if (Number(inp.dataset.j) === cols - 1) inp.classList.add("aug-sep");
  });
  return grid;
}

/** Simula Gauss-Jordan con pivoteo parcial sobre una copia de M y devuelve
    la lista de operaciones elementales de fila necesarias para llegar al RREF. */
function planGaussJordan(M0) {
  const M = M0.map((f) => f.slice());
  const rows = M.length, cols = M[0].length;
  const tasks = [];

  for (let col = 0; col < rows; col++) {
    let piv = col;
    for (let r = col + 1; r < rows; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    }
    if (Math.abs(M[piv][col]) < 1e-9) continue; // columna sin pivote (sistema singular)

    if (piv !== col) {
      [M[col], M[piv]] = [M[piv], M[col]];
      tasks.push({ type: "swap", a: col, b: piv, snapshot: M.map((f) => f.slice()) });
    }

    const pivVal = M[col][col];
    if (Math.abs(pivVal - 1) > 1e-9) {
      for (let j = 0; j < cols; j++) M[col][j] = M[col][j] / pivVal;
      tasks.push({ type: "norm", row: col, pivVal, snapshot: M.map((f) => f.slice()) });
    }

    for (let r = 0; r < rows; r++) {
      if (r === col) continue;
      const factor = M[r][col];
      if (Math.abs(factor) < 1e-9) continue;
      for (let j = 0; j < cols; j++) M[r][j] = M[r][j] - factor * M[col][j];
      tasks.push({ type: "elim", target: r, source: col, factor, snapshot: M.map((f) => f.slice()) });
    }
  }
  return { tasks, final: M };
}

function initGaussJordan(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const DEFAULT = [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]];
  const ROWS = 3, COLS = 4;

  root.innerHTML = `
    <div class="matrix-wrap">
      <div><div data-role="host"></div><div class="matrix-label">[ A | b ]</div></div>
    </div>
    <p class="step-caption" data-role="cap">Edita el sistema si quieres, o presiona "Siguiente paso" para reducirlo.</p>
    <div class="controls" style="justify-content:center">
      <button class="btn" data-role="step">Siguiente paso ▸</button>
      <button class="btn secondary" data-role="auto">▶ Automático</button>
      <button class="btn secondary" data-role="reset">↺ Reiniciar</button>
    </div>
    <p class="hint">Cada clic aplica <b>una</b> operación elemental de fila (intercambiar, normalizar el pivote
       o eliminar) hasta llegar a la forma escalonada reducida — ahí la solución se lee directo en la última columna.</p>`;

  const host = root.querySelector('[data-role="host"]');
  const cap = root.querySelector('[data-role="cap"]');
  const btnStep = root.querySelector('[data-role="step"]');
  const btnAuto = root.querySelector('[data-role="auto"]');
  const btnReset = root.querySelector('[data-role="reset"]');

  let grid, savedOriginal = DEFAULT.map((f) => f.slice()), tasks, taskIdx, timer = null;

  function paint(M) {
    grid.inputs.forEach((inp) => {
      inp.value = fmtNum(M[inp.dataset.i][inp.dataset.j]);
    });
  }

  function clearHighlights() {
    grid.inputs.forEach((inp) => inp.classList.remove("hl-row", "hl-col", "hl-out"));
  }

  /** El usuario terminó de editar una celda: esos valores pasan a ser el sistema guardado. */
  function onEdit() {
    if (taskIdx !== 0) return; // no debería poder pasar (inputs deshabilitados), por seguridad
    savedOriginal = readMatrix(grid);
    tasks = planGaussJordan(savedOriginal).tasks;
    btnStep.disabled = tasks.length === 0;
  }

  /** (Re)pinta el sistema guardado y prepara el plan de pasos desde cero. */
  function build() {
    stopAuto();
    if (!grid) {
      grid = buildAugmentedInputs(host, ROWS, COLS, DEFAULT, onEdit);
    }
    grid.inputs.forEach((inp) => { inp.disabled = false; });
    paint(savedOriginal);
    tasks = planGaussJordan(savedOriginal).tasks;
    taskIdx = 0;
    clearHighlights();
    btnStep.disabled = tasks.length === 0;
    cap.innerHTML = tasks.length
      ? `Sistema listo: ${tasks.length} operaciones de fila hasta el RREF. Presiona "Siguiente paso".`
      : "Este sistema ya está en forma escalonada reducida.";
  }

  function doStep() {
    if (taskIdx >= tasks.length) return;
    if (taskIdx === 0) grid.inputs.forEach((inp) => { inp.disabled = true; }); // congela la edición mientras se reduce
    clearHighlights();
    const t = tasks[taskIdx];

    if (t.type === "swap") {
      cap.innerHTML = `<b>F${t.a + 1} ↔ F${t.b + 1}</b> — llevamos el mayor valor absoluto a la fila del pivote (pivoteo parcial).`;
      grid.inputs.forEach((inp) => {
        if (Number(inp.dataset.i) === t.a) inp.classList.add("hl-row");
        if (Number(inp.dataset.i) === t.b) inp.classList.add("hl-col");
      });
    } else if (t.type === "norm") {
      cap.innerHTML = `<b>F${t.row + 1} → F${t.row + 1} ÷ ${fmtNum(t.pivVal)}</b> — el pivote de la fila ${t.row + 1} queda en 1.`;
      grid.inputs.forEach((inp) => { if (Number(inp.dataset.i) === t.row) inp.classList.add("hl-out"); });
    } else {
      cap.innerHTML = `<b>F${t.target + 1} → F${t.target + 1} − (${fmtNum(t.factor)})·F${t.source + 1}</b> — hacemos 0 el elemento debajo/encima del pivote.`;
      grid.inputs.forEach((inp) => {
        if (Number(inp.dataset.i) === t.source) inp.classList.add("hl-col");
        if (Number(inp.dataset.i) === t.target) inp.classList.add("hl-out");
      });
    }

    paint(t.snapshot);
    taskIdx++;

    if (taskIdx >= tasks.length) {
      btnStep.disabled = true;
      stopAuto();
      const sol = t.snapshot.map((f) => f[COLS - 1]);
      cap.innerHTML = `🎉 RREF alcanzada — solución: ` + sol.map((v, i) => `x<sub>${i + 1}</sub> = <b>${fmtNum(v)}</b>`).join(", ");
    }
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; btnAuto.textContent = "▶ Automático"; }
  }

  btnStep.addEventListener("click", doStep);
  btnReset.addEventListener("click", build);
  btnAuto.addEventListener("click", () => {
    if (timer) { stopAuto(); return; }
    if (btnStep.disabled) build();
    btnAuto.textContent = "⏸ Pausar";
    doStep();
    timer = setInterval(() => {
      if (btnStep.disabled) stopAuto();
      else doStep();
    }, 1800);
  });

  build();
}

/* =========================================================================
   DEMO 7 — Calculadora de inversas 2×2 (fórmula directa)
   Recalcula det(A) y A⁻¹ en vivo mientras se edita A; si det = 0 muestra
   que la matriz es singular en vez de romperse.
   ========================================================================= */

function initInverseCalc2x2(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const DEFAULT = [[3, 1], [2, 1]];

  root.innerHTML = `
    <div class="matrix-wrap">
      <div><div data-role="A"></div><div class="matrix-label">A</div></div>
      <span class="op-symbol" data-role="detsym">det = ?</span>
      <div><div data-role="Inv"></div><div class="matrix-label">A⁻¹</div></div>
    </div>
    <p class="step-caption" data-role="cap"></p>
    <div class="controls" style="justify-content:center">
      <button class="btn secondary" data-role="singular">Probar un caso SIN inversa</button>
      <button class="btn secondary" data-role="reset">↺ Reiniciar</button>
    </div>
    <p class="hint">Truco de la fórmula: intercambia la diagonal principal (a↔d), cambia el signo de los
       otros dos (b, c), y divide todo entre el determinante.</p>`;

  const A = buildMatrixInputs(root.querySelector('[data-role="A"]'), 2, 2, DEFAULT, recalc);
  const Inv = buildMatrixDisplay(root.querySelector('[data-role="Inv"]'), 2, 2);
  const detSym = root.querySelector('[data-role="detsym"]');
  const cap = root.querySelector('[data-role="cap"]');

  function recalc() {
    const M = readMatrix(A);
    const a = M[0][0], b = M[0][1], c = M[1][0], d = M[1][1];
    const det = a * d - b * c;
    detSym.innerHTML = `det = ${fmtNum(det)}`;

    if (Math.abs(det) < 1e-9) {
      Inv.cells.forEach((cell) => { cell.textContent = "—"; });
      cap.innerHTML = `⚠️ det(A) = 0 → <b>A NO tiene inversa</b> (es singular).`;
    } else {
      const inv = [[d / det, -b / det], [-c / det, a / det]];
      Inv.cells.forEach((cell) => {
        const i = Number(cell.dataset.i), j = Number(cell.dataset.j);
        cell.textContent = fmtNum(inv[i][j]);
      });
      cap.innerHTML = `det ≠ 0 → A⁻¹ = (1/${fmtNum(det)})·[[d,−b],[−c,a]]. Verifica multiplicando A·A⁻¹ = I.`;
    }
  }

  root.querySelector('[data-role="singular"]').addEventListener("click", () => {
    const scale = randInt(2, 3);
    const r1 = [randInt(1, 4), randInt(1, 4)];
    A.inputs[0].value = r1[0]; A.inputs[1].value = r1[1];
    A.inputs[2].value = r1[0] * scale; A.inputs[3].value = r1[1] * scale;
    recalc();
  });

  root.querySelector('[data-role="reset"]').addEventListener("click", () => {
    A.inputs[0].value = DEFAULT[0][0]; A.inputs[1].value = DEFAULT[0][1];
    A.inputs[2].value = DEFAULT[1][0]; A.inputs[3].value = DEFAULT[1][1];
    recalc();
  });

  recalc();
}

/* =========================================================================
   DEMO 8 — Inversa por Gauss-Jordan sobre [A | I]
   Mismo motor que planGaussJordan (Demo 6): en vez de pegar A con un vector
   b, se pega con la identidad completa. Si la izquierda no llega a ser I,
   la matriz es singular (no tiene inversa).
   ========================================================================= */

function buildIdentity(n) {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
}

function buildInverseAugmentedInputs(parent, n, valuesA, onChange) {
  const identity = buildIdentity(n);
  const values = valuesA.map((row, i) => row.concat(identity[i]));
  const grid = buildMatrixInputs(parent, n, 2 * n, values, onChange);
  grid.inputs.forEach((inp) => {
    if (Number(inp.dataset.j) === n) inp.classList.add("aug-sep");
  });
  return grid;
}

function initInverseGaussJordan(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const DEFAULT2 = [[4, 3], [2, 2]];
  const DEFAULT3 = [[2, 0, 1], [1, 3, 2], [0, 1, 1]];

  root.innerHTML = `
    <div class="controls">
      <label>Tamaño de A:</label>
      <select data-role="n">${[2, 3].map((n) => `<option ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}</select>
    </div>
    <div class="matrix-wrap">
      <div><div data-role="host"></div><div class="matrix-label">[ A | I ]</div></div>
    </div>
    <p class="step-caption" data-role="cap">Edita A si quieres, o presiona "Siguiente paso" para reducirla.</p>
    <div class="controls" style="justify-content:center">
      <button class="btn" data-role="step">Siguiente paso ▸</button>
      <button class="btn secondary" data-role="auto">▶ Automático</button>
      <button class="btn secondary" data-role="reset">↺ Reiniciar</button>
    </div>
    <p class="hint">Mismas 3 operaciones elementales de fila de la Clase 01. Cuando la izquierda llegue a ser
       I, la derecha ES A⁻¹. Si una columna se queda sin pivote, A no tiene inversa.</p>`;

  const host = root.querySelector('[data-role="host"]');
  const selN = root.querySelector('[data-role="n"]');
  const cap = root.querySelector('[data-role="cap"]');
  const btnStep = root.querySelector('[data-role="step"]');
  const btnAuto = root.querySelector('[data-role="auto"]');
  const btnReset = root.querySelector('[data-role="reset"]');

  let grid, n, savedA, tasks, taskIdx, timer = null;

  function paint(M) {
    grid.inputs.forEach((inp) => { inp.value = fmtNum(M[inp.dataset.i][inp.dataset.j]); });
  }

  function clearHighlights() {
    grid.inputs.forEach((inp) => inp.classList.remove("hl-row", "hl-col", "hl-out"));
  }

  function rebuildPlan() {
    const augmented = savedA.map((row, i) => row.concat(buildIdentity(n)[i]));
    tasks = planGaussJordan(augmented).tasks;
    taskIdx = 0;
    btnStep.disabled = tasks.length === 0;
  }

  function onEdit() {
    if (taskIdx !== 0) return;
    const full = readMatrix(grid);
    savedA = full.map((row) => row.slice(0, n));
    rebuildPlan();
  }

  function build() {
    stopAuto();
    n = Number(selN.value);
    savedA = (n === 3 ? DEFAULT3 : DEFAULT2).map((r) => r.slice());
    host.innerHTML = "";
    grid = buildInverseAugmentedInputs(host, n, savedA, onEdit);
    rebuildPlan();
    clearHighlights();
    cap.innerHTML = tasks.length
      ? `Sistema listo: ${tasks.length} operaciones hasta el RREF. Presiona "Siguiente paso".`
      : "Esta matriz ya está reducida.";
  }

  function doStep() {
    if (taskIdx >= tasks.length) return;
    if (taskIdx === 0) grid.inputs.forEach((inp) => { inp.disabled = true; });
    clearHighlights();
    const t = tasks[taskIdx];

    if (t.type === "swap") {
      cap.innerHTML = `<b>F${t.a + 1} ↔ F${t.b + 1}</b> — pivoteo parcial: subimos el mayor valor absoluto.`;
      grid.inputs.forEach((inp) => {
        if (Number(inp.dataset.i) === t.a) inp.classList.add("hl-row");
        if (Number(inp.dataset.i) === t.b) inp.classList.add("hl-col");
      });
    } else if (t.type === "norm") {
      cap.innerHTML = `<b>F${t.row + 1} → F${t.row + 1} ÷ ${fmtNum(t.pivVal)}</b> — normalizamos el pivote a 1.`;
      grid.inputs.forEach((inp) => { if (Number(inp.dataset.i) === t.row) inp.classList.add("hl-out"); });
    } else {
      cap.innerHTML = `<b>F${t.target + 1} → F${t.target + 1} − (${fmtNum(t.factor)})·F${t.source + 1}</b> — hacemos 0 arriba/abajo del pivote.`;
      grid.inputs.forEach((inp) => {
        if (Number(inp.dataset.i) === t.source) inp.classList.add("hl-col");
        if (Number(inp.dataset.i) === t.target) inp.classList.add("hl-out");
      });
    }

    paint(t.snapshot);
    taskIdx++;

    if (taskIdx >= tasks.length) {
      btnStep.disabled = true;
      stopAuto();
      const M = t.snapshot;
      const leftIsIdentity = M.every((row, i) =>
        row.slice(0, n).every((v, j) => Math.abs(v - (i === j ? 1 : 0)) < 1e-6));
      cap.innerHTML = leftIsIdentity
        ? `🎉 Izquierda = I → la derecha ES A⁻¹.`
        : `⚠️ Quedó una fila de ceros del lado izquierdo → <b>A NO tiene inversa</b> (singular, det(A)=0).`;
    }
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; btnAuto.textContent = "▶ Automático"; }
  }

  btnStep.addEventListener("click", doStep);
  btnReset.addEventListener("click", build);
  selN.addEventListener("change", build);
  btnAuto.addEventListener("click", () => {
    if (timer) { stopAuto(); return; }
    if (btnStep.disabled) build();
    btnAuto.textContent = "⏸ Pausar";
    doStep();
    timer = setInterval(() => {
      if (btnStep.disabled) stopAuto();
      else doStep();
    }, 1800);
  });

  build();
}

/* =========================================================================
   DEMO 9 — Método de Gauss clásico: eliminación hacia adelante + sustitución
   hacia atrás como fase separada (a diferencia de Gauss-Jordan de la Demo 6,
   aquí NO se limpia arriba del pivote — se detiene en la forma escalonada y
   despeja "hacia arriba" en un segundo momento, mostrando el ahorro de
   operaciones frente a Gauss-Jordan).
   ========================================================================= */

/** Como planGaussJordan, pero solo elimina POR DEBAJO del pivote (nunca arriba):
    esa es la única diferencia mecánica entre Gauss y Gauss-Jordan. */
function planGaussForward(M0) {
  const M = M0.map((f) => f.slice());
  const rows = M.length, cols = M[0].length;
  const tasks = [];

  for (let col = 0; col < rows; col++) {
    let piv = col;
    for (let r = col + 1; r < rows; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    }
    if (Math.abs(M[piv][col]) < 1e-9) continue;

    if (piv !== col) {
      [M[col], M[piv]] = [M[piv], M[col]];
      tasks.push({ type: "swap", a: col, b: piv, snapshot: M.map((f) => f.slice()) });
    }

    const pivVal = M[col][col];
    if (Math.abs(pivVal - 1) > 1e-9) {
      for (let j = 0; j < cols; j++) M[col][j] = M[col][j] / pivVal;
      tasks.push({ type: "norm", row: col, pivVal, snapshot: M.map((f) => f.slice()) });
    }

    for (let r = col + 1; r < rows; r++) {   // <- SOLO debajo (la diferencia con Gauss-Jordan)
      const factor = M[r][col];
      if (Math.abs(factor) < 1e-9) continue;
      for (let j = 0; j < cols; j++) M[r][j] = M[r][j] - factor * M[col][j];
      tasks.push({ type: "elim", target: r, source: col, factor, snapshot: M.map((f) => f.slice()) });
    }
  }
  return { tasks, final: M };
}

function initGaussForward(rootId, customMatrix, varNames) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const DEFAULT = customMatrix || [[1, 0, 1, 5], [2, 1, 0, 3], [0, 1, 1, 2]];
  const ROWS = DEFAULT.length, COLS = DEFAULT[0].length;
  const VARS = varNames || ["x", "y", "z", "w"];

  root.innerHTML = `
    <div class="matrix-wrap">
      <div><div data-role="host"></div><div class="matrix-label">[ A | b ]</div></div>
    </div>
    <p class="step-caption" data-role="cap">Edita el sistema si quieres, o presiona "Siguiente paso".</p>
    <div class="controls" style="justify-content:center">
      <button class="btn" data-role="step">Siguiente paso ▸</button>
      <button class="btn secondary" data-role="auto">▶ Automático</button>
      <button class="btn secondary" data-role="reset">↺ Reiniciar</button>
    </div>
    <p class="hint">Primero elimina SOLO hacia abajo (forma escalonada) — a diferencia de la Clase 01,
       aquí NO se limpia arriba del pivote. Al llegar a la forma escalonada, la solución se calcula con
       sustitución hacia atrás, fila por fila desde abajo.</p>
    <div data-role="backsub" style="display:none; margin-top:1rem">
      <p class="step-caption" style="margin-bottom:.4rem"><b>🔽 Sustitución hacia atrás</b></p>
      <div data-role="backsub-lines" style="font-family:Consolas,monospace; font-size:.92rem; line-height:1.9"></div>
    </div>`;

  const host = root.querySelector('[data-role="host"]');
  const cap = root.querySelector('[data-role="cap"]');
  const btnStep = root.querySelector('[data-role="step"]');
  const btnAuto = root.querySelector('[data-role="auto"]');
  const btnReset = root.querySelector('[data-role="reset"]');
  const backsubBox = root.querySelector('[data-role="backsub"]');
  const backsubLines = root.querySelector('[data-role="backsub-lines"]');

  let grid, savedOriginal = DEFAULT.map((f) => f.slice()), tasks, taskIdx, timer = null;
  let phase = "forward"; // "forward" | "backsub" | "done"
  let backTasks = [], backIdx = 0, xVals = [];

  function paint(M) {
    grid.inputs.forEach((inp) => { inp.value = fmtNum(M[inp.dataset.i][inp.dataset.j]); });
  }

  function clearHighlights() {
    grid.inputs.forEach((inp) => inp.classList.remove("hl-row", "hl-col", "hl-out"));
  }

  function onEdit() {
    if (taskIdx !== 0 || phase !== "forward") return;
    savedOriginal = readMatrix(grid);
    tasks = planGaussForward(savedOriginal).tasks;
    btnStep.disabled = tasks.length === 0;
  }

  function build() {
    stopAuto();
    phase = "forward";
    backsubBox.style.display = "none";
    backsubLines.innerHTML = "";
    if (!grid) {
      grid = buildAugmentedInputs(host, ROWS, COLS, DEFAULT, onEdit);
    }
    grid.inputs.forEach((inp) => { inp.disabled = false; });
    paint(savedOriginal);
    tasks = planGaussForward(savedOriginal).tasks;
    taskIdx = 0;
    clearHighlights();
    btnStep.disabled = tasks.length === 0;
    cap.innerHTML = tasks.length
      ? `Sistema listo: ${tasks.length} operaciones hasta la forma escalonada. Presiona "Siguiente paso".`
      : "Este sistema ya está en forma escalonada.";
  }

  function prepareBackSub(finalM) {
    const n = ROWS;
    xVals = Array(n).fill(null);
    backTasks = [];
    for (let row = n - 1; row >= 0; row--) {
      const known = [];
      let acc = finalM[row][COLS - 1];
      for (let k = row + 1; k < n; k++) {
        acc -= finalM[row][k] * xVals[k];
        known.push(`(${fmtNum(finalM[row][k])})(${fmtNum(xVals[k])})`);
      }
      xVals[row] = acc;
      backTasks.push({ row, terms: known, value: acc });
    }
  }

  function doBackSubStep() {
    if (backIdx >= backTasks.length) return;
    const t = backTasks[backIdx];
    const name = VARS[t.row] ?? `x${t.row + 1}`;
    const line = document.createElement("div");
    line.innerHTML = t.terms.length
      ? `<b>${name}</b> = fila ${t.row + 1} despejada − (${t.terms.join(" + ")}) = <b>${fmtNum(t.value)}</b>`
      : `<b>${name}</b> = fila ${t.row + 1} directo = <b>${fmtNum(t.value)}</b>`;
    backsubLines.appendChild(line);
    cap.innerHTML = `Sustituyendo hacia atrás: <b>${name} = ${fmtNum(t.value)}</b>`;
    backIdx++;
    if (backIdx >= backTasks.length) {
      btnStep.disabled = true;
      stopAuto();
      phase = "done";
      cap.innerHTML = "🎉 Solución completa por sustitución hacia atrás: " +
        backTasks.slice().reverse().map((t) =>
          `${VARS[t.row] ?? "x" + (t.row + 1)} = <b>${fmtNum(t.value)}</b>`
        ).join(", ");
    }
  }

  function doStep() {
    if (phase === "forward") {
      if (taskIdx >= tasks.length) return;
      if (taskIdx === 0) grid.inputs.forEach((inp) => { inp.disabled = true; });
      clearHighlights();
      const t = tasks[taskIdx];

      if (t.type === "swap") {
        cap.innerHTML = `<b>F${t.a + 1} ↔ F${t.b + 1}</b> — pivoteo parcial: subimos el mayor valor absoluto.`;
        grid.inputs.forEach((inp) => {
          if (Number(inp.dataset.i) === t.a) inp.classList.add("hl-row");
          if (Number(inp.dataset.i) === t.b) inp.classList.add("hl-col");
        });
      } else if (t.type === "norm") {
        cap.innerHTML = `<b>F${t.row + 1} → F${t.row + 1} ÷ ${fmtNum(t.pivVal)}</b> — normalizamos el pivote a 1.`;
        grid.inputs.forEach((inp) => { if (Number(inp.dataset.i) === t.row) inp.classList.add("hl-out"); });
      } else {
        cap.innerHTML = `<b>F${t.target + 1} → F${t.target + 1} − (${fmtNum(t.factor)})·F${t.source + 1}</b> — hacemos 0 SOLO debajo del pivote.`;
        grid.inputs.forEach((inp) => {
          if (Number(inp.dataset.i) === t.source) inp.classList.add("hl-col");
          if (Number(inp.dataset.i) === t.target) inp.classList.add("hl-out");
        });
      }

      paint(t.snapshot);
      taskIdx++;

      if (taskIdx >= tasks.length) {
        clearHighlights();
        const M = t.snapshot;
        const hasZeroPivotRow = M.some((row) => row.slice(0, ROWS).every((v) => Math.abs(v) < 1e-6));
        if (hasZeroPivotRow) {
          btnStep.disabled = true;
          stopAuto();
          cap.innerHTML = `⚠️ Quedó una fila de ceros → el sistema NO tiene solución única (infinitas o ninguna, revisa el término independiente).`;
          return;
        }
        cap.innerHTML = `✅ Forma escalonada alcanzada — ahora sustitución hacia atrás. Presiona "Siguiente paso".`;
        phase = "backsub";
        backsubBox.style.display = "block";
        prepareBackSub(M);
        backIdx = 0;
      }
    } else if (phase === "backsub") {
      doBackSubStep();
    }
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; btnAuto.textContent = "▶ Automático"; }
  }

  btnStep.addEventListener("click", doStep);
  btnReset.addEventListener("click", build);
  btnAuto.addEventListener("click", () => {
    if (timer) { stopAuto(); return; }
    if (btnStep.disabled && phase !== "backsub") build();
    btnAuto.textContent = "⏸ Pausar";
    doStep();
    timer = setInterval(() => {
      if (btnStep.disabled) stopAuto();
      else doStep();
    }, 1800);
  });

  build();
}
