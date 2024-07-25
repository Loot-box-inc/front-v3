import { loadEnv, defineConfig } from 'vite'
// import { ngrok } from 'vite-plugin-ngrok'
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
// import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  base: "/front-v3",
  plugins: [
    // ngrok({
    //   domain: 'vitefront.ngrok.app',
    //   compression: true,
    //   authtoken: '2jKeWynFGyXYIWoTyPB7TDyOglw_4AaVMYmqvkh3m999bgzqb',
    // }),
    react(),
    tsconfigPaths(),
    svgr(),
    // basicSsl(),
  ],
  publicDir: "./public",
});
