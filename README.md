# GrowTale — Web oficial

Web estática de GrowTale, publicada con GitHub Pages en https://growtale.app/ (dominio propio; el archivo `CNAME` lo indica a GitHub). Cada push a `main` se despliega automáticamente.

## Páginas

| Archivo | Contenido |
| --- | --- |
| `index.html` | Portada: fondo animado (WebGL), logo, música y botón "Descubre GrowTale". |
| `proyecto.html` | Página principal del proyecto: visión, impacto, videojuego, equipo y contacto (con formulario en pop-up). |
| `contacto.html` | Redirección a `proyecto.html#contacto` para no romper enlaces antiguos. |

## Código

- `styles.css` — estilos de ambas páginas.
- `app.js` — idioma ES/EN, música, menú, lightbox, perfiles del equipo y formulario de contacto.
- `shader.js` — fondo animado de la portada.
- `cursor.js` — cursor personalizado (solo escritorio con ratón).

### Textos e idiomas

El español es el texto que aparece en el HTML. Para que un texto se traduzca, añade `data-i18n="clave"` al elemento y la traducción al inglés en `I18N_EN` dentro de `app.js`. Para atributos usa `data-i18n-alt`, `data-i18n-aria-label`, `data-i18n-title` o `data-i18n-content`.

### Formulario de contacto

No hay servidor: al enviar, se abre el cliente de correo del visitante con el mensaje ya redactado. El destinatario se define en `data-email` del `<form>` en `proyecto.html` (y en los enlaces `mailto:` de la sección Contacto).

### Música

Suena por defecto a volumen bajo (`MUSIC_VOLUME` en `app.js`). Si el navegador bloquea la reproducción automática, empieza con la primera interacción. La preferencia de apagarla se recuerda, y la canción continúa por donde iba al pasar de la portada al proyecto.

## Imágenes

La web usa las versiones `.webp` optimizadas. Los originales (`.png`/`.jpg`) se conservan en `assets/images/` como fuente. Si cambias una imagen, genera su WebP, por ejemplo con ffmpeg:

```
ffmpeg -i assets/images/captura1.png -vf "scale='min(640,iw)':-2" -c:v libwebp -quality 82 assets/images/captura1.webp
```

## Ver la web en local

```
python -m http.server 8000
```

y abrir http://localhost:8000

## Iconos

Los iconos están en `assets/icons/` y se pintan con máscaras CSS (`.gt-icon` y `.gt-tile` en `styles.css`). Parte son del propio juego; el resto vienen de [Phosphor Icons](https://phosphoricons.com) (estilo *fill*, licencia MIT). Cada icono se usa una sola vez en la web.
