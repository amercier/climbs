const server = require('server');
const { get } = require('server/router');
const { render } = require('server/reply');
const { cyan, red } = require('chalk');
const Log = require('./lib/log');

const {
  requestMiddleware,
  headersMiddleware,
  sessionMiddleware,
  userMiddleware,
} = require('./lib/middleware');
const { notFoundMiddleware, errorRenderer } = require('./lib/error');

const log = process.env.LOG ? new Log(process.env.LOG) : Log.fromEnvironment(process.env.NODE_ENV);

const config = {
  public: 'public',
  log: { instance: log },
};

const home = () => render('home.pug', { title: 'Strava Climbs' });
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

if (process.env.NODE_ENV === 'production') {
  config.public = 'dist';
} else {
  const webpack = require('webpack'); // eslint-disable-line global-require, import/no-extraneous-dependencies
  const webpackDevMiddleware = require('webpack-dev-middleware'); // eslint-disable-line global-require, import/no-extraneous-dependencies
  const webpackHotMiddleware = require('webpack-hot-middleware'); // eslint-disable-line global-require, import/no-extraneous-dependencies
  const webpackConfig = require('./webpack.config'); // eslint-disable-line global-require
  const { modern } = server.utils;
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
  log.critical(`Could not start server: ${red(message)}\n`);
  process.exit(1);
});
