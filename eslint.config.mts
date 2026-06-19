import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";

export default defineConfig([
    {
        ignores: [
            "build/**",
            ".plasmo/**",
            "release/**",
            "test-results/**",
            "playwright-report/**",
            "node_modules/**",
        ],
    },
    {
        files: ["{src,tests}/**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {js},
        extends: [
            "js/recommended",
            ...tseslint.configs.recommended,
        ],
        languageOptions: {globals: globals.browser},
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        },
    },
]);
