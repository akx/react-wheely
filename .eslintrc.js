module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/order": "off",
    "import/prefer-default-export": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "no-use-before-define": "off",
    "react/jsx-filename-extension": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "react/jsx-curly-newline": "off",
  },
};
