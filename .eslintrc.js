module.exports = {
  env: {
    es2021: true,
    node: true,
  },

  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-console": ["error", { allow: ["warn", "error", "log"] }],
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
