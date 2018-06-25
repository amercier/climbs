Climbs
======

> Cycling climbs visualizer for ![Strava logo](https://d3nn82uaxijpm6.cloudfront.net/favicon-16x16.png) [Strava].

[![Build Status](https://travis-ci.org/amercier/climbs.svg?branch=master)](https://travis-ci.org/amercier/climbs)

Requirements
------------

- [Node.js] 8+, with **npm** 5+

Getting started
---------------

### Installation

Install <img src="https://static.npmjs.com/da3ab40fb0861d15c83854c29f5f2962.png" height=16px> [npm] dependencies:

```sh
npm install
```

[![dependencies Status](https://david-dm.org/amercier/climbs/status.svg)](https://david-dm.org/amercier/climbs)
[![devDependencies Status](https://david-dm.org/amercier/climbs/dev-status.svg)](https://david-dm.org/amercier/climbs?type=dev)

### Development server

```sh
npm run dev
```

### Linting and testing

Run linters:
- <img src="https://eslint.org/img/favicon.512x512.png" height=16px> [ESLint] for `.js` and `.mjs` files
- <img src="https://www.markdownguide.org/favicon.ico" height=16px> [markdownlint] for `.md` files
- <img src="https://sass-lang.com/favicon.ico" height=16px> [sass-lint] for `.scss` files
- <img src="https://editorconfig.org/favicon.ico" height=16px> [editorconfig-checker] for all text files

```sh
npm run lint
```

Run tests with <img src="https://facebook.github.io/jest/img/favicon/favicon.ico" height=16px> [Jest]:

```sh
npm test
```

[![Coverage](https://img.shields.io/codecov/c/github/amercier/climbs.svg)](https://codecov.io/gh/amercier/climbs)

### Production server

#### 1. Build production assets

```sh
npm run build
```

#### 2. Start production server

```sh
NODE_ENV=production npm start
```

License
-------

[![License](https://img.shields.io/github/license/amercier/nuxt-playground.svg)](./LICENSE.md)

[Strava]: https://www.strava.com/
[Node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[ESLint]: https://eslint.org/
[markdownlint]: https://github.com/DavidAnson/markdownlint
[sass-lint]: https://github.com/sasstools/sass-lint
[editorconfig-checker]: https://github.com/editorconfig-checker/editorconfig-checker.javascript
[Jest]: https://facebook.github.io/jest/
