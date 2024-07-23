import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
// import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  base: "/front-v3",
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    // basicSsl(),
  ],
  publicDir: "./public",
});
