const server = require('server');
const { get } = require('server/router');
const { render } = require('server/reply');
const { green, magenta, red } = require('chalk');
const { info, error } = require('./lib/log');
const {
  requestLogMiddleware,
  // headersDebugMiddleware,
  // sessionDebugMiddleware,
  // userDebugMiddleware,
} = require('./lib/middleware');
const { notFoundMiddleware, errorRenderer } = require('./lib/error');

const config = {
  public: 'public',
};

const home = () => render('home.pug', { title: 'Strava Climbs' });
const routes = [
  get('/', home),
];

module.exports = server(
  config,
  requestLogMiddleware,
  // headersDebugMiddleware,
  // sessionDebugMiddleware,
  // userDebugMiddleware,
  routes,
  notFoundMiddleware,
  errorRenderer,
).then(({ options }) => {
  const { port, env } = options;
  info(`Started server in ${green(env)} mode, listening on port ${magenta(port)}`);
}).catch(({ message }) => {
  error(`Could not start server: ${red(message)}`);
  process.exit(1);
});
