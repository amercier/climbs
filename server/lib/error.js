const { cyan, yellow, magenta } = require('chalk');
const { status: replyStatus } = require('server/reply');
const { error: routerError } = require('server/router');

class HttpError extends Error {
  constructor(status = 500, message = null) {
    super(message);
    this.status = status;
  }

  get statusText() {
    switch (this.status) {
      case 404: return 'Not Found';
      case 500: return 'Internal Server Error';
      default:
        throw new Error(`Status code not implemented: ${this.status}`);
    }
  }

  toString() {
    return `${this.status} ${this.statusText}`;
  }
}

function renderError(ctx, error = ctx.error) {
  if (error instanceof HttpError) {
    if (error.status < 500) { // 4xx
      ctx.log.notice(`Responding ${yellow(error)} to request ${cyan(`${ctx.method} ${ctx.url}`)}`);
    } else { // 5xx
      ctx.log.warning(`Responding ${magenta(error)} to request ${cyan(`${ctx.method} ${ctx.url}`)}`);
    }
    return replyStatus(error.status).render(`${error.status}.pug`);
  }

  // 500 Internal Error
  ctx.log.error('Uncaught error!', error);
  return renderError(ctx, new HttpError(500));
}

module.exports = {
  HttpError,
  notFoundMiddleware(ctx) {
    const { _headerSent: headerSent, statusCode } = ctx.res;
    if (!headerSent && statusCode !== 304) {
      throw new HttpError(404);
    }
  },
  renderError,
  errorRenderer: routerError(renderError),
};
