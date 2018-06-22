import './app.scss';

const log = (level, ...args) => console[level](...args);
log('info', 'Hello, World!');
