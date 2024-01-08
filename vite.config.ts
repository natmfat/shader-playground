import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { resolve } from "path";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "shader-playground",
      fileName: "index",
    },
    rollupOptions: {
      external: ["three"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          three: "THREE",
        },
      },
    },
  },
  plugins: [dts()],
});
