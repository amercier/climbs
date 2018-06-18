const { yellow, red } = require('chalk');
const { status: replyStatus } = require('server/reply');
const { error: routerError } = require('server/router');
const { warn, error } = require('./log');

class HttpError extends Error {
  constructor(status = 500, message = null) {
    super(message);
    this.status = status;
  }

  get statusText() {
    switch (this.status) {
      case 404: return 'Not Found';
      default:
        warn('Status code not implemented:', this.status);
        return 'Internal Server Error';
    }
  }

  toString() {
    return `${this.status} ${this.statusText}`;
  }

  static fromError(err) {
    if (err instanceof HttpError) {
      return err;
    }
    if (err instanceof Error) {
      return new HttpError(500, err.stack);
    }
    return new HttpError(500, `${err}`);
  }
}

module.exports = {
  HttpError,

  notFoundMiddleware(ctx) {
    if (!ctx.res._headerSent) { // eslint-disable-line no-underscore-dangle
      throw new HttpError(404);
    }
  },

  errorRenderer: routerError((ctx) => {
    // HTTP errors
    if (ctx.error instanceof HttpError) {
      if (ctx.error.status < 500) { // 4xx
        warn(yellow(`${ctx.error}: ${ctx.method} ${ctx.url}`));
      } else { // 4xx
        error(red(`${ctx.error}: ${ctx.method} ${ctx.url}`));
      }
      return replyStatus(ctx.error.status).render(`${ctx.error.status}.pug`);
    }

    // 500 Internal Error
    error(red('Middleware error!', `${ctx.error}`));
    return replyStatus(500).render('500.pug');
  }),
};
