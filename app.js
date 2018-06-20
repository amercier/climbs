const server = require('server');
const { get } = require('server/router');
const { render } = require('server/reply');
const { cyan, red } = require('chalk');
const logPlugin = require('./server/plugins/log');

server.plugins.push(logPlugin);

const {
  requestInfoMiddleware,
  headersDebugMiddleware,
  sessionDebugMiddleware,
  userDebugMiddleware,
} = require('./lib/middleware');
const { notFoundMiddleware, errorRenderer } = require('./lib/error');

const config = {
  public: 'public',
  log: process.env.LOG || {
    development: { level: 'info', displayTime: false },
    production: 'warning',
    test: { level: 'notice', displayTime: false },
  }[process.env.NODE_ENV || 'development'],
};

const home = () => render('home.pug', { title: 'Strava Climbs' });
const routes = [
  get('/', home),
  get('/500', () => { throw new Error('Test error for /500'); }),
];

module.exports = server(
  config,
  requestInfoMiddleware,
  headersDebugMiddleware,
  sessionDebugMiddleware,
  userDebugMiddleware,
  routes,
  notFoundMiddleware,
  errorRenderer,
).then(({ options, log }) => {
  const { port, env } = options;
  log.info(`Started server in ${cyan(env)} mode, listening on port ${cyan(port)}`);
}).catch(({ message }) => {
  process.stderr.write(`Could not start server: ${red(message)}`);
  process.exit(1);
});
