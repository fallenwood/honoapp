import * as esbuild from 'esbuild';
// import * as cssModulesPlugin from 'esbuild-plugin-css-modules';
const cssModulesPlugin = require('esbuild-plugin-css-modules');
const monacoPlugin = require("./plugins");

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  format: "",
  outdir: '../../static/live',
  plugins: [
    // cssModulesPlugin(),
    monacoPlugin({
      pathPrefix: "/static/live",
      destDir: "../../static/live"
    }),
  ],
  loader: {
    '.ttf': 'file',
    '.css': 'empty'
  },
  sourcemap: true,
});
