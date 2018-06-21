const { cyan } = require('chalk');
const {
  requestMiddleware,
  userMiddleware,
  headersMiddleware,
  sessionMiddleware,
} = require('./middleware');

describe('lib/middleware', () => {
  describe('requestMiddleware', () => {
    it('returns a function', () => {
      expect(requestMiddleware()).toBeFunction();
    });

    it('should log request information using the given level', () => {
      const spyRequestMiddleware = requestMiddleware('spy');
      const spy = jest.fn();

      spyRequestMiddleware({
        log: { spy }, method: 'METHOD 1', url: 'URL 1', data: 'DATA',
      });
      expect(spy).toHaveBeenLastCalledWith('Received request', cyan('METHOD 1 URL 1'), 'with data', 'DATA');
      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockClear();

      spyRequestMiddleware({
        log: { spy }, method: 'METHOD 2', url: 'URL 2', data: {},
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('Received request', cyan('METHOD 2 URL 2'));
    });
  });

  describe('userMiddleware', () => {
    it('returns a function', () => {
      expect(userMiddleware()).toBeFunction();
    });

    it('should log user information using the given level', () => {
      const spyUserMiddleware = userMiddleware('spy');
      const spy = jest.fn();

      spyUserMiddleware({ log: { spy }, user: 'USER' });
      expect(spy).toHaveBeenLastCalledWith('User detected', 'USER');
      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockClear();

      spyUserMiddleware({ log: { spy } });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('No user detected');
    });
  });

  describe('headersMiddleware', () => {
    it('returns a function', () => {
      expect(headersMiddleware()).toBeFunction();
    });

    it('should log headers information using the given level', () => {
      const spyHeadersMiddleware = headersMiddleware('spy');
      const spy = jest.fn();

      const headers = { test: 'OK' };
      spyHeadersMiddleware({ log: { spy }, headers });
      expect(spy).toHaveBeenLastCalledWith('Headers:', headers);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('sessionMiddleware', () => {
    it('returns a function', () => {
      expect(sessionMiddleware()).toBeFunction();
    });

    it('should log session information using the given level', () => {
      const spySessionMiddleware = sessionMiddleware('spy');
      const spy = jest.fn();

      const session = { test: 'OK' };
      spySessionMiddleware({ log: { spy }, session });
      expect(spy).toHaveBeenLastCalledWith('Session data:', session);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
