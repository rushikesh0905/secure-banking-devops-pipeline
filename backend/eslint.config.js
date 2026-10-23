export default [
  {
    ignores: ['coverage/**'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off'
    }
  }
];

