/* =========================================================================
   common.js — metadatos del curso y utilidades compartidas
   Álgebra Lineal · UMAT205 · UEES
   ========================================================================= */

/* Configuración del repositorio: EDITAR con tu usuario/repositorio de GitHub
   para que funcionen los botones "Abrir en Colab" y la URL de Pages. */
const SITE_CONFIG = {
  githubUser: "pdavicho",               // ← tu usuario de GitHub
  githubRepo: "algebra-lineal-uees",    // ← nombre del repositorio
  branch: "main",
};

function colabUrl(notebookPath) {
  const { githubUser, githubRepo, branch } = SITE_CONFIG;
  return `https://colab.research.google.com/github/${githubUser}/${githubRepo}/blob/${branch}/${notebookPath}`;
}

/* Las 8 clases del curso: una por sesión sincrónica de 2 h del sílabo
   (versión final, 23-marzo-2026). Cada clase mezcla teoría y el
   reto/caso de estudio práctico oficial de esa semana. */
const UNIDADES = {
  1: { nombre: "Matrices y determinantes", sub: "Semanas 1–2 del sílabo · Unidad 1" },
  2: { nombre: "Sistemas de ecuaciones lineales", sub: "Semanas 3–4 del sílabo · Unidad 2 · incluye examen parcial" },
  3: { nombre: "Espacios vectoriales reales", sub: "Semanas 5–8 del sílabo · Unidad 3 · incluye examen final" },
};

const COURSE = [
  {
    num: 1, unidad: 1, semana: 1, rda: "RDA1",
    titulo: "¿Qué es una matriz? Definición, operaciones y eliminación de Gauss",
    desc: "Del píxel al dato: qué es una matriz, cómo se opera con ella y cómo resolver sistemas por eliminación. Cierra con el reto de Colab: la imagen es una matriz.",
    temas: ["1.1 Definición de matriz", "1.2 Operaciones con matrices", "1.3 Propiedades de las operaciones", "1.4 Eliminación de Gauss y Gauss-Jordan"],
    reto: "Reto Colab · \"La imagen es una matriz\": blending, detección de movimiento y ajuste de brillo sobre imágenes; inpainting (reconstrucción de píxeles) con Gauss-Jordan.",
    listo: true,
  },
  {
    num: 2, unidad: 1, semana: 2, rda: "RDA1",
    titulo: "Inversa y determinante: la regresión lineal desde cero",
    desc: "La matriz inversa, el determinante y sus propiedades — aplicados a calcular a mano los pesos exactos de un modelo lineal.",
    temas: ["1.5 Inversa de una matriz", "1.6 Determinante de una matriz", "1.7 Propiedades de los determinantes"],
    reto: "Reto Colab · \"Regresión lineal desde cero\": matriz de diseño X, XᵀX, determinante e inversa para obtener los pesos w=(XᵀX)⁻¹Xᵀy; diagnóstico de matrices singulares por multicolinealidad.",
    listo: true,
  },
  {
    num: 3, unidad: 2, semana: 3, rda: "RDA2",
    titulo: "Sistemas de ecuaciones: Ax = b y el método de Gauss",
    desc: "Representar un sistema como matriz aumentada y resolverlo con Gauss — la misma operación detrás de una capa lineal de una red neuronal.",
    temas: ["2.1 Representación matricial de un sistema", "2.2 Resolución por el método de Gauss"],
    reto: "Reto Colab · \"Encontrando los pesos exactos\": Ax=b como mini-perceptrón con restricciones exactas, eliminación de Gauss en NumPy, verificación con un forward pass.",
    listo: true,
  },
  {
    num: 4, unidad: 2, semana: 4, rda: "RDA2",
    titulo: "Regla de Cramer, repaso y Examen Parcial",
    desc: "La regla de Cramer con determinantes, un repaso integrador de las Unidades 1–2 y el examen parcial.",
    temas: ["2.3 Regla de Cramer", "Repaso: matrices, determinantes y sistemas"],
    reto: "Caso de estudio · \"Calibración rápida de un modelo lineal 2x2/3x3 con la Regla de Cramer\".",
    examen: "Examen Parcial (Unidades 1–2) · 60% actividades + 40% examen",
    listo: false,
  },
  {
    num: 5, unidad: 3, semana: 5, rda: "RDA3",
    titulo: "Espacios vectoriales, combinación e independencia lineal",
    desc: "Los axiomas del espacio vectorial y cuándo un vector aporta información nueva — con embeddings de palabras como ejemplo.",
    temas: ["3.1 Definición de espacio vectorial y teoremas fundamentales", "3.2 Combinación lineal e independencia lineal"],
    reto: "Reto Colab · \"El espacio de los embeddings\": aritmética con embeddings de word2vec (rey − hombre + mujer), cierre bajo suma/escalar, independencia lineal mediante el rango.",
    listo: false,
  },
  {
    num: 6, unidad: 3, semana: 6, rda: "RDA3",
    titulo: "Conjunto generador, bases y dimensión",
    desc: "Qué genera un conjunto de vectores, qué es una base y por qué la dimensión mide los grados de libertad de un espacio.",
    temas: ["3.3 Conjunto generador y espacio generado", "3.4 Bases y dimensión de espacios vectoriales"],
    reto: "Reto Colab · \"Comprimiendo imágenes y embeddings con PCA\": pertenencia al espacio generado, base y dimensión del subespacio, compresión de imágenes y embeddings.",
    listo: false,
  },
  {
    num: 7, unidad: 3, semana: 7, rda: "RDA4",
    titulo: "Transformaciones lineales y la matriz de atención",
    desc: "Qué es una transformación lineal y su matriz asociada — vistas en las proyecciones Q, K, V de un Transformer/LLM.",
    temas: ["4.1 Definición de transformación lineal", "4.2 Matriz asociada a una transformación lineal", "Propiedades"],
    reto: "Reto Colab · \"Atención como transformación lineal\": construir Q=XW_Q, K=XW_K, V=XW_V y verificar T(u+v)=T(u)+T(v), T(cu)=cT(u).",
    listo: false,
  },
  {
    num: 8, unidad: 3, semana: 8, rda: "RDA4",
    titulo: "Composición de transformaciones, núcleo, imagen y Examen Final",
    desc: "Cómo se componen las transformaciones lineales y por qué LoRA afina modelos gigantes con muy pocos parámetros adicionales.",
    temas: ["4.3 Composición de transformaciones lineales", "Núcleo e imagen"],
    reto: "Caso de estudio · \"LoRA: composición de transformaciones lineales de bajo rango\" (ΔW = BA).",
    examen: "Examen Final (Unidades 3–4) · 60% actividades + 40% examen",
    listo: false,
  },
];

/* ---------- helpers ---------- */

function claseHref(num, fromClassPage) {
  const slug = `clase-${String(num).padStart(2, "0")}`;
  return fromClassPage ? `../${slug}/index.html` : `clases/${slug}/index.html`;
}

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
          <span class="chip semana">Semana ${c.semana}</span>
          ${c.examen ? '<span class="chip examen">Examen</span>' : ""}
          ${c.listo ? "" : '<span class="chip soon">Próximamente</span>'}
        </div>
        <h3>${c.titulo}</h3>
        <p class="desc">${c.desc}</p>
        <div class="foot"><span class="chip u${c.unidad}">Unidad ${c.unidad}</span> <span>${c.rda}</span></div>`;
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
