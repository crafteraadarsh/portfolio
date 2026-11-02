// Entry used to produce vendor/three.module.js: a minified bundle containing
// only the parts of three.js (MIT licence) that scene.js uses.
// Regenerate with:
//   npx esbuild scripts/three-entry.js --bundle --minify --format=esm --legal-comments=inline --outfile=vendor/three.module.js
export {
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
} from "three";
