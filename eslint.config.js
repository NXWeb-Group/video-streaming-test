import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["src/**/*.{js,ts,vue}"] },
  { files: ["index.ts", "server/**/*.{js,ts}"] },
  { ignores: ["**/*", "!src/**", "!index.ts", "!server/**"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
];
