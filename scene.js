import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Group,
  Mesh,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  TorusKnotGeometry,
  WebGLRenderer
} from "./vendor/three.module.js";

// Colours: gold, warm yellow, pink, purple, teal.
const PALETTE = [
  [1.0, 0.79, 0.24],
  [1.0, 0.93, 0.62],
  [1.0, 0.31, 0.64],
  [0.61, 0.42, 1.0],
  [0.18, 0.89, 0.82]
];
const PALETTE_WEIGHTS = [0.3, 0.1, 0.25, 0.15, 0.2];

const glassVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;

const glassFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDissolve;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  vec3 film(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    float grain = hash(floor(vPos * 24.0));
    if (grain < uDissolve * 1.15 - 0.1) discard;

    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    if (!gl_FrontFacing) n = -n;
    float fres = pow(1.0 - abs(dot(n, v)), 2.2);

    vec3 irid = film(dot(n, vec3(0.3, 0.6, 0.7)) * 1.4 + fres * 1.8 + uTime * 0.06 + vPos.y * 0.25);
    vec3 warm = vec3(1.0, 0.82, 0.42);

    vec3 l1 = normalize(vec3(0.6, 0.9, 0.7));
    vec3 l2 = normalize(vec3(-0.7, -0.2, 0.6));
    float spec = pow(max(dot(n, normalize(l1 + v)), 0.0), 70.0) + 0.6 * pow(max(dot(n, normalize(l2 + v)), 0.0), 40.0);

    vec3 col = irid * (0.12 + 1.15 * fres) + warm * pow(fres, 5.0) * 0.7 + vec3(spec);
    float edge = smoothstep(uDissolve * 1.15 - 0.1, uDissolve * 1.15 + 0.02, grain);
    col += vec3(1.0, 0.5, 0.8) * (1.0 - edge) * 2.0;

    float alpha = clamp(0.1 + 0.9 * fres + spec, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uBurst;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aScatter;
  attribute vec4 aRnd;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float delay = aRnd.x * 0.4;
    float t = clamp((uBurst - delay) / 0.6, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 p = mix(position, aScatter, t);
    float phase = aRnd.z * 6.28318;
    vec3 drift = vec3(
      sin(uTime * (0.4 + aRnd.y * 0.6) + phase),
      cos(uTime * (0.3 + aRnd.w * 0.5) + phase * 1.3),
      sin(uTime * (0.5 + aRnd.x * 0.4) + phase * 0.7)
    );
    p += drift * (0.012 + 0.35 * t);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.35 + aRnd.w) * (0.55 + 0.9 * t) * uPixelRatio / -mv.z;

    vColor = aColor;
    float twinkle = 0.65 + 0.35 * sin(uTime * (1.5 + aRnd.y * 2.0) + phase);
    vAlpha = mix(0.32, 0.9, t) * twinkle;
  }
`;

const particleFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor + vec3(0.25) * a, a * vAlpha * uOpacity);
  }
`;

function pickColour() {
  let r = Math.random();
  for (let i = 0; i < PALETTE.length; i += 1) {
    r -= PALETTE_WEIGHTS[i];
    if (r <= 0) return PALETTE[i];
  }
  return PALETTE[0];
}

function buildParticles(source, count) {
  const src = source.attributes.position.array;
  const srcNormals = source.attributes.normal.array;
  const vertexCount = src.length / 3;

  const home = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const rnd = new Float32Array(count * 4);
  const colour = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const v = (Math.random() * vertexCount) | 0;
    const jitter = (Math.random() - 0.5) * 0.08;
    const hx = src[v * 3] + srcNormals[v * 3] * jitter;
    const hy = src[v * 3 + 1] + srcNormals[v * 3 + 1] * jitter;
    const hz = src[v * 3 + 2] + srcNormals[v * 3 + 2] * jitter;
    home.set([hx, hy, hz], i * 3);

    // Burst outward from the emblem into a wide field that fills the screen.
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    let dx = hx * 0.6 + Math.sin(phi) * Math.cos(theta);
    let dy = hy * 0.6 + Math.sin(phi) * Math.sin(theta);
    let dz = hz * 0.6 + Math.cos(phi);
    const len = Math.hypot(dx, dy, dz) || 1;
    const radius = 2.2 + Math.pow(Math.random(), 0.6) * 7.5;
    dx = (dx / len) * radius * 1.35;
    dy = (dy / len) * radius;
    dz = (dz / len) * radius * 0.7 - 1.5;
    scatter.set([dx, dy, dz], i * 3);

    rnd.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    colour.set(pickColour(), i * 3);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(home, 3));
  geometry.setAttribute("aScatter", new BufferAttribute(scatter, 3));
  geometry.setAttribute("aRnd", new BufferAttribute(rnd, 4));
  geometry.setAttribute("aColor", new BufferAttribute(colour, 3));
  return geometry;
}

