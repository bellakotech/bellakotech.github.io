# GrowTale — Sitio web inicial

Estructura creada como punto de partida. Reemplaza los placeholders en `assets/` por tus archivos reales (logo, capturas, música).

Cómo ver la página localmente:

Usando Python 3:
```
cd growtale-website/public
python -m http.server 8000
# luego abrir http://localhost:8000
```

Recomendaciones de despliegue:
- Netlify o Vercel para despliegue estático (conectar al repo GitHub/GitLab)
- Apuntar el dominio `growtale.app` desde el panel DNS del registrador hacia la plataforma elegida (A/ALIAS o CNAME según el host)

Archivos creados:
- `public/index.html`, `public/styles.css`, `public/app.js`
- `public/manifest.json`
- `assets/images/*` (placeholders)
- `assets/audio/README.txt` (instrucciones para añadir música)
