const { cyan } = require('chalk');

module.exports = {
  requestMiddleware(level) {
    return ({
      log, method, url, data,
    }) => {
      const dataInfo = Object.keys(data).length > 0 ? ['with data', data] : [];
      log[level]('Received request', cyan(`${method} ${url}`), ...dataInfo);
    };
  },

  userMiddleware(level) {
    return ({ log, user }) => {
      if (user) {
        log[level]('User detected', user);
      } else {
        log[level]('No user detected');
      }
    };
  },

  headersMiddleware(level) {
    return ({ log, headers }) => {
      log[level]('Headers:', headers);
    };
  },

  sessionMiddleware(level) {
    return ({ log, session }) => {
      log[level]('Session data:', session);
    };
  },
};
