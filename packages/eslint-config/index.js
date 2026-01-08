const {
  rules: airbnbImportsRules,
} = require('eslint-config-airbnb-base/rules/imports')

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [],
  rules: {
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'default-case': 'off',

    'import/extensions': [
      airbnbImportsRules['import/extensions'][0],
      airbnbImportsRules['import/extensions'][1],
      {
        ...airbnbImportsRules['import/extensions'][2],
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.config.{js,ts}'],
      },
    ],
  },
}
