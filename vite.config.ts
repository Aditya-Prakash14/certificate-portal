import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Improve chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          framer: ['framer-motion'],
          pdflib: ['jspdf'],
        }
      }
    }
  },
  // Handle SPA routing in development mode
  server: {
    proxy: {
      // Redirect API requests that should go to Supabase
      '/api': {
        target: process.env.VITE_SUPABASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
