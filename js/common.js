/* =========================================================================
   common.js — metadatos del curso y utilidades compartidas
   Álgebra Lineal · UMAT205 · UEES
   ========================================================================= */

/* Configuración del repositorio: EDITAR con tu usuario/repositorio de GitHub
   para que funcionen los botones "Abrir en Colab" y la URL de Pages. */
const SITE_CONFIG = {
  githubUser: "pablodavid218",          // ← tu usuario de GitHub
  githubRepo: "algebra-lineal-uees",    // ← nombre del repositorio
  branch: "main",
};

function colabUrl(notebookPath) {
  const { githubUser, githubRepo, branch } = SITE_CONFIG;
  return `https://colab.research.google.com/github/${githubUser}/${githubRepo}/blob/${branch}/${notebookPath}`;
}

/* Las 16 clases del curso. Cada sesión del sílabo (8 sesiones de 2 h) se
   expande en un par: clase teórica-interactiva + clase práctica Python/IA. */
const UNIDADES = {
  1: { nombre: "Matrices y determinantes", sub: "Sesiones 1–2 del sílabo · Unidad 1" },
  2: { nombre: "Sistemas de ecuaciones lineales", sub: "Sesiones 3–4 del sílabo · Unidad 2 · incluye examen parcial" },
  3: { nombre: "Espacios vectoriales reales", sub: "Sesiones 5–8 del sílabo · Unidad 3 · incluye examen final" },
};

const COURSE = [
  {
    num: 1, unidad: 1, tipo: "teoria", sesion: "S1", rda: "RDA1",
    titulo: "¿Qué es una matriz? Definición, tipos y operaciones",
    desc: "Del pixel al dato: qué es una matriz, cómo se nombra y cómo se opera con ella. Producto de matrices animado paso a paso.",
    temas: ["1.1 Definición de matriz", "1.2 Operaciones con matrices", "1.3 Propiedades de las operaciones"],
    listo: true,
  },
  {
    num: 2, unidad: 1, tipo: "practica", sesion: "S1", rda: "RDA1",
    titulo: "NumPy: matrices como datos — una imagen ES una matriz",
    desc: "Primer Colab del curso: crear y operar matrices con NumPy, cargar una imagen y manipularla como matriz.",
    temas: ["Arreglos de NumPy", "Operaciones vectorizadas", "Imágenes en escala de grises como matrices"],
    listo: false,
  },
  {
    num: 3, unidad: 1, tipo: "teoria", sesion: "S1", rda: "RDA1",
    titulo: "Eliminación de Gauss y Gauss-Jordan",
    desc: "Operaciones elementales de fila y escalonamiento, con un visualizador paso a paso de la eliminación.",
    temas: ["1.4 Método de eliminación de Gauss y Gauss-Jordan", "Forma escalonada y escalonada reducida"],
    listo: false,
  },
  {
    num: 4, unidad: 1, tipo: "practica", sesion: "S1", rda: "RDA1",
    titulo: "Eliminación en Python: sistemas grandes",
    desc: "Programar Gauss-Jordan desde cero y compararlo con NumPy/SciPy en sistemas de cientos de variables.",
    temas: ["Implementación de la eliminación", "numpy.linalg", "Costo computacional"],
    listo: false,
  },
  {
    num: 5, unidad: 1, tipo: "teoria", sesion: "S2", rda: "RDA1",
    titulo: "Inversa y determinante de una matriz",
    desc: "La matriz inversa, el determinante y sus propiedades — con el determinante visto como factor de escala geométrico.",
    temas: ["1.5 Inversa de una matriz", "1.6 Determinante de una matriz", "1.7 Propiedades de los determinantes"],
    listo: false,
  },
  {
    num: 6, unidad: 1, tipo: "practica", sesion: "S2", rda: "RDA1",
    titulo: "El determinante en código: área, volumen y transformaciones",
    desc: "Calcular determinantes e inversas en Python y visualizar cómo una matriz transforma el plano.",
    temas: ["numpy.linalg.det / inv", "Determinante como área", "Matrices singulares en la práctica"],
    listo: false,
  },
  {
    num: 7, unidad: 2, tipo: "teoria", sesion: "S3", rda: "RDA2",
    titulo: "Sistemas de ecuaciones: la forma matricial Ax = b",
    desc: "Representar un sistema como matriz aumentada y resolverlo con Gauss. Tipos de solución: única, infinitas, ninguna.",
    temas: ["2.1 Representación matricial de un sistema", "2.2 Resolución por el método de Gauss"],
    listo: false,
  },
  {
    num: 8, unidad: 2, tipo: "practica", sesion: "S3", rda: "RDA2",
    titulo: "Sistemas reales en Python: del problema al modelo",
    desc: "Plantear y resolver problemas reales (mezclas, circuitos, tráfico) y descubrir la regresión lineal como un sistema.",
    temas: ["numpy.linalg.solve", "Planteo de problemas", "Regresión lineal = mínimos cuadrados"],
    listo: false,
  },
  {
    num: 9, unidad: 2, tipo: "teoria", sesion: "S4", rda: "RDA2",
    titulo: "Regla de Cramer y repaso de Unidades 1–2",
    desc: "La regla de Cramer con determinantes y un repaso integrador antes del examen parcial.",
    temas: ["2.3 Regla de Cramer", "Repaso: matrices, determinantes y sistemas"],
    listo: false,
  },
  {
    num: 10, unidad: 2, tipo: "practica", sesion: "S4", rda: "RDA2",
    titulo: "Simulacro interactivo del examen parcial",
    desc: "Simulacro autocalificado con preguntas tipo Blackboard (opción múltiple con desarrollo) sobre las Unidades 1 y 2.",
    temas: ["Examen parcial: 90 minutos", "Preguntas de opción múltiple con demostración del proceso"],
    listo: false,
  },
  {
    num: 11, unidad: 3, tipo: "teoria", sesion: "S5", rda: "RDA3",
    titulo: "Espacios vectoriales: definición y teoremas fundamentales",
    desc: "Los 10 axiomas del espacio vectorial con ejemplos y contraejemplos interactivos en ℝ² y ℝⁿ.",
    temas: ["3.1 Definición de espacio vectorial", "Teoremas fundamentales", "Subespacios"],
    listo: false,
  },
  {
    num: 12, unidad: 3, tipo: "practica", sesion: "S5", rda: "RDA3",
    titulo: "Palabras como vectores: introducción a los embeddings",
    desc: "Cómo la IA convierte palabras en vectores numéricos. Explorar embeddings reales en Colab y medir similitud.",
    temas: ["Vectores de palabras (embeddings)", "El espacio vectorial del lenguaje", "Similitud entre palabras"],
    listo: false,
  },
  {
    num: 13, unidad: 3, tipo: "teoria", sesion: "S6", rda: "RDA3",
    titulo: "Combinación lineal e independencia lineal",
    desc: "Cuándo un vector 'aporta información nueva': combinaciones lineales y dependencia, con visualizador en el plano.",
    temas: ["3.2 Combinación lineal", "Independencia y dependencia lineal", "Criterio con determinantes"],
    listo: false,
  },
  {
    num: 14, unidad: 3, tipo: "practica", sesion: "S6", rda: "RDA3",
    titulo: "Aritmética de palabras: rey − hombre + mujer ≈ reina",
    desc: "Las combinaciones lineales en acción dentro de un LLM: analogías con embeddings y similitud coseno en Colab.",
    temas: ["Analogías vectoriales", "Similitud coseno", "Combinaciones lineales de significados"],
    listo: false,
  },
  {
    num: 15, unidad: 3, tipo: "teoria", sesion: "S7–S8", rda: "RDA3",
    titulo: "Conjunto generador, bases y dimensión",
    desc: "Qué genera un conjunto de vectores, qué es una base y por qué la dimensión mide los 'grados de libertad'.",
    temas: ["3.3 Conjunto generador y espacio generado", "3.4 Bases y dimensión de espacios vectoriales"],
    listo: false,
  },
  {
    num: 16, unidad: 3, tipo: "practica", sesion: "S8", rda: "RDA3",
    titulo: "Proyecto final: búsqueda semántica y el álgebra de un LLM",
    desc: "Proyecto integrador: mini buscador semántico con embeddings + cómo la atención de un LLM es puro producto de matrices. Repaso para el examen final.",
    temas: ["Búsqueda semántica con embeddings", "Atención = productos matriciales", "Repaso examen final"],
    listo: false,
  },
];

