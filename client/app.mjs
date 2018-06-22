import './app.css';

const log = (level, ...args) => console[level](...args);
log('info', 'Hello, World!');
