import { defineConfig } from "vite";
import { copyFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    {
      name: "copy-html-components",
      writeBundle() {
        const componentsSrcDir = resolve(__dirname, "components");
        const distComponentsDir = resolve(__dirname, "dist/components");

        if (!existsSync(distComponentsDir)) {
          mkdirSync(distComponentsDir, { recursive: true });
        }

        // Dynamically find all .html files in the components directory
        const componentFiles = readdirSync(componentsSrcDir).filter((file) =>
          file.endsWith(".html")
        );

        componentFiles.forEach((file) => {
          const srcPath = resolve(componentsSrcDir, file);
          const destPath = resolve(distComponentsDir, file);

          copyFileSync(srcPath, destPath);
          console.log(`Copied component: ${file}`);
        });
      },
    },
  ],
});