/* ---------- helpers ---------- */

function claseHref(num, fromClassPage) {
  const slug = `clase-${String(num).padStart(2, "0")}`;
  return fromClassPage ? `../${slug}/index.html` : `clases/${slug}/index.html`;
}

const TIPO_LABEL = { teoria: "Teoría", practica: "Práctica · Python" };

/* Renderiza el mapa de clases por unidad en la portada. */
function renderCourseMap(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (const [uNum, uInfo] of Object.entries(UNIDADES)) {
    const clases = COURSE.filter((c) => c.unidad === Number(uNum));

    const block = document.createElement("section");
    block.className = "unit-block";
    block.dataset.unit = uNum;
    block.innerHTML = `
      <div class="unit-head">
        <h2>Unidad ${uNum} · ${uInfo.nombre}</h2>
        <span class="sub">${uInfo.sub}</span>
      </div>
      <div class="class-grid"></div>`;

    const grid = block.querySelector(".class-grid");
    for (const c of clases) {
      const a = document.createElement("a");
      a.className = "class-card";
      a.href = claseHref(c.num, false);
      a.innerHTML = `
        <div class="top">
          <span class="class-num">Clase ${String(c.num).padStart(2, "0")}</span>
          <span class="chip ${c.tipo}">${TIPO_LABEL[c.tipo]}</span>
          ${c.listo ? "" : '<span class="chip soon">Próximamente</span>'}
        </div>
        <h3>${c.titulo}</h3>
        <p class="desc">${c.desc}</p>
        <div class="foot"><span class="chip u${c.unidad}">Unidad ${c.unidad}</span> <span>Sesión ${c.sesion} · ${c.rda}</span></div>`;
      grid.appendChild(a);
    }
    container.appendChild(block);
  }
}

/* Renderiza la navegación anterior/siguiente al pie de una clase. */
function renderClassNav(containerId, currentNum) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const prev = COURSE.find((c) => c.num === currentNum - 1);
  const next = COURSE.find((c) => c.num === currentNum + 1);
  let html = "";
  if (prev) {
    html += `<a href="${claseHref(prev.num, true)}"><small>← Clase anterior</small><b>${prev.titulo}</b></a>`;
  }
  if (next) {
    html += `<a class="next" href="${claseHref(next.num, true)}"><small>Clase siguiente →</small><b>${next.titulo}</b></a>`;
  }
  container.innerHTML = html;
}

/* Conecta los botones "Abrir en Colab" (elementos con data-notebook). */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-notebook]").forEach((el) => {
    el.href = colabUrl(el.dataset.notebook);
    el.target = "_blank";
    el.rel = "noopener";
  });
});
