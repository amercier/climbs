const express = require('express');
const server = require('server');
const { get } = require('server/router');
const { render } = require('server/reply');
const { cyan, red } = require('chalk');
const logPlugin = require('./plugins/log');

server.plugins.push(logPlugin);

const {
  requestMiddleware,
  headersMiddleware,
  sessionMiddleware,
  userMiddleware,
} = require('./lib/middleware');
const { notFoundMiddleware, errorRenderer } = require('./lib/error');

const config = {
  public: 'public',
  views: 'server/views',
  log: process.env.LOG || {
    development: { level: 'info', displayTime: false },
    production: 'info',
    test: { level: 'critical', displayTime: false },
  }[process.env.NODE_ENV || 'development'],
};

const assetPath = path => (
  process.env.NODE_ENV === 'production'
    ? require('../dist/.assets')[path] // eslint-disable-line global-require, import/no-unresolved
    : `/${path}`
);

const home = () => render('home.pug', { assetPath, title: 'Strava Climbs' });
const routes = [
  get('/', home),
  get('/500', () => { throw new Error('Test error for /500'); }),
];

const middlewares = [
  requestMiddleware('info'),
  headersMiddleware('debug'),
  sessionMiddleware('debug'),
  userMiddleware('debug'),
];

const { modern } = server.utils;
if (process.env.NODE_ENV === 'production') {
  middlewares.push(modern(express.static('dist', { immutable: true, maxAge: '1y' })));
} else {
  const webpack = require('webpack'); // eslint-disable-line global-require, import/no-extraneous-dependencies
  const webpackDevMiddleware = require('webpack-dev-middleware'); // eslint-disable-line global-require, import/no-extraneous-dependencies
  const webpackHotMiddleware = require('webpack-hot-middleware'); // eslint-disable-line global-require, import/no-extraneous-dependencies
  const webpackConfig = require('../webpack.config'); // eslint-disable-line global-require
  const webpackCompiler = webpack(webpackConfig);
  middlewares.push(
    modern(webpackDevMiddleware(webpackCompiler, {
      stats: 'minimal',
      logLevel: 'warn',
    })),
    modern(webpackHotMiddleware(webpackCompiler, {
      log: false,
    })),
  );
}

module.exports = server(
  config,
  ...middlewares,
  routes,
  notFoundMiddleware,
  errorRenderer,
).then((ctx) => {
  const { port, env } = ctx.options;
  ctx.log.info(`Started server in ${cyan(env)} mode, listening on port ${cyan(port)}`);
  return ctx;
}).catch(({ message }) => {
  process.stderr.write(`Could not start server: ${red(message)}\n`);
  process.exit(1);
});
