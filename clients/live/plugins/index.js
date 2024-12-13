const { features } = require("./features");
const { languagesList } = require("./languages");
const path = require('path');
const { promises: fs } = require("fs");
const esbuild = require("esbuild")

const languagesById = languagesList.reduce((languagesById, language) => {
  languagesById[language.label] = language;
  return languagesById;
}, {});

const featuresById = features.reduce((featuresById, feature) => {
  featuresById[feature.label] = feature;
  return featuresById;
}, {});

const EDITOR_MODULE = {
  label: 'editorWorkerService',
  entry: undefined,
  worker: {
    id: 'vs/editor/editor',
    entry: 'vs/editor/editor.worker'
  }
};

function getFeaturesIds(userFeatures) {
  function notContainedIn(arr) {
    return function (element) { return arr.indexOf(element) === -1; };
  }
  var featuresIds = [];
  if (userFeatures.length) {
    var excludedFeatures = userFeatures
      .filter(function (f) { return f[0] === '!'; })
      .map(function (f) { return f.slice(1); });
    if (excludedFeatures.length) {
      featuresIds = Object.keys(featuresById).filter(notContainedIn(excludedFeatures));
    }
    else {
      featuresIds = userFeatures;
    }
  }
  else {
    featuresIds = Object.keys(featuresById);
  }
  return featuresIds;
}

function coalesce(array) {
  return array.filter(Boolean);
}

// Implements a proper way inject specific languages when editor.api.js is loaded
// currently you must inject the languages manually with the editor.api.js
// here an example.
// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import 'monaco-editor/esm/vs/basic-languages/elixir/elixir.contribution';
//
// We inject all languages when editor.main.js is loaded
// TODO provided features and languages specified also must be injected when editor.api.js is loaded.
// node_modules/monaco-editor/esm/vs/basic-languages/monaco.contribution.js
// console.log(languageConfigs.map(l => l.entry).join(',').split(',').map(entry => `monaco-editor/esm/${entry}.js`).join('\n'));
module.exports = (options = { languages: [] }) => ({
  name: 'monaco-editor-plugin',
  setup(build) {
    const pathPrefix = options.pathPrefix || '/assets/';
    options.define = options.define || {}
    options.define['process.env.NODE_ENV'] =
      options.minify ? '"production"' : '"development"'

    const destDir = options.destDir || '../priv/static/assets'

    const languages = options.languages || Object.keys(languagesById);
    const languageConfigs = coalesce(languages.map(id => languagesById[id]));
    const features = getFeaturesIds(options.features || []);
    const featureConfigs = coalesce(features.map(id => featuresById[id]));

    const modules = [EDITOR_MODULE].concat(languageConfigs).concat(featureConfigs);

    const workers = [];
    modules.forEach(module => {
      if ('worker' in module && module.worker) {
        workers.push({
          label: module.label,
          id: module.worker.id,
          entry: module.worker.entry,
        });
      }
    });

    const workerPaths = {};
    for (const { label, entry } of workers) {
      workerPaths[label] = `${entry}.js`;
      if (workerPaths['typescript']) {
        // javascript shares the same worker
        workerPaths['javascript'] = workerPaths['typescript'];
      }
      if (workerPaths['css']) {
        // scss and less share the same worker
        workerPaths['less'] = workerPaths['css'];
        workerPaths['scss'] = workerPaths['css'];
      }
      if (workerPaths['html']) {
        // handlebars, razor and html share the same worker
        workerPaths['handlebars'] = workerPaths['html'];
        workerPaths['razor'] = workerPaths['html'];
      }
    }
    const workerEntryList = workers.map(worker => `monaco-editor/esm/${worker.entry}.js`);

    build.onLoad({ filter: /esm[/\\]vs[/\\]editor[/\\]editor.(api|main).js/ }, async (args) => {
      const code = await fs.readFile(args.path, 'utf8');

      const globals = {
        MonacoEnvironment: `(function (paths) {
            function stripTrailingSlash(str) {
              return str.replace(/\\/$/, '');
            }
            return {
              getWorkerUrl: function (moduleId, label) {
                var pathPrefix = ${JSON.stringify(pathPrefix)};
                var result = (pathPrefix ? stripTrailingSlash(pathPrefix) + '/' : '') + paths[label];
                if (/^((http:)|(https:)|(file:)|(\\/\\/))/.test(result)) {
                  var currentUrl = String(window.location);
                  var currentOrigin = currentUrl.substr(0, currentUrl.length - window.location.hash.length - window.location.search.length - window.location.pathname.length);
                  if (result.substring(0, currentOrigin.length) !== currentOrigin) {
                    var js = '/*' + label + '*/importScripts("' + result + '");';
                    var blob = new Blob([js], { type: 'application/javascript' });
                    return URL.createObjectURL(blob);
                  }
                }
                return result;
              }
            };
          })(${JSON.stringify(workerPaths, null, 2)})`,
      };

      const stylesheet = `
        function stripTrailingSlash(str) {
          return str.replace(/\\/$/, '');
        }
        var pathPrefix = ${JSON.stringify(pathPrefix)};
        var style = document.createElement('link');
          style.type = 'text/css';
          style.rel = 'stylesheet';
          style.href = (pathPrefix ? stripTrailingSlash(pathPrefix) + '/' : '') + 'editor.main.css';

        document.head.appendChild(style);
      `;
      return {
        contents: `${stylesheet}\n${code}\n${Object.keys(globals).map(
          key => `self[${JSON.stringify(key)}] = ${globals[key]};`
        )}`,
        loader: 'js',
      }
    })

    build.onEnd(() => {
      esbuild.build({
        entryPoints: ['monaco-editor/min/vs/editor/editor.main.css'],
        bundle: true,
        outbase: 'monaco-editor/min/vs/editor',
        outdir: `${destDir}`,
        loader: {
          '.ttf': 'file',
        }
      })

      esbuild.build({
        entryPoints: workerEntryList,
        bundle: true,
        format: 'iife',
        outbase: 'monaco-editor/esm/',
        outdir: `${destDir}`
      });
    })
  }
});
