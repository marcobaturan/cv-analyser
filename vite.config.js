import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // If we wanted to proxy /api explicitly in pure Vite dev, 
    // we would setup a proxy here or use apiMiddleware.
    // For Vercel dev we will just use `vercel dev`, 
    // but configuring Vite server just in case:
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true
        }
      }
    }
  };
});
