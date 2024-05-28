import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
// import devtools from 'solid-devtools/vite';
import { resolve } from 'path'
import { CRX_CONFIRM_OUTDIR, endWith } from './globalConfig'

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  root: './',
  build: {
    outDir: CRX_CONFIRM_OUTDIR,
    rollupOptions: {
      input: {
        confirm: resolve(__dirname, 'confirm/index.html'),
      },
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames(chunkInfo) {
          if (chunkInfo.name && endWith(chunkInfo.name, '.css')) {
            return 'css/index-[hash].css'
          }
          return '[ext]/[name]-[hash].[ext]'
        },
        manualChunks(id) {
          if (id.indexOf('node_modules') !== -1) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})
