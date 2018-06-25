import './app.scss';
import { log } from './console.mjs';

// Note: `type: 'javascript/auto'` is required in `webpack.config.js` for this.
if (module.hot) {
  module.hot.accept();
}

log('Hello, World!');
