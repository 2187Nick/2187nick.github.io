import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable source maps
    minify: false, // Disable minification for debugging
    rollupOptions: {
      input: {
        main: './index.html',
        space_invader: './space_invader.html',
        snake: './snake_react.html'
      },
      output: {
        assetFileNames: (assetInfo) => {
          return `assets/[name]-[hash][extname]`;
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  server: {
    open: '/index.html'
  }
});