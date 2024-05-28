import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
// import devtools from 'solid-devtools/vite';
import { resolve } from 'path'
import { CRX_BACKGROUND_OUTDIR } from './globalConfig'

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  build: {
    outDir: CRX_BACKGROUND_OUTDIR,
    lib: {
      entry: resolve(__dirname, 'src/background.tsx'),
      name: 'background.js',
      fileName: () => 'background.js',
    },
  },
})
