import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import sass from "node-sass";
import copy from "rollup-plugin-copy";

const processSass = function (context) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file: context,
      },
      function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};

export default {
  input: "src/index.ts",
  plugins: [
    resolve(),
    typescript(),
    commonjs(),
    terser(),
    postcss({
      // extract: true,
      extract: "style/index.css",
      minimize: true,
      extensions: ["css", "scss"],
      process: processSass,
    }),
    copy({
      targets: [{ src: "src/style", dest: "dist" }],
    }),
  ],
  output: [
    {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].cjs.js",
    },
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].esm.js",
    },
    {
      dir: "dist",
      format: "umd",
      entryFileNames: "[name].umd.js",
      name: "bundleName",
    },
  ],
};
