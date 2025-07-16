import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import js from '@eslint/js';
import stylisticjs from '@stylistic/eslint-plugin-js';


export default defineConfig([
  js.configs.recommended,
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.node, ecmaVersion: 'latest' }, },
  pluginReact.configs.flat.recommended,
  {plugins: {
    '@stylistic/js': stylisticjs,
  },
  rules: {
    '@stylistic/js/indent': ['error', 2],
    '@stylistic/js/linebreak-style': ['error', 'unix'],
    '@stylistic/js/quotes': ['error', 'single'],
    '@stylistic/js/semi': ['error', 'never'],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', {before: true, after: true}],
    'no-console': 'off',
  },
  ignores: ['dist/**'],}

]);
