# 🧮 Álgebra Lineal interactiva · UMAT205 · UEES

Sitio web del curso **Álgebra Lineal (UMAT205)** de la Universidad Espíritu Santo
(Educación a Distancia, 2026). Cada concepto del sílabo se enseña de tres formas
complementarias:

1. **Teoría visual e interactiva** en el navegador: matrices editables, producto de
   matrices animado paso a paso, quizzes autocalificados.
2. **Práctica en Python** con notebooks de Google Colab (NumPy, imágenes como
   matrices, sistemas de ecuaciones reales).
3. **Conexión con la Inteligencia Artificial**: cómo los LLMs usan matrices,
   vectores de palabras (embeddings), similitud coseno y búsqueda semántica.

## Estructura

- **16 clases** organizadas en las 3 unidades del sílabo (las 8 sesiones sincrónicas
  de 2 h se expanden en pares teoría + práctica):
  - **Unidad 1 · Matrices y determinantes** — clases 01–06
  - **Unidad 2 · Sistemas de ecuaciones lineales** — clases 07–10 (incluye simulacro del parcial)
  - **Unidad 3 · Espacios vectoriales reales** — clases 11–16 (incluye embeddings, analogías de palabras y proyecto final)
- Estado actual: **Clase 01 completa** (clase modelo); las clases 02–16 tienen su
  plantilla con temario y se irán publicando.

```
├── index.html            # Portada con el mapa de las 16 clases
├── css/style.css         # Tema del curso (alto contraste, pensado para proyectar)
├── js/
│   ├── common.js         # Metadatos de las 16 clases + configuración del repo
│   ├── quiz.js           # Motor de quizzes autocalificados
│   └── viz/matrix-viz.js # Visualizaciones interactivas (crece clase a clase)
├── clases/clase-01 … clase-16/
└── notebooks/            # Notebooks de Google Colab (uno por clase práctica)
```

Sin frameworks ni pasos de build: HTML/CSS/JS puro + [KaTeX](https://katex.org) por CDN.

## 🚀 Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `algebra-lineal-uees`) y sube este contenido:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/algebra-lineal-uees.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root**.
3. El sitio quedará en `https://TU_USUARIO.github.io/algebra-lineal-uees/`.

### ⚙️ Configurar los botones "Abrir en Colab"

Los botones de Colab construyen su URL con los datos de `js/common.js`. Edita ahí:

```js
const SITE_CONFIG = {
  githubUser: "pablodavid218",        // ← tu usuario de GitHub
  githubRepo: "algebra-lineal-uees",  // ← el nombre real del repositorio
  branch: "main",
};
```

También actualiza el badge y el enlace final dentro de `notebooks/clase-01.ipynb`
si cambias usuario o nombre del repo.

## 🖥️ Ver el sitio en local

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Desarrollo de nuevas clases

La **Clase 01** (`clases/clase-01/index.html`) es la plantilla de referencia: encabezado
con metadatos del sílabo, secciones con guion de tiempos para la sesión de 2 h, demos
interactivas, panel de conexión con IA, quiz y enlace a Colab. Las visualizaciones
nuevas se agregan a `js/viz/` y los metadatos de cada clase viven en `js/common.js`.

---

Material docente del curso UMAT205 — UEES 2026.
Bibliografía base: Larson (2016) *Fundamentos de Álgebra Lineal* 7.ª ed.; Grossman & Flores (2019) *Álgebra Lineal* 8.ª ed.
