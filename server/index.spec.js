/**
 * Typical device specs
 */
const desktopDevice = {
  viewport: { width: 1280, height: 720 },
  userAgent: 'Puppeteer @ 1280x720',
};

/**
 * Start a Puppeteer instance. Tries multiple times until it succeed or
 * `maxTries` is reached. This is useful because `puppeteer.launch` randomly
 * returns `undefined` on Travis CI.
 * @todo Investigate Travis CI error root cause
 *
 * @param {object} [options={}] Puppeteer launch options
 * @param {object} [puppeteer=require('puppeteer')] Puppeteer module
 * @param {number} [maxRetries=5]
 * @throws An error if `maxTries` is reached.
 * @return {Browser} The created Puppeteer instance
 */
async function launchPuppeteer(
  options = {},
  puppeteer = require('puppeteer'), // eslint-disable-line global-require
  maxTries = 5,
) {
  const tryLaunchPuppeteer = async (triesLeft) => {
    if (triesLeft === 0) {
      throw new Error(`Failed to launch Puppeteer after ${maxTries} retries.`);
    }
    const browser = await puppeteer.launch(options);
    return browser || tryLaunchPuppeteer(triesLeft - 1);
  };
  return tryLaunchPuppeteer(maxTries);
}

/**
 * Open a new browser page and
 * @param  {Browser} browser Puppeteer browser
 * @param  {Ctx} server Server.js ctx object returned by `server()`
 * @param  {String} [url='/'] Page URL
 * @param  {object} [deviceSpecs=desktopDevice] Device to emulate
 * @param  {boolean} [cacheEnabled=false] Enable caching (not recommended)
 * @return {object} A plain object containing the page and the response
 * @property {Page} page The Puppeteer page openened
 * @property {Response} response The Puppeteer response
 */
async function goto(browser, server, url = '/', deviceSpecs = desktopDevice, cacheEnabled = false) {
  const page = await browser.newPage();
  page.emulate(deviceSpecs);
  page.setCacheEnabled(cacheEnabled);
  const origin = `http://localhost:${server.options.port}`;
  const response = await page.goto(`${origin}/${url.replace(/^\/?/, '')}`);
  return { page, response };
}

/**
 * Wait for a HTML element to be present on the page, and return its HTML contents.
 * @param  {Page} page The Puppeteer page
 * @param  {string} selector A CSS selector to the element
 * @return {string} The element's `innerHTML` value
 */
async function innerHTML(page, selector) {
  await page.waitForSelector(selector);
  return page.$eval(selector, e => e.innerHTML);
}

describe('App', () => {
  let server;
  let browser;

  beforeAll(async () => {
    server = await (require('./index')); // eslint-disable-line global-require
    browser = await launchPuppeteer({ args: ['--no-sandbox'] });
  });

  afterAll(async () => {
    await browser.close();
    await server.close();
  });

  describe('GET /', () => {
    it('returns HTTP 200', async () => {
      const { response, page } = await goto(browser, server, '/');
      expect(response.status()).toBe(200);
      await page.close();
    });

    it('renders the homepage', async () => {
      const { page } = await goto(browser, server, '/');
      expect(await innerHTML(page, 'h1')).toBe('Strava Climbs');
      expect(await innerHTML(page, 'p')).toBe('Hello, world!');
      await page.close();
    });
  });

  describe('GET /non-existing-page', () => {
    it('returns HTTP 404', async () => {
      const { response, page } = await goto(browser, server, '/non-existing-page');
      expect(response.status()).toBe(404);
      await page.close();
    });

    it('renders the 404 page', async () => {
      const { page } = await goto(browser, server, '/non-existing-page');
      expect(await innerHTML(page, 'h1')).toBe('Oooops!');
      expect(await innerHTML(page, 'p')).toBe('You have gone the wrong way!');
      await page.close();
    });
  });

  describe('GET /500', () => {
    it('returns HTTP 500', async () => {
      const { response, page } = await goto(browser, server, '/500');
      expect(response.status()).toBe(500);
      await page.close();
    });

    it('renders the 500 page', async () => {
      const { page } = await goto(browser, server, '/500');
      expect(await innerHTML(page, 'h1')).toBe('Oooops!');
      expect(await innerHTML(page, 'p')).toBe('Looks like somethin broke!');
      await page.close();
    });
  });
});
