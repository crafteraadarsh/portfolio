import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const files = [
  "index.html",
  "styles.css",
  "app.js",
  "portfolio-data.js",
  "scene.js",
  "photo.jpg",
  "fonts",
  "vendor"
];

await Promise.all(
  files.map((file) => cp(join(root, file), join(dist, file), { force: true, recursive: true }))
);

console.log("Built static portfolio into dist/");
