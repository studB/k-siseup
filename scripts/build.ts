#!/usr/bin/env bun
import { rm, chmod } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: [join(root, "installer/cli.ts")],
  outdir: dist,
  target: "node",
  format: "esm",
  sourcemap: "external",
  naming: "[name].[ext]",
  external: [],
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

await chmod(join(dist, "cli.js"), 0o755);
console.log("Build complete -> dist/cli.js");