export function createStage(canvas, motion, { lite = false } = {}) {
  let renderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: !lite,
      alpha: true,
      powerPreference: lite ? "low-power" : "high-performance"
    });
  } catch {
    return false;
  }

  const maxDpr = lite ? 1.5 : 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(0, 0, 7);

  const emblem = new Group();
  scene.add(emblem);

  const glassGeometry = new TorusKnotGeometry(1, 0.3, lite ? 128 : 260, lite ? 16 : 36, 2, 3);
  const glassMaterial = new ShaderMaterial({
    vertexShader: glassVertex,
    fragmentShader: glassFragment,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uDissolve: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide
  });
  const glass = new Mesh(glassGeometry, glassMaterial);
  emblem.add(glass);

  const sampleGeometry = new TorusKnotGeometry(1, 0.3, 320, 40, 2, 3);
  const particleGeometry = buildParticles(sampleGeometry, lite ? 2500 : 16000);
  sampleGeometry.dispose();
  const particleMaterial = new ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    uniforms: {
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uSize: { value: lite ? 40 : 34 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uOpacity: { value: 1 }
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending
  });
  const particles = new Points(particleGeometry, particleMaterial);
  emblem.add(particles);

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  let narrow = false;
  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    narrow = width < 760;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = narrow ? 9 : 7;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    document.documentElement.classList.remove("webgl");
  });

  const start = performance.now();
  let burst = 0;
  let spin = 0;
  let last = start;

  // Stop drawing while the tab is hidden; on phones also cap to ~30 fps.
  let running = true;
  const minFrame = lite ? 1000 / 31 : 0;
  let lastDraw = 0;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(render);
    }
  });

  function render(now) {
    if (!running) return;
    if (minFrame && now - lastDraw < minFrame) {
      requestAnimationFrame(render);
      return;
    }
    lastDraw = now;
    const time = (now - start) / 1000;
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;

    burst += ((motion.burst || 0) - burst) * 0.08;
    const reform = motion.reform || 0;
    const heroLift = Math.min(motion.scrollVh || 0, 1);

    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;

    spin += delta * (0.18 + burst * 0.25);
    emblem.rotation.set(0.35 + pointer.sy * 0.25 + Math.sin(time * 0.3) * 0.1, spin + pointer.sx * 0.4, 0);
    const baseY = narrow ? 1.1 : 0.55;
    emblem.position.y = (baseY + heroLift * 1.4) * (1 - reform) + 0.6 * reform;
    const scale = (narrow ? Math.min(0.85, Math.max(0.5, camera.aspect * 1.3)) : 0.85) * (1 + burst * 0.25);
    emblem.scale.setScalar(scale);

    glassMaterial.uniforms.uTime.value = time;
    glassMaterial.uniforms.uDissolve.value = Math.min(1, burst * 1.6);
    glassMaterial.uniforms.uOpacity.value = (1 - Math.min(1, burst * 1.3)) * (1 - reform * 0.3);
    glass.visible = burst < 0.75;

    particleMaterial.uniforms.uTime.value = time;
    particleMaterial.uniforms.uBurst.value = burst;
    // Dim the field behind content so text stays readable.
    particleMaterial.uniforms.uOpacity.value = 1 - burst * 0.4;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  return true;
}
