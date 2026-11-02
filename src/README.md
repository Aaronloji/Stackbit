# Fuente de estilos

`styles.css` es la versión legible de `public_html/styles.min.css`, que es la que carga el sitio.
No se publica: queda fuera de `public_html` para que no se suba al hosting.

Al cambiar estilos, edita `styles.css` y vuelve a generar `public_html/styles.min.css`
(minificado), y sube el número de versión `?v=` en las páginas para que los navegadores
no usen la copia vieja.
