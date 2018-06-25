const renderMock = jest.fn();
const statusMock = jest.fn(() => ({ render: renderMock }));
jest.doMock('server/reply', () => ({ status: statusMock }));

const {
  HttpError,
  notFoundMiddleware,
  renderError,
} = require('./error');

// Workaround for https://github.com/mattphillips/jest-chain/issues/1
const it2 = (message, fn) => it(message, async (...args) => fn(...args)); // eslint-disable-line jest/consistent-test-it, max-len

describe('lib/error', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('HttpError', () => {
    describe('constructor()', () => {
      it2('constructs instances of HttpError', () => expect(new HttpError()).toBeInstanceOf(HttpError));
      it2('constructs instances of Error', () => expect(new HttpError()).toBeInstanceOf(Error));
      it2('stores status', () => expect(new HttpError(404)).toHaveProperty('status', 404));
      it2('sets status to 500 by default', () => expect(new HttpError()).toHaveProperty('status', 500));
      it2('stores message', () => expect(new HttpError(undefined, 'MESSAGE')).toHaveProperty('message', 'MESSAGE'));
    });

    describe('get statusText()', () => {
      it2('handles 404 Not Found', () => expect(new HttpError(404).statusText).toEqual('Not Found'));
      it2('handles 500 Internal Server Error', () => expect(new HttpError(500).statusText).toEqual('Internal Server Error'));
      it2('throws an error on unimplemented errors', () => expect(() => new HttpError(600).statusText).toThrow('Status code not implemented: 600'));
    });

    describe('toString()', () => {
      it2('returns "<status> <statusText>"', () => expect(`${new HttpError(404)}`).toEqual('404 Not Found'));
    });
  });

  describe('notFoundMiddleware', () => {
    const ctx = (headerSent, statusCode) => ({ res: { _headerSent: headerSent, statusCode } });
    it2('is a function expecting 1 parameter', () => expect(notFoundMiddleware).toBeFunction().toHaveProperty('length', 1));
    it2('passes through if res.statusCode is 304', () => expect(() => notFoundMiddleware(ctx(false, 304))).not.toThrow());
    it2('passes through if res._headerSent is true', () => expect(() => notFoundMiddleware(ctx(true, 200))).not.toThrow());
    it2('throw 404 Not Found otherwise', () => expect(() => notFoundMiddleware(ctx(false, 200))).toThrow(new HttpError(404)));
  });

  describe('renderError', () => {
    const logMock = { warning: jest.fn(), notice: jest.fn(), error: jest.fn() };

    beforeEach(() => {
    });

    describe('when error is 404 Not Found', () => {
      it('returns HTTP 404', () => {
        renderError({ log: logMock, error: new HttpError(404) });
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenLastCalledWith(404);
      });

      it('renders 404.pug', () => {
        renderError({ log: logMock, error: new HttpError(404) });
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenLastCalledWith('404.pug');
      });

      it('logs a notice message', () => {
        renderError({
          log: logMock, method: 'GET', url: '/test-404', error: new HttpError(404),
        });
        expect(logMock.notice).toHaveBeenCalledTimes(1);
        expect(logMock.notice).toHaveBeenLastCalledWith(expect.ansiStripped('Responding 404 Not Found to request GET /test-404'));
      });
    });

    describe('when error is 500 Internal Server Error', () => {
      it('returns HTTP 500', () => {
        renderError({ log: logMock, error: new HttpError(500) });
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenLastCalledWith(500);
      });

      it('renders 500.pug', () => {
        renderError({ log: logMock, error: new HttpError(500) });
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenLastCalledWith('500.pug');
      });

      it('logs a notice message', () => {
        renderError({
          log: logMock, method: 'GET', url: '/test-500', error: new HttpError(500),
        });
        expect(logMock.warning).toHaveBeenCalledTimes(1);
        expect(logMock.warning).toHaveBeenLastCalledWith(expect.ansiStripped('Responding 500 Internal Server Error to request GET /test-500'));
      });

      describe('when error is a runtime error', () => {
        it('returns HTTP 500', () => {
          renderError({ log: logMock, error: new Error('Runtime error') });
          expect(statusMock).toHaveBeenCalledTimes(1);
          expect(statusMock).toHaveBeenLastCalledWith(500);
        });

        it('renders 500.pug', () => {
          renderError({ log: logMock, error: new Error('Runtime error') });
          expect(renderMock).toHaveBeenCalledTimes(1);
          expect(renderMock).toHaveBeenLastCalledWith('500.pug');
        });

        it('logs an error message and then a notice message', () => {
          renderError({
            log: logMock, method: 'GET', url: '/test-500', error: new Error('Runtime error'),
          });
          expect(logMock.error).toHaveBeenCalledTimes(1);
          expect(logMock.error).toHaveBeenLastCalledWith('Uncaught error!', expect.any(Error));
          expect(logMock.warning).toHaveBeenCalledTimes(1);
          expect(logMock.warning).toHaveBeenLastCalledWith(expect.ansiStripped('Responding 500 Internal Server Error to request GET /test-500'));

          // Workaround until https://github.com/jest-community/jest-extended/commit/bb94682 is released
          if (logMock.error.mock.timestamps) {
            throw new Error('TODO: cleanup');
          }
          logMock.error.mock.timestamps = logMock.error.mock.invocationCallOrder;
          logMock.warning.mock.timestamps = logMock.warning.mock.invocationCallOrder;

          expect(logMock.error).toHaveBeenCalledBefore(logMock.warning);
        });
      });
    });

    describe('errorRenderer', () => {
      it('is delegating error handling to errorHandler', () => {
        const routerErrorMock = jest.fn(require('server/router').error); // eslint-disable-line global-require
        jest.resetModules();
        jest.doMock('server/router', () => ({ error: routerErrorMock }));
        const { renderError: localRenderError, errorRenderer } = require('./error'); // eslint-disable-line global-require
        expect(routerErrorMock).toHaveBeenCalledTimes(1);
        expect(routerErrorMock).toHaveBeenLastCalledWith(localRenderError);
        expect(routerErrorMock).toHaveReturnedWith(errorRenderer);
      });
    });
  });
});
