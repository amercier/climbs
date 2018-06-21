const server = require('server');
const { get } = require('server/router');
const { render } = require('server/reply');
const { cyan, red } = require('chalk');
const logPlugin = require('./server/plugins/log');

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
  log: process.env.LOG || {
    development: { level: 'info', displayTime: false },
    production: 'warning',
    test: { level: 'critical', displayTime: false },
  }[process.env.NODE_ENV || 'development'],
};

const home = () => render('home.pug', { title: 'Strava Climbs' });
const routes = [
  get('/', home),
  get('/500', () => { throw new Error('Test error for /500'); }),
];

module.exports = server(
  config,
  requestMiddleware('info'),
  headersMiddleware('debug'),
  sessionMiddleware('debug'),
  userMiddleware('debug'),
  routes,
  notFoundMiddleware,
  errorRenderer,
).then((ctx) => {
  const { port, env } = ctx.options;
  ctx.log.info(`Started server in ${cyan(env)} mode, listening on port ${cyan(port)}`);
  return ctx;
}).catch(({ message }) => {
  process.stderr.write(`Could not start server: ${red(message)}`);
  process.exit(1);
});
