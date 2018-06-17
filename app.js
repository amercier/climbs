const server = require('server');
const { get } = require('server/router');
const { render } = require('server/reply');
const { green, magenta } = require('chalk');
const { info } = require('./lib/log');
const {
  requestLogMiddleware,
  headersDebugMiddleware,
  sessionDebugMiddleware,
  userDebugMiddleware,
} = require('./lib/middleware');

const home = () => render('home.pug', { title: 'Strava Climbs' });

const routes = [
  get('/', home),
];

module.exports = server(
  requestLogMiddleware,
  headersDebugMiddleware,
  sessionDebugMiddleware,
  userDebugMiddleware,
  routes,
).then(({ options }) => {
  const { port, env } = options;
  info(`Started server in ${green(env)} mode, listening on port ${magenta(port)}`);
});
