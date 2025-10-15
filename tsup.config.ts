import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: "dist",
  target: "es5",
  minify: true,
  treeshake: true,
  legacyOutput: false
});
