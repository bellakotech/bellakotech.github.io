// Fondo WebGL de la portada: vapor que fluye radialmente desde el centro y reacciona al ratón.
// - Hover: una pequeña simulación de fluido (a baja resolución, en la GPU) recibe el empuje
//   radial y el arrastre del cursor; la velocidad se transporta, se difunde y se amortigua,
//   así que el humo se aparta de verdad, el empuje se propaga y luego vuelve despacio.
//   Además una "linterna" ilumina el vapor bajo el cursor.
// - Sobre "Descubre GrowTale" la linterna se intensifica y el vapor fluye cada vez más
//   rápido; al pulsarlo llega al máximo como parte de la transición de salida.
// - Clic en dos tiempos: al pulsar el humo se contrae hacia el puntero (y lo sigue si se
//   arrastra); al soltar sale una onda expansiva + impulso en la simulación.
// - Primera visita: el sistema "se enciende" con un pulso radial desde el centro.
// - Al volver del proyecto la transición de salida se reproduce a la inversa.
// - El color oscila entre verde y azul.
// Con ?debug en la URL aparece un panel para ajustar los efectos (se recuerda hasta ?debug=0).
(function(){
  const canvas = document.getElementById('bg-canvas')
  if(!canvas) return

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if(!gl){ document.body.style.background = 'linear-gradient(180deg,#042029,#072f2b)'; return }

  const CLICKS = 4   // ondas de clic simultáneas
  const SIM_BASE = 128

  // Parámetros ajustables (1 = valor por defecto)
  const DEFAULTS = { smoke: 1, light: 1, buttonBoost: 1.4, buttonSpeed: 5.5, waveSpeed: 1, colorSpeed: 0.9 }
  const FX_KEY = 'growtale_fx_tuning_v2'
  const DEBUG_KEY = 'growtale_debug'
  const debugParam = new URLSearchParams(location.search).get('debug')
  try{
    if(debugParam === '0') localStorage.removeItem(DEBUG_KEY)
    else if(debugParam !== null) localStorage.setItem(DEBUG_KEY, '1')
  }catch(e){}
  let DEBUG = false
  try{ DEBUG = localStorage.getItem(DEBUG_KEY) === '1' }catch(e){}
  const fx = Object.assign({}, DEFAULTS)
  if(DEBUG){ try{ Object.assign(fx, JSON.parse(localStorage.getItem(FX_KEY) || '{}')) }catch(e){} }

  const vert = `attribute vec2 a_pos; varying vec2 v_uv; void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos,0.0,1.0); }`;

  // ---------- Simulación: rg = velocidad (uv/s), ba = desplazamiento acumulado del humo (uv) ----------
  const fragSim = `precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_prev;
  uniform vec2 u_texel;
  uniform float u_dt;
  uniform float u_aspect;
  uniform vec4 u_splat;      // xy: cursor (uv), z: radio, w: intensidad
  uniform vec2 u_splatVel;   // velocidad del cursor (uv/s)
  uniform float u_push;      // empuje radial del cursor
  uniform vec4 u_impulse;    // al soltar el clic: xy posición, z radio, w fuerza (un fotograma)
  uniform vec3 u_press;      // clic mantenido: xy posición, z intensidad 0..1 (atrae el humo)

  vec2 radialFrom(vec2 c, float radius, out float g){
    vec2 d = (v_uv - c) * vec2(u_aspect, 1.0);
    float dl = length(d) + 1e-4;
    g = exp(-dl * dl / (radius * radius));
    vec2 dir = d / dl * smoothstep(0.0, radius * 0.6, dl); // suave en el centro
    return vec2(dir.x / u_aspect, dir.y);                  // de vuelta a uv
  }

  void main(){
    // Advección semi-lagrangiana: el campo se transporta con su propia velocidad
    vec2 vel = texture2D(u_prev, v_uv).rg;
    vec2 back = v_uv - vel * u_dt;
    vec4 a = texture2D(u_prev, back);
    // Difusión: mezcla con los vecinos para que todo sea suave, como el humo
    vec4 n = texture2D(u_prev, back + vec2(u_texel.x, 0.0)) + texture2D(u_prev, back - vec2(u_texel.x, 0.0))
           + texture2D(u_prev, back + vec2(0.0, u_texel.y)) + texture2D(u_prev, back - vec2(0.0, u_texel.y));
    a = mix(a, n * 0.25, 0.4);

    vec2 v2 = a.rg * exp(-u_dt * 1.4);                 // la velocidad se amortigua
    float g;
    if(u_splat.w > 0.0){
      vec2 radial = radialFrom(u_splat.xy, u_splat.z, g);
      v2 += (radial * u_push + u_splatVel * 0.6) * g * u_splat.w * u_dt * 6.0;
    }
    if(u_press.z > 0.001){
      vec2 radial = radialFrom(u_press.xy, 0.18, g);
      v2 -= radial * g * u_press.z * u_dt * 2.2;
    }
    if(u_impulse.w > 0.0){
      vec2 radial = radialFrom(u_impulse.xy, u_impulse.z, g);
      v2 += radial * g * u_impulse.w;
    }
    // El desplazamiento acumulado sigue a la velocidad y vuelve despacio a cero
    vec2 o2 = clamp(a.ba * exp(-u_dt * 0.5) + v2 * u_dt, -0.45, 0.45);
    gl_FragColor = vec4(v2, o2);
  }`;

  // ---------- Render del vapor ----------
  const frag = `precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;               // reloj real (color, turbulencia)
  uniform float u_flow;               // tiempo del flujo del vapor (se acelera sobre el botón)
  uniform sampler2D u_sim;
  uniform float u_hasSim;
  uniform vec3 u_mouse;               // xy: puntero suavizado (uv), z: presencia 0..1
  uniform vec4 u_clicks[${CLICKS}];   // ondas al soltar el clic: xy posición, z edad (s), w intensidad
  uniform vec3 u_press;               // clic mantenido: xy posición, z intensidad 0..1
  uniform float u_boost;              // 0..1 el puntero está sobre el botón principal
  uniform float u_smoke;              // fuerza con la que el soplo mueve el vapor
  uniform float u_light;              // intensidad de la linterna
  uniform float u_buttonBoost;        // intensidad extra de la linterna sobre el botón
  uniform float u_waveSpeed;          // velocidad de la onda del clic
  uniform float u_colorSpeed;         // velocidad del ciclo verde <-> azul
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
  // 4 octavas: el vapor se calcula dos veces (dos capas de zoom), así que cuidamos el coste
  float fbm(vec2 p){ float v=0.0; float a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.0; a*=0.5;} return v; }

  // Una capa de vapor (warp de dominio en dos niveles); devuelve f y r
  vec2 vapor(vec2 x, float t, vec2 turb){
    vec2 drift = vec2(cos(t * 0.05), sin(t * 0.04)) * 0.6;   // evolución lenta, sin dirección fija
    float q = fbm(x + drift);
    float r = fbm(x * 1.8 + q * 0.9 + vec2(t * 0.03, -t * 0.02) + turb);
    float f = fbm(x + r * 0.6 + drift * 0.5);
    return vec2(f, r);
  }

  void main(){
    vec2 uv = v_uv;
    vec2 res = u_resolution.xy;
    float aspect = res.x / res.y;
    vec2 asp = vec2(aspect, 1.0);
    vec2 p = (uv * res - 0.5*res) / min(res.x,res.y);
    float t = u_flow;

    // Salida: zoom hacia el centro, como si entrásemos en el vapor
    p *= 1.0 - 0.55 * u_exit * u_exit;

    // ---------- Soplo del cursor (simulación) ----------
    vec4 sim = u_hasSim > 0.5 ? texture2D(u_sim, uv) : vec4(0.0);
    vec2 simOffset = sim.ba * asp * u_smoke;   // cuánto se ha desplazado el humo aquí
    vec2 turb = sim.rg * asp * 0.6 * u_smoke;  // remueve las capas internas: remolinos suaves

    vec2 disp = -simOffset;  // muestrear "de donde vino" el humo = el humo se ve desplazado
    float crest = 0.0;
    float flash = 0.0;

    // ---------- Clic: onda expansiva visible ----------
    for(int i=0;i<${CLICKS};i++){
      vec4 ck = u_clicks[i];
      if(ck.w < 0.001) continue;
      vec2 d = (uv - ck.xy) * asp;
      float dist = length(d) + 1e-5;
      float a = ck.z * u_waveSpeed;
      float band = dist - a * 0.95;
      float ring = exp(-band * band * 90.0) * exp(-a * 2.2) * ck.w;
      disp += (d / dist) * ring * 0.1;
      crest += ring * 1.2;
      flash += exp(-dist * dist * 40.0) * exp(-a * 9.0) * ck.w * 0.7;
    }

    // ---------- Clic mantenido: el humo se contrae hacia el puntero y brilla suavemente ----------
    if(u_press.z > 0.001){
      vec2 d = (uv - u_press.xy) * asp;
      float g = exp(-dot(d, d) * 18.0) * u_press.z;
      disp += d * g * 0.35;
      flash += exp(-dot(d, d) * 30.0) * u_press.z * 0.3;
    }

    // ---------- Pulso de encendido ----------
    vec2 dc = (uv - 0.5) * asp;
    float distC2 = length(dc) + 1e-5;
    float front = u_reveal * (0.5 * length(asp) + 0.2); // llega a las esquinas
    float pulse = exp(-pow((distC2 - front) * 14.0, 2.0)) * (1.0 - u_reveal);
    disp += (dc / distC2) * pulse * 0.06;

    // ---------- Vapor: flujo radial desde el centro ----------
    // Dos capas a escalas que se reducen continuamente (el contenido se expande hacia fuera)
    // y se funden entre sí para que el zoom sea infinito y sin cortes.
    vec2 pp = p + disp;
    float ph = fract(t * 0.035);
    float wA = 0.5 - 0.5 * cos(6.2831853 * ph);
    vec2 A = vapor(pp * exp2(-ph), t, turb);
    vec2 B = vapor(pp * exp2(-fract(ph + 0.5)) + vec2(3.7, 1.9), t, turb);
    // Mezclar dos ruidos independientes baja el contraste; se compensa para mantener la intensidad
    float norm = inversesqrt(wA * wA + (1.0 - wA) * (1.0 - wA));
    float f = mix(B.x, A.x, wA) * norm;
    float r = mix(B.y, A.y, wA) * norm;

    // Paleta: oscila entre verde y azul, con un desfase suave por zonas
    float cyc = smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(u_time * u_colorSpeed + p.x * 0.5 + p.y * 0.25));
    // (el extremo azul tiene la misma luminosidad que el verde: no se oscurece)
    vec3 colA = mix(vec3(0.02,0.18,0.14), vec3(0.03,0.14,0.25), cyc);
    vec3 colB = mix(vec3(0.09,0.68,0.58), vec3(0.14,0.56,0.92), cyc);
    vec3 colC = mix(vec3(0.46,0.86,0.76), vec3(0.58,0.82,1.00), cyc);
    float glow = smoothstep(0.18, 0.78, f + 0.25 * r);
    vec3 color = mix(colA, colB, clamp(f * 1.05 + r * 0.45, 0.0, 1.0));
    color = mix(color, colC, pow(glow, 1.12));

    float vign = 1.0 - smoothstep(0.6, 1.0, length(uv - 0.5));
    color *= 0.62 + 0.6 * glow;
    color += 0.06 * vec3(0.9, 1.0, 0.95) * pow(glow, 2.0);

    // Linterna: halo que aviva el vapor bajo el cursor; más amplio e intenso sobre el botón
    vec2 dm = (uv - u_mouse.xy) * asp;
    float boost = u_boost * u_buttonBoost;
    float light = u_mouse.z * u_light * exp(-dot(dm, dm) * (6.0 / (1.0 + boost * 0.6))) * (1.0 + boost) * 0.75;
    color = mix(color, color * 1.45 + colC * 0.12, clamp(light, 0.0, 0.85));
    color += colC * max(light - 1.0, 0.0) * 0.08;

    color += crest * colC * 0.35;
    color += flash * mix(colC, vec3(1.0), 0.4) * 0.8;
    color *= mix(0.94, 1.18, vign);

    // Lo que el pulso aún no ha alcanzado está apagado; el frente brilla
    float lit = smoothstep(front + 0.02, front - 0.12, distC2);
    color = color * lit + pulse * colC * 0.9;

    // Salida: el vapor se ilumina y se funde con el fondo de la web
    color = mix(color, colC * 1.1, smoothstep(0.2, 0.7, u_exit) * 0.55);
    color = mix(color, vec3(0.016, 0.125, 0.161), smoothstep(0.65, 1.0, u_exit));
    gl_FragColor = vec4(color, 1.0);
  }`;

  function compile(src, type){ const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){ console.error(gl.getShaderInfoLog(s)); } return s }
  function program(fs, uniforms){
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(vert, gl.VERTEX_SHADER)); gl.attachShader(prog, compile(fs, gl.FRAGMENT_SHADER))
    gl.linkProgram(prog); if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(prog))
    const u = {}
    uniforms.forEach(n=> u[n] = gl.getUniformLocation(prog, n))
    return { prog, u, pos: gl.getAttribLocation(prog, 'a_pos') }
  }

  const render = program(frag, ['u_time','u_flow','u_resolution','u_sim','u_hasSim','u_mouse','u_clicks','u_press','u_boost',
    'u_smoke','u_light','u_buttonBoost','u_waveSpeed','u_colorSpeed','u_reveal','u_exit'])
  const simProg = program(fragSim, ['u_prev','u_texel','u_dt','u_aspect','u_splat','u_splatVel','u_push','u_impulse','u_press'])

  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
  function drawQuad(p){
    gl.useProgram(p.prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.enableVertexAttribArray(p.pos); gl.vertexAttribPointer(p.pos, 2, gl.FLOAT, false, 0, 0)
  }

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---------- Texturas de la simulación (ping-pong). Sin soporte, el fondo funciona sin soplo ----------
  function createSim(w, h){
    const hf = gl.getExtension('OES_texture_half_float'), hfl = gl.getExtension('OES_texture_half_float_linear')
    const fl = gl.getExtension('OES_texture_float'), fll = gl.getExtension('OES_texture_float_linear')
    const types = []
    if(hf && hfl) types.push(hf.HALF_FLOAT_OES)
    if(fl && fll) types.push(gl.FLOAT)
    for(const type of types){
      const targets = [0, 1].map(()=>{
        const tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, type, null)
        const fbo = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
        return { tex, fbo }
      })
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      if(ok) return { read: targets[0], write: targets[1], w, h }
    }
    return null
  }
  let sim = null

  // El tamaño en pantalla lo fija la CSS (100% del viewport); aquí solo se ajustan los búferes
  function resize(){
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1)) * 0.5
    const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight)
    canvas.width = Math.max(1, Math.floor(w * dpr)); canvas.height = Math.max(1, Math.floor(h * dpr))
    const a = Math.sqrt(w / h)
    const sw = Math.round(SIM_BASE * a), sh = Math.round(SIM_BASE / a)
    if(!reducedMotion && (!sim || sim.w !== sw || sim.h !== sh)){
      if(sim) [sim.read, sim.write].forEach(t=>{ gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo) })
      sim = createSim(sw, sh)
    }
    if(reducedMotion) requestAnimationFrame(frame)
  }
  if('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas)
  else window.addEventListener('resize', resize)
  resize()

  // ---------- Estado de la interacción (uv 0..1, origen abajo-izquierda) ----------
  const toUV = (x, y) => [x / canvas.clientWidth, 1 - y / canvas.clientHeight]
  const clicks = new Float32Array(CLICKS * 4)
  let clickHead = 0, pendingImpulse = null
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, vx: 0, vy: 0, active: 0, target: 0,
    move: 0, moveTarget: 0, boost: 0, boostTarget: 0 }
  const press = { x: 0.5, y: 0.5, down: false, amount: 0 }
  let last = null

  // Velocidad del flujo del vapor: 1 normal, sube sobre el botón y al máximo al pulsarlo
  const FLOW_MAX = 7
  let flowSpeed = 1, flowTime = 0, leaving = false

  const isDebugUI = e => e.target && e.target.closest && e.target.closest('#fx-debug')

  if(!reducedMotion){
    window.addEventListener('pointermove', e=>{
      if(isDebugUI(e)) return
      const [u, v] = toUV(e.clientX, e.clientY)
      mouse.tx = u; mouse.ty = v; mouse.target = 1
      if(press.down){ press.x = u; press.y = v } // si se arrastra, la presión sigue al puntero
      if(mouse.active < 0.01){ mouse.x = u; mouse.y = v } // la linterna aparece donde está el cursor
      const now = performance.now()
      if(last){
        const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y) / Math.max(0.008, (now - last.t) / 1000)
        mouse.moveTarget = Math.min(1, speed / 900) // el soplo depende de lo rápido que se mueve
      }
      last = { x: e.clientX, y: e.clientY, t: now }
    }, {passive:true})

    // La linterna se intensifica y el vapor acelera sobre el botón principal
    document.addEventListener('pointerover', e=>{
      mouse.boostTarget = e.target.closest && e.target.closest('#discover-btn') ? 1 : 0
    }, {passive:true})

    // Clic en dos tiempos: pulsar contrae el humo; soltar lanza la onda donde esté el puntero
    window.addEventListener('pointerdown', e=>{
      if(isDebugUI(e)) return
      const [u, v] = toUV(e.clientX, e.clientY)
      press.down = true; press.x = u; press.y = v
    }, {passive:true})
    const release = e=>{
      if(!press.down) return
      press.down = false
      const [u, v] = e && e.clientX !== undefined ? toUV(e.clientX, e.clientY) : [press.x, press.y]
      const i = clickHead * 4
      clicks[i] = u; clicks[i+1] = v; clicks[i+2] = 0; clicks[i+3] = 0.6 + 0.4 * press.amount
      clickHead = (clickHead + 1) % CLICKS
      pendingImpulse = [u, v, 0.6 + 0.4 * press.amount]
    }

    const leave = ()=>{ mouse.target = 0; mouse.boostTarget = 0; mouse.moveTarget = 0; last = null }
    document.documentElement.addEventListener('mouseleave', leave)
    window.addEventListener('blur', ()=>{ press.down = false; leave() })
    window.addEventListener('pointerup', e=>{ release(e); if(e.pointerType !== 'mouse') leave() }, {passive:true})
    window.addEventListener('pointercancel', ()=>{ press.down = false }, {passive:true})
  }

  // ---------- Encendido, salida y regreso ----------
  const REVEAL_MS = 1600, EXIT_MS = 750, RETURN_MS = 900
  const easeOut = k => 1 - Math.pow(1 - k, 3)
  const root = document.documentElement
  let revealStart = root.classList.contains('intro') ? null : -Infinity
  let exitStart = null, exitDir = 1
  const playReturn = ()=>{ exitStart = performance.now(); exitDir = -1; leaving = false; flowSpeed = 1 }
  document.addEventListener('growtale:leave', ()=>{ exitStart = performance.now(); exitDir = 1; leaving = true })
  document.addEventListener('growtale:return', playReturn)
  if(root.classList.contains('return')) playReturn()

  function exitValue(now){
    if(exitStart === null) return 0
    const k = Math.min(1, (now - exitStart) / (exitDir > 0 ? EXIT_MS : RETURN_MS))
    if(exitDir > 0) return k
    if(k >= 1){ exitStart = null; return 0 }
    return 1 - easeOut(k)
  }

  // ---------- Bucle ----------
  const start = performance.now()
  let prev = start
  function stepSim(dt){
    const aspect = canvas.clientWidth / canvas.clientHeight
    gl.bindFramebuffer(gl.FRAMEBUFFER, sim.write.fbo)
    gl.viewport(0, 0, sim.w, sim.h)
    drawQuad(simProg)
    const u = simProg.u
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sim.read.tex)
    gl.uniform1i(u.u_prev, 0)
    gl.uniform2f(u.u_texel, 1 / sim.w, 1 / sim.h)
    gl.uniform1f(u.u_dt, dt)
    gl.uniform1f(u.u_aspect, aspect)
    gl.uniform4f(u.u_splat, mouse.x, mouse.y, 0.14, mouse.active * mouse.move)
    gl.uniform2f(u.u_splatVel, mouse.vx, mouse.vy)
    gl.uniform1f(u.u_push, 0.2)
    gl.uniform3f(u.u_press, press.x, press.y, press.amount)
    if(pendingImpulse){ gl.uniform4f(u.u_impulse, pendingImpulse[0], pendingImpulse[1], 0.26, 1.4 * pendingImpulse[2]); pendingImpulse = null }
    else gl.uniform4f(u.u_impulse, 0, 0, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    const tmp = sim.read; sim.read = sim.write; sim.write = tmp
  }

  function frame(){
    const now = performance.now()
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now

    // Puntero suavizado, su velocidad (uv/s) y su presencia
    const px = mouse.x, py = mouse.y, k = 1 - Math.exp(-dt * 10)
    mouse.x += (mouse.tx - mouse.x) * k; mouse.y += (mouse.ty - mouse.y) * k
    if(dt > 0){
      const kv = 1 - Math.exp(-dt * 8)
      mouse.vx += ((mouse.x - px) / dt - mouse.vx) * kv
      mouse.vy += ((mouse.y - py) / dt - mouse.vy) * kv
    }
    mouse.active += (mouse.target - mouse.active) * (1 - Math.exp(-dt * 3))
    mouse.moveTarget *= Math.exp(-dt * 5)                 // si el cursor se para, deja de soplar
    mouse.move += (mouse.moveTarget - mouse.move) * (1 - Math.exp(-dt * 8))
    mouse.boost += (mouse.boostTarget - mouse.boost) * (1 - Math.exp(-dt * 5))
    press.amount += ((press.down ? 1 : 0) - press.amount) * (1 - Math.exp(-dt * (press.down ? 5 : 12)))

    // El vapor acelera progresivamente sobre el botón y de golpe al pulsarlo
    const flowTarget = leaving ? FLOW_MAX : 1 + mouse.boost * (fx.buttonSpeed - 1)
    flowSpeed += (flowTarget - flowSpeed) * (1 - Math.exp(-dt * (leaving ? 4 : 2.2)))
    flowTime += dt * flowSpeed

    for(let i=0;i<CLICKS;i++){ clicks[i*4+2] += dt; if(clicks[i*4+2] > 2.5) clicks[i*4+3] = 0 }

    if(sim && dt > 0) stepSim(dt)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    drawQuad(render)
    const u = render.u
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sim ? sim.read.tex : null)
    gl.uniform1i(u.u_sim, 0)
    gl.uniform1f(u.u_hasSim, sim ? 1 : 0)
    if(revealStart === null) revealStart = now
    gl.uniform1f(u.u_reveal, easeOut(Math.min(1, (now - revealStart) / REVEAL_MS)))
    gl.uniform1f(u.u_exit, exitValue(now))
    gl.uniform1f(u.u_time, (now - start) / 1000)
    gl.uniform1f(u.u_flow, flowTime)
    gl.uniform2f(u.u_resolution, canvas.width, canvas.height)
    gl.uniform3f(u.u_mouse, mouse.x, mouse.y, mouse.active)
    gl.uniform4fv(u.u_clicks, clicks)
    gl.uniform3f(u.u_press, press.x, press.y, press.amount)
    gl.uniform1f(u.u_boost, mouse.boost)
    gl.uniform1f(u.u_smoke, fx.smoke)
    gl.uniform1f(u.u_light, fx.light)
    gl.uniform1f(u.u_buttonBoost, fx.buttonBoost)
    gl.uniform1f(u.u_waveSpeed, fx.waveSpeed)
    gl.uniform1f(u.u_colorSpeed, fx.colorSpeed)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    if(!reducedMotion) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  // ---------- Panel de ajuste (solo en modo debug) ----------
  if(DEBUG){
    const SLIDERS = [
      ['smoke', 'Soplo del cursor', 0, 3, 0.05],
      ['light', 'Linterna', 0, 2.5, 0.05],
      ['buttonBoost', 'Linterna sobre el botón', 0, 4, 0.1],
      ['buttonSpeed', 'Velocidad del vapor sobre el botón', 1, 10, 0.1],
      ['waveSpeed', 'Velocidad de la onda', 0.4, 2.5, 0.05],
      ['colorSpeed', 'Velocidad del color', 0.05, 2.5, 0.05]
    ]
    const panel = document.createElement('div')
    panel.id = 'fx-debug'
    panel.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99990;padding:12px 14px;border-radius:12px;' +
      'background:rgba(2,10,14,.85);border:1px solid rgba(255,255,255,.12);color:#e6f7f4;font:12px/1.4 system-ui,sans-serif;' +
      'display:grid;gap:8px;min-width:230px;backdrop-filter:blur(6px)'
    panel.innerHTML = '<strong data-toggle style="letter-spacing:.08em;cursor:pointer" title="Plegar / desplegar">FX DEBUG ▾</strong>' +
      '<div data-body style="display:grid;gap:8px">' +
      SLIDERS.map(([k, label, min, max, step])=>
        `<label style="display:grid;gap:2px">${label}: <span data-v="${k}">${fx[k].toFixed(2)}</span>` +
        `<input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${fx[k]}"></label>`).join('') +
      `<div style="opacity:.6">Simulación de humo: ${sim ? 'activa' : 'no disponible'}</div>` +
      '<button type="button" data-reset style="font:inherit;padding:4px;border-radius:6px;cursor:pointer">Restablecer</button></div>'
    const save = ()=>{ try{ localStorage.setItem(FX_KEY, JSON.stringify(fx)) }catch(e){} }
    const show = k=> panel.querySelector(`[data-v="${k}"]`).textContent = fx[k].toFixed(2)
    panel.addEventListener('input', e=>{
      const k = e.target.dataset.k
      if(!k) return
      fx[k] = Number(e.target.value); show(k); save()
    })
    panel.querySelector('[data-reset]').addEventListener('click', ()=>{
      Object.assign(fx, DEFAULTS); save()
      panel.querySelectorAll('[data-k]').forEach(el=>{ el.value = fx[el.dataset.k]; show(el.dataset.k) })
    })
    panel.querySelector('[data-toggle]').addEventListener('click', ()=>{
      const body = panel.querySelector('[data-body]')
      body.style.display = body.style.display === 'none' ? 'grid' : 'none'
    })
    document.body.appendChild(panel)
  }
})();
