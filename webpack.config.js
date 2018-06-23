const { join, resolve } = require('path');

module.exports = {
  mode: 'development',
  context: resolve(join(__dirname, 'client')),
  entry: {
    'app.js': './app.mjs',
  },
  output: {
    filename: '[name]',
  },
  module: {
    rules: [
      // Babel compilation: `*.mjs` => `*.js`
      {
        test: /\.mjs$/,
        exclude: /\/node_modules\//,
        use: ['babel-loader'],
      },
      // Sass compilation and loading: `import 'xxx.ccss';`
      {
        test: /\.scss$/,
        exclude: /\/node_modules\//,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devtool: 'source-map',
};
