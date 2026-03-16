import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "10.10.7.46",
    port: 3015,
    allowedHosts: ["https://rimaiziza-dashboard.vercel.app", "https://dashboard.gogreenmatrix.my"]
  },
})
