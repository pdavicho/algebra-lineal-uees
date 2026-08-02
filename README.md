# 🧮 Álgebra Lineal interactiva · UMAT205 · UEES

Sitio web del curso **Álgebra Lineal (UMAT205)** de la Universidad Espíritu Santo
(Educación a Distancia, 2026). Cada concepto del sílabo se enseña de tres formas
complementarias:

1. **Slides interactivos** en el navegador (identidad institucional UEES): matrices
   editables, producto de matrices animado paso a paso, quizzes autocalificados.
   Navegación con `←`/`→`, `F` para pantalla completa.
2. **Práctica en Python** con notebooks de Google Colab (NumPy, imágenes como
   matrices, sistemas de ecuaciones reales).
3. **Conexión con la Inteligencia Artificial**: cómo los LLMs usan matrices,
   vectores de palabras (embeddings), similitud coseno y búsqueda semántica.

## Estructura

- **8 clases**, una por cada sesión sincrónica de 2 h del sílabo oficial (versión
  final, 23-marzo-2026). Cada clase combina la teoría de la semana con su reto o
  caso de estudio práctico:
  - **Unidad 1 · Matrices y determinantes** — clases 01–02
  - **Unidad 2 · Sistemas de ecuaciones lineales** — clases 03–04 (incluye examen parcial)
  - **Unidad 3 · Espacios vectoriales reales** — clases 05–08 (incluye embeddings, PCA, atención de un Transformer, LoRA y examen final)
- Estado actual: **Clase 01 completa** (clase modelo); las clases 02–08 tienen su
  plantilla con temario y se irán publicando.

```
├── index.html            # Portada con el mapa de las 8 clases
├── css/style.css         # Tema del curso (colores UEES, pensado para proyectar)
├── css/slides.css        # Modo presentación
├── js/
│   ├── common.js         # Metadatos de las 8 clases + configuración del repo
│   ├── slides.js         # Motor de slides (teclado, progreso, táctil)
│   ├── quiz.js           # Motor de quizzes autocalificados
│   └── viz/matrix-viz.js # Visualizaciones interactivas (crece clase a clase)
├── clases/clase-01 … clase-08/   # Cada clase es un deck de slides
├── assets/               # Logos UEES
└── notebooks/            # Notebooks de Google Colab (uno por clase)
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
  githubUser: "pdavicho",             // ← tu usuario de GitHub
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
Bibliografía base: Grossman & Flores (2019) *Álgebra Lineal* 8.ª ed.; Deisenroth, Faisal & Ong (2020) *Mathematics for Machine Learning*.
Complementaria: Strang (2019) *Linear Algebra and Learning from Data*.
