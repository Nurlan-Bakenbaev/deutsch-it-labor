import {defineConfig} from 'vite';
export default defineConfig({
  build:{rollupOptions:{output:{manualChunks(id){
    if(id.includes('/src/data/'))return 'curriculum';
    if(id.includes('node_modules'))return 'vendor';
  }}}},
});
