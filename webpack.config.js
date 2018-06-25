const { join, resolve } = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  context: resolve(join(__dirname, 'client')),
  entry: {
    app:
      [
        './app.mjs',
      ].concat(isProduction ? [] : [
        'webpack-hot-middleware/client?noInfo=true',
      ]),
  },
  output: {
    filename: isProduction ? '[name].[chunkhash:7].js' : '[name].js',
  },
  module: {
    rules: [
      // Babel compilation: `*.mjs` => `*.js`
      {
        test: /\.mjs$/,
        exclude: /\/node_modules\//,
        use: 'babel-loader',
        type: 'javascript/auto', // Required for module.hot.accept()
      },
      // Sass compilation and loading: `import 'xxx.scss';`
      {
        test: /\.scss$/,
        exclude: /\/node_modules\//,
        use: [
          'style-loader',
          `css-loader${isProduction ? '' : '?sourceMap'}`,
          `sass-loader${isProduction ? '' : '?sourceMap'}`,
          `postcss-loader${isProduction ? '' : '?sourceMap'}`,
        ],
      },
    ],
  },
  devtool: isProduction ? 'none' : 'source-map',
  plugins: isProduction ? [
    new WebpackAssetsManifest({ output: '.assets.json' }),
  ] : [
    new HotModuleReplacementPlugin(),
  ],
};
