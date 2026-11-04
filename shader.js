// Fondo WebGL de la portada: vapor turquesa que reacciona al ratón y al tacto como humo/agua.
// - Al mover el puntero se deja una estela que arremolina el vapor (más intensa cuanto más rápido).
// - Al hacer clic o tocar se generan ondas que se expanden como en el agua.
// - Primera visita: el sistema "se enciende" con un pulso radial desde el centro.
// - Al pulsar "Descubre GrowTale" el vapor se acerca y se ilumina (transición de salida).
(function(){
  const canvas = document.getElementById('bg-canvas')
  if(!canvas) return

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if(!gl){ document.body.style.background = 'linear-gradient(180deg,#042029,#072f2b)'; return }

  const TRAIL = 16   // puntos de estela
  const RIPPLES = 4  // ondas simultáneas

  const vert = `attribute vec2 a_pos; varying vec2 v_uv; void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos,0.0,1.0); }`;
  const frag = `precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec4 u_trail[${TRAIL}];     // xy: posición (uv), z: intensidad, w: sentido del giro
  uniform vec4 u_ripples[${RIPPLES}]; // xy: posición (uv), z: edad (s), w: intensidad
  uniform float u_reveal;             // 0..1 avance del pulso de encendido
  uniform float u_exit;               // 0..1 avance de la transición de salida

  vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec2 mod289(vec2 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float noise(vec2 v){
    const vec4 C = vec4(0.211324865405187,0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute(vec3(i.y, i.y + i1.y, i.y + 1.0)) + vec3(i.x, i.x + i1.x, i.x + 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.y = a0.y * x12.x + h.y * x12.y;
    g.z = a0.z * x12.z + h.z * x12.w;
    return 130.0 * dot(m, g);
  }
  float fbm(vec2 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5;} return v; }

  void main(){
    vec2 uv = v_uv;
    vec2 res = u_resolution.xy;
    float aspect = res.x / res.y;
    vec2 p = (uv * res - 0.5*res) / min(res.x,res.y);
    float t = u_time;

    // Salida: zoom hacia el centro, como si entrásemos en el vapor
    p *= 1.0 - 0.55 * u_exit * u_exit;

    vec2 disp = vec2(0.0);
    float wake = 0.0;   // densidad de la estela: aclara el humo removido
    float crest = 0.0;  // brillo en las crestas de las ondas

    // Estela de humo: cada punto crea un pequeño remolino que se desvanece
    for(int i=0;i<${TRAIL};i++){
      vec4 tr = u_trail[i];
      if(tr.z < 0.002) continue;
      vec2 d = (uv - tr.xy) * vec2(aspect, 1.0);
      float s = tr.z * exp(-dot(d,d) * 90.0);
      disp += vec2(-d.y, d.x) * s * 2.2 * tr.w + d * s * 0.5;
      wake += s;
    }

    // Ondas de agua: anillos que crecen y se apagan
    for(int i=0;i<${RIPPLES};i++){
      vec4 rp = u_ripples[i];
      if(rp.w < 0.002) continue;
      vec2 d = (uv - rp.xy) * vec2(aspect, 1.0);
      float dist = length(d) + 1e-5;
      float band = dist - rp.z * 0.42;
      float ring = exp(-band * band * 260.0);
      float wave = sin(band * 70.0) * ring * rp.w * exp(-rp.z * 1.3);
      disp += (d / dist) * wave * 0.035;
      crest += max(wave, 0.0) * 0.9;
    }

    // Pulso de encendido: frente circular que se expande desde el centro
    vec2 dc = (uv - 0.5) * vec2(aspect, 1.0);
    float distC2 = length(dc) + 1e-5;
    float front = u_reveal * (0.5 * length(vec2(aspect, 1.0)) + 0.2); // llega a las esquinas
    float pulse = exp(-pow((distC2 - front) * 14.0, 2.0)) * (1.0 - u_reveal);
    disp += (dc / distC2) * pulse * 0.06;

    vec2 q0 = p + disp;
    float q = fbm(q0 + vec2(0.0, t * 0.095));
    float r = fbm(q0 * 1.8 - vec2(t * 0.15, -t * 0.04) + q * 0.9);
    float f = fbm(q0 + r * 0.6 + t * 0.055);

    vec3 colA = vec3(0.02,0.18,0.14);
    vec3 colB = vec3(0.09,0.68,0.58);
    vec3 colC = vec3(0.46,0.86,0.76);
    float glow = smoothstep(0.18, 0.78, f + 0.25 * r + wake * 0.35);
    vec3 color = mix(colA, colB, clamp(f * 1.05 + r * 0.45, 0.0, 1.0));
    color = mix(color, colC, pow(glow, 1.12));

    float vign = 1.0 - smoothstep(0.6, 1.0, length(uv - 0.5));
    color *= 0.62 + 0.6 * glow;
    color += 0.06 * vec3(0.9, 1.0, 0.95) * pow(glow, 2.0);
    color += crest * vec3(0.45, 0.85, 0.78) * 0.35;
    color *= mix(0.94, 1.18, vign);

    // Lo que el pulso aún no ha alcanzado está apagado; el frente brilla
    float lit = smoothstep(front + 0.02, front - 0.12, distC2);
    color = color * lit + pulse * vec3(0.55, 1.0, 0.9) * 0.9;

    // Salida: el vapor se ilumina y se funde con el fondo de la web
    color = mix(color, vec3(0.55, 0.95, 0.85), smoothstep(0.2, 0.7, u_exit) * 0.55);
    color = mix(color, vec3(0.016, 0.125, 0.161), smoothstep(0.65, 1.0, u_exit));
    gl_FragColor = vec4(color, 1.0);
  }`;

  function compile(src, type){ const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){ console.error(gl.getShaderInfoLog(s)); } return s }
  const prog = gl.createProgram()
  gl.attachShader(prog, compile(vert, gl.VERTEX_SHADER)); gl.attachShader(prog, compile(frag, gl.FRAGMENT_SHADER))
  gl.linkProgram(prog); if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(prog))
  gl.useProgram(prog)

  const pos = gl.getAttribLocation(prog,'a_pos')
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0)

  const u_time = gl.getUniformLocation(prog,'u_time')
  const u_res = gl.getUniformLocation(prog,'u_resolution')
  const u_trail = gl.getUniformLocation(prog,'u_trail')
  const u_ripples = gl.getUniformLocation(prog,'u_ripples')
  const u_reveal = gl.getUniformLocation(prog,'u_reveal')
  const u_exit = gl.getUniformLocation(prog,'u_exit')

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // El vapor es difuso: renderizar a media resolución ahorra mucha GPU sin pérdida visible
  function resize(){
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1)) * 0.5
    const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight)
    canvas.width = Math.max(1, Math.floor(w * dpr)); canvas.height = Math.max(1, Math.floor(h * dpr))
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
    gl.viewport(0,0,canvas.width,canvas.height)
  }
  window.addEventListener('resize', ()=>{ resize(); if(reducedMotion) requestAnimationFrame(frame) }); resize()

  // Estado de la interacción (uv 0..1 con origen abajo-izquierda, como en el shader)
  const trail = new Float32Array(TRAIL * 4)
  const ripples = new Float32Array(RIPPLES * 4)
  let trailHead = 0, rippleHead = 0
  let last = null

  const toUV = (x, y) => [x / window.innerWidth, 1 - y / window.innerHeight]

  function addTrail(x, y, speed){
    const [u, v] = toUV(x, y)
    const i = trailHead * 4
    trail[i] = u; trail[i+1] = v
    trail[i+2] = Math.min(0.9, 0.12 + speed * 0.012)
    trail[i+3] = Math.random() < 0.5 ? 1 : -1
    trailHead = (trailHead + 1) % TRAIL
  }
  function addRipple(x, y, strength){
    const [u, v] = toUV(x, y)
    const i = rippleHead * 4
    ripples[i] = u; ripples[i+1] = v; ripples[i+2] = 0; ripples[i+3] = strength
    rippleHead = (rippleHead + 1) % RIPPLES
  }

  if(!reducedMotion){
    window.addEventListener('pointermove', e=>{
      const now = performance.now()
      if(last){
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y)
        if(dist < 6) return
        const speed = dist / Math.max(8, now - last.t) * 16 // px por fotograma, aprox.
        addTrail(e.clientX, e.clientY, speed)
      }
      last = { x: e.clientX, y: e.clientY, t: now }
    }, {passive:true})
    window.addEventListener('pointerdown', e=> addRipple(e.clientX, e.clientY, 1), {passive:true})
    window.addEventListener('pointerup', e=>{ if(e.pointerType !== 'mouse') last = null }, {passive:true})
  }

  // Encendido solo en la primera visita de la sesión (lo decide el <head> de index.html)
  const REVEAL_MS = 1600, EXIT_MS = 750
  const easeOut = k => 1 - Math.pow(1 - k, 3)
  let revealStart = document.documentElement.classList.contains('intro') ? null : -Infinity
  let exitStart = null
  document.addEventListener('growtale:leave', ()=>{ exitStart = performance.now() })
  // Al volver con el botón "atrás" (bfcache) se restaura el estado normal
  window.addEventListener('pageshow', e=>{ if(e.persisted){ exitStart = null; requestAnimationFrame(frame) } })

  const start = performance.now()
  let prev = start
  function frame(){
    const now = performance.now()
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now

    // La estela se disipa (~1 s) y las ondas envejecen
    for(let i=0;i<TRAIL;i++) trail[i*4+2] *= Math.pow(0.12, dt)
    for(let i=0;i<RIPPLES;i++){ ripples[i*4+2] += dt; if(ripples[i*4+2] > 3) ripples[i*4+3] = 0 }

    if(revealStart === null) revealStart = now
    gl.uniform1f(u_reveal, easeOut(Math.min(1, (now - revealStart) / REVEAL_MS)))
    gl.uniform1f(u_exit, exitStart === null ? 0 : Math.min(1, (now - exitStart) / EXIT_MS))
    gl.uniform1f(u_time, (now - start) / 1000)
    gl.uniform2f(u_res, canvas.width, canvas.height)
    gl.uniform4fv(u_trail, trail)
    gl.uniform4fv(u_ripples, ripples)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    if(!reducedMotion) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
})();
