const { join, resolve } = require('path');

module.exports = {
  mode: 'development',
  context: resolve(join(__dirname, 'client', 'js')),
  entry: {
    app: [
      './app',
    ],
  },
  output: {
    filename: 'js/[name].js',
  },
};
