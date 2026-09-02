// Simple WebGL vapor shader with pointer and device motion interaction
(function(){
  const canvas = document.getElementById('bg-canvas')
  if(!canvas) return

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if(!gl){ document.body.style.background = 'linear-gradient(180deg,#042029,#072f2b)'; return }

  const vert = `attribute vec2 a_pos; varying vec2 v_uv; void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos,0.0,1.0); }`;
  const frag = `precision highp float; varying vec2 v_uv; uniform vec2 u_resolution; uniform float u_time; uniform vec3 u_mouse; uniform vec3 u_click; // x,y in px, strength
  // iq noise
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
    // normalized pixel-correct coords
    vec2 p = (uv * res - 0.5*u_resolution.xy) / min(res.x,res.y);
    float t = u_time;

    // mouse in uv space [0,1]
    vec2 mouseUV = clamp(u_mouse.xy / u_resolution.xy, 0.0, 1.0);
    vec2 center = vec2(0.5,0.5);

    // click in uv space and local ripple/distortion
    // use same coordinate origin as u_mouse (device pixels origin converted directly to uv)
    vec2 clickUV = vec2(u_click.x / u_resolution.x, u_click.y / u_resolution.y);
    float clickStrength = u_click.z;
    float cd = length(uv - clickUV);
    // compute a short-lived ripple that displaces sampling locally
    vec2 clickDisp = vec2(0.0);
    if(clickStrength > 0.001){
      float freq = 60.0;
      float speed = 6.0;
      float amp = 0.06 * clickStrength;
      float wave = sin(cd * freq - u_time * speed);
      float env = exp(-cd * 12.0);
      float ripple = wave * env * amp;
      // push samples away/towards click center for a ripple/distortion
      // guard against normalizing zero-length vector
      clickDisp = (cd > 0.0001) ? normalize(uv - clickUV) * ripple : vec2(0.0);
    }

    // radial idle pulse from center (subtle)
    float distC = length(uv - center);
    float radial = 0.012 * sin(distC * 24.0 - t * 1.1) * exp(-distC * 3.6);

    // local repulsion: compute vector from mouse to fragment
    vec2 dir = uv - mouseUV;
    float d = length(dir) + 1e-6;
    float repelStr = exp(-d * 12.0) * (1.2 * u_mouse.z);
    // shift sampling position away from the mouse (repel) - reduced intensity
    vec2 repelOffset = normalize(dir) * repelStr * 0.45;

    // base layered fbm, with radial, click and local offsets
    // incorporate clickDisp (scaled) into the sampling position to create local distortion
    float q = fbm((p + repelOffset*1.0 + clickDisp * 8.0) * 1.0 + vec2(0.0, t * 0.095));
    float r = fbm((p + repelOffset*0.8 + clickDisp * 6.0) * 1.8 - vec2(t * 0.15, -t * 0.04) + q * 0.9);
    float f = fbm(p + r * 0.6 + repelOffset * 1.2 + clickDisp * 4.0 + (center - uv) * radial * 1.2 + t * 0.055);

    // color ramp teal/green
    vec3 colA = vec3(0.02,0.18,0.14);
    vec3 colB = vec3(0.09,0.68,0.58);
    vec3 colC = vec3(0.46,0.86,0.76);
    float glow = smoothstep(0.18, 0.78, f + 0.25 * r + radial * 0.6);
    vec3 color = mix(colA, colB, clamp(f * 1.05 + r * 0.45, 0.0, 1.0));
    color = mix(color, colC, pow(glow, 1.12));

    // subtle vignette
    float vign = 1.0 - smoothstep(0.6, 1.0, distC);
    color *= 0.62 + 0.6 * glow;
    color += 0.06 * vec3(0.9, 1.0, 0.95) * pow(glow, 2.0);

    // bright localized bloom near pointer (repulsion spot)
    color += 0.12 * exp(-d * d * 180.0) * (0.45 + 0.6 * u_mouse.z);

    // localized click bloom (kept for visual feedback)
    color += clickStrength * 0.35 * vec3(0.95,1.0,0.9) * exp(-cd * cd * 220.0);

    // combine with radial idle subtle wash
    color += 0.03 * vec3(0.9, 1.0, 0.95) * radial;

    color *= mix(0.94, 1.18, vign);
    gl_FragColor = vec4(color, 1.0);
  }`;

  function compile(src, type){ const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){ console.error(gl.getShaderInfoLog(s)); } return s }
  const vs = compile(vert, gl.VERTEX_SHADER), fs = compile(frag, gl.FRAGMENT_SHADER)
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(prog))
  gl.useProgram(prog)

  const pos = gl.getAttribLocation(prog,'a_pos')
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0)

  const u_time = gl.getUniformLocation(prog,'u_time')
  const u_res = gl.getUniformLocation(prog,'u_resolution')
  const u_mouse = gl.getUniformLocation(prog,'u_mouse')
  const u_click = gl.getUniformLocation(prog,'u_click')

  let start = performance.now()
  let mouse = [window.innerWidth*0.5, window.innerHeight*0.5, 0.0]
  let click = [0,0,0]
  let motion = [0,0]

  function resize(){ const dpr = Math.max(1, window.devicePixelRatio || 1); const w = Math.max(1, window.innerWidth); const h = Math.max(1, window.innerHeight); canvas.width = Math.max(1, Math.floor(w * dpr)); canvas.height = Math.max(1, Math.floor(h * dpr)); canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; gl.viewport(0,0,canvas.width,canvas.height) }
  window.addEventListener('resize', resize); resize()

  function updateMouse(e){ let x=0,y=0,z=0; const rect = canvas.getBoundingClientRect(); if(e.touches && e.touches[0]){ x=e.touches[0].clientX - rect.left; y=e.touches[0].clientY - rect.top; z=0.95 } else { x = (e.clientX || e.pageX) - rect.left; y = (e.clientY || e.pageY) - rect.top; z = 1.0 }
    mouse[0] = x; mouse[1]= y; mouse[2] = z }
  window.addEventListener('mousemove', updateMouse, {passive:true}); window.addEventListener('touchstart', updateMouse, {passive:true}); window.addEventListener('touchmove', updateMouse, {passive:true})

  // click / tap reaction: set a brief impulse recorded in device pixels
  function clickHandle(e){ const rect = canvas.getBoundingClientRect(); let cx=0, cy=0; if(e.touches && e.touches[0]){ cx = e.touches[0].clientX - rect.left; cy = e.touches[0].clientY - rect.top } else { cx = (e.clientX || e.pageX) - rect.left; cy = (e.clientY || e.pageY) - rect.top }
    const dpr = canvas.width / Math.max(1, canvas.clientWidth||1);
    click[0] = Math.max(0, Math.min(canvas.width, cx * dpr));
    click[1] = Math.max(0, Math.min(canvas.height, (canvas.clientHeight - cy) * dpr));
    click[2] = 1.6; // strength
  }
  canvas.addEventListener('click', clickHandle, {passive:true}); canvas.addEventListener('touchend', clickHandle, {passive:true});
  // In case other DOM layers intercept clicks, also listen globally and forward to shader
  window.addEventListener('click', clickHandle, {passive:true});
  window.addEventListener('pointerdown', clickHandle, {passive:true});
  window.addEventListener('touchend', clickHandle, {passive:true});
  document.addEventListener('click', clickHandle, {passive:true});

  window.addEventListener('deviceorientation', (ev)=>{
    if(ev.gamma == null) return
    motion[0] = ev.gamma/90; motion[1]= ev.beta/90
    // subtly offset mouse based on tilt
    mouse[0] = window.innerWidth*0.5 + motion[0]*window.innerWidth*0.15
    mouse[1] = window.innerHeight*0.5 + motion[1]*window.innerHeight*0.12
  }, {passive:true})

  function frame(){ const t = (performance.now()-start)/1000; gl.uniform1f(u_time, t);
    gl.uniform2f(u_res, canvas.width, canvas.height);
    // convert mouse (css px) -> device px, invert Y to match shader uv origin
    const dpr = canvas.width / Math.max(1, canvas.clientWidth || 1);
    const mx = mouse[0] * dpr;
    const my = (canvas.clientHeight - mouse[1]) * dpr;
    gl.uniform3f(u_mouse, mx, my, mouse[2]);
    // decay click strength over time
    const dt = Math.max(0.0, 1/60);
    if(click[2] > 0.0) click[2] = Math.max(0, click[2] - dt * 1.6);
    gl.uniform3f(u_click, click[0], click[1], click[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

})();
