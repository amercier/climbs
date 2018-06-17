const { green } = require('chalk');
const { log, debug } = require('./log');

module.exports = {
  userDebugMiddleware({ user }) {
    if (user) {
      debug('User detected', user);
    } else {
      debug('No user detected');
    }
  },

  requestLogMiddleware({ method, url, data }) {
    log('Received request', green(`${method} ${url}`), data && 'with data', data);
  },

  headersDebugMiddleware({ headers }) {
    debug('Headers:', headers);
  },

  sessionDebugMiddleware({ session }) {
    debug('Session data:', session);
  },
};
