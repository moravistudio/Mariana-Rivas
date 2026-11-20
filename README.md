# Mariana Rivas · Fotografía de bodas

Sitio web de varias páginas, estático: HTML, CSS y JavaScript sin frameworks ni compilación. Español de Perú, precios en soles.

## Páginas

`index.html` (Inicio) · `sobre-mi.html` · `paquetes.html` · `galeria.html` · `boda.html?id=...` (una boda) · `contacto.html`

## Verlo en local

Abre `index.html` con doble clic. Mejor con un servidor local, para ver exactamente lo que verá GitHub Pages:

```
npx serve .
```

(o cualquier servidor estático, por ejemplo `python -m http.server`).

## Cómo se repiten la cabecera y el pie

La barra de aviso, la cabecera (con el menú) y el pie **se arman con JavaScript** desde un solo bloque, `CONFIG` en `js/main.js`, y se insertan en las 6 páginas. Así no hay que copiar y pegar y un cambio de marca se hace en un lugar. Cada página trae un menú simple dentro de `<noscript>` por si el navegador no ejecuta JavaScript.

## Qué editar

| Qué | Dónde |
|-----|-------|
| Nombre de marca, logo, aviso de arriba, contacto, redes, año, textos del pie | `CONFIG` al inicio de `js/main.js` |
| Las bodas (nombres, lugar, historia, testimonio, fotos) | `js/bodas.js` |
| Colores, tipografías, radios y márgenes | bloque `:root` al inicio de `css/styles.css` |
| Textos de cada página | el `.html` de la página |
| Fotos | `img/` (mira `img/LISTA-DE-FOTOS.md`: nombres, proporciones y prompts) |

Todo lo que aparece entre corchetes (`[WHATSAPP]`, `S/ [PRECIO]`, `[PLAZO DE ENTREGA]`…) es un dato que falta. Búscalo con `[` en el editor.

## Agregar una boda

En `js/bodas.js`, copia un bloque, cambia el `id` y los textos, y pon sus fotos en `img/bodas/<id>/` (`portada.jpg` y `01.jpg` a `09.jpg`). Aparece sola en la galería y su página queda en `boda.html?id=<id>`. Agrégala también a `sitemap.xml`.

## Pétalos que flotan

`js/petalos.js` dibuja unos pétalos y hojitas muy discretos sobre todas las páginas (no reciben clics y no tapan nada). Arriba del archivo se cambian la cantidad (escritorio y celular), la opacidad y los colores. Se apagan solos si la persona tiene activado «reducir movimiento». Para quitarlos: pon `ACTIVO = false` o borra la línea `<script src="js/petalos.js">`.

## Formulario de contacto

Valida en el navegador y por ahora **simula** el envío. Para conectarlo (Formspree, etc.): en `CONFIG.formulario` de `js/main.js`, pon `modo: 'real'` y la URL en `endpoint`. Es el único punto de conexión (función `enviar`).

El botón «Consultar fecha» de cada paquete abre el formulario con ese paquete ya elegido (`contacto.html?paquete=clasico`).

## Pendiente antes de publicar

- Reemplazar los datos entre corchetes.
- `sitemap.xml` y `robots.txt` apuntan a `[DOMINIO]`: cámbialos por la dirección real. Para que al compartir el enlace salga una foto, agrega la etiqueta `og:image` con la dirección completa de una foto.
- Subir las fotos.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube el contenido de esta carpeta (`sitio/`) como raíz del repositorio.
2. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. En unos minutos queda en `https://<usuario>.github.io/<repositorio>/`.
