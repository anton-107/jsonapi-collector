module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["/dist/**/*", "coverage/**/*"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-console": "error",
    "no-duplicate-imports": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "max-depth": ["error", 2],
    "max-nested-callbacks": ["error", 2],
    "max-lines-per-function": ["error", 60],
    "max-statements": ["error", 26],
    "max-params": ["error", 3],
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.dev.ts", "specs/**/*.ts"],
      rules: {
        "max-lines-per-function": "off",
        "max-statements": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "max-nested-callbacks": ["error", 3],
      },
    },
    {
      files: ["**/*.dev.ts"],
      rules: {
        "no-console": "off",
      },
    },
  ],
};
