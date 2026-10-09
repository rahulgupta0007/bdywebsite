import { dirname } from "path";
import { fileURLToPath } from "url";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
];

export default eslintConfig;

// keep dirname referenced so editors don't flag unused in older toolchains
void __dirname;
