module.exports = {
  parser: 'babel-eslint',
  rules: {
    'comma-dangle': [1, 'always-multiline'],
    'func-names': 0,
    'function-paren-newline': 1,
    'global-require': 0,
    indent: ['error', 2],
    'key-spacing': 1,
    'max-len': [
      1,
      200,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
      },
    ],
    'no-bitwise': ['error', { allow: ['&'] }],
    'no-console': 0,
    'no-multiple-empty-lines': 1,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': 0,
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': 1,
    'operator-linebreak': ['error', 'before'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'spaced-comment': 1,
  },
};
