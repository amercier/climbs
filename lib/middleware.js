const { cyan } = require('chalk');

module.exports = {
  userDebugMiddleware({ log, user }) {
    if (user) {
      log.debug('User detected', user);
    } else {
      log.debug('No user detected');
    }
  },

  requestInfoMiddleware({
    log, method, url, data,
  }) {
    const dataInfo = Object.keys(data).length > 0 ? ['with data', data] : [];
    log.info('Received request', cyan(`${method} ${url}`), ...dataInfo);
  },

  headersDebugMiddleware({ log, headers }) {
    log.debug('Headers:', headers);
  },

  sessionDebugMiddleware({ log, session }) {
    log.debug('Session data:', session);
  },
};
