const { join, resolve } = require('path');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
  mode: 'development',
  context: resolve(join(__dirname, 'client')),
  entry: {
    'app.js': [
      './app.mjs',
      'webpack-hot-middleware/client?noInfo=true',
    ],
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
        type: 'javascript/auto', // Required for module.hot.accept()
      },
      // Sass compilation and loading: `import 'xxx.scss';`
      {
        test: /\.scss$/,
        exclude: /\/node_modules\//,
        use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
};
