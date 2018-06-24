const {
  red, yellow, magenta, blue, grey, cyan, bold,
} = require('chalk');
const dateFormat = require('dateformat');
const { dirname } = require('path');
const { inspect } = require('util');
const { separateMessageFromStack, formatStackTrace } = require('jest-message-util');

function formatError(error) {
  const { message, stack } = separateMessageFromStack(error.stack);
  const stackTrace = formatStackTrace(
    stack,
    { rootDir: dirname(dirname(__dirname)), testMatch: [] },
    { noStackTrace: false },
  );
  const indent = string => string.replace(/\n */g, '\n        ');
  return indent(`${red(message)}\n${stackTrace}\n`);
}

function formatObject(object) {
  const message = inspect(object, {
    colors: true, compact: false, depth: 5, breakLength: 100,
  });
  const indent = string => string.replace(/\n/g, '\n        ');
  return cyan(message.length < 200 ? message.replace(/\n */g, ' ') : indent(`\n\n${message}\n`, true));
}

function format(value) {
  if (value instanceof Error) {
    return formatError(value);
  }
  switch (typeof value) {
    case 'object': return formatObject(value);
    case 'string': return value;
    case 'null': return bold(value);
    case 'undefined': return grey(value);
    default: return yellow(value);
  }
}

const defaults = {
  levels: ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'],
  colors: [red.bold, red, red.bold, red, magenta, yellow, blue, grey],
  inverse: [true, true],
  labels: ['EMERG', 'ALERT', 'CRITI', 'ERROR', ' WARN', ' NOTE', ' INFO', 'DEBUG'],
  separator: '•',
  stream: level => (level <= 4 ? process.stderr : process.stdout),
  format,
  displayTime: true,
};

module.exports = class Log {
  constructor(level, options = {}) {
    // Options
    Object.assign(this, defaults, options);
    this.level = this.levels.indexOf(level);

    // Level methods
    this.levels.forEach((name, logLevel) => {
      this[name] = (...args) => this.print(logLevel, ...args);
    });
  }

  print(level, ...args) {
    if (level <= this.level) {
      const time = this.displayTime ? dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l') : '';
      const color = this.colors[level];
      const labelColor = this.inverse[level] ? color.inverse : color;
      const label = `${this.labels[level]}`;
      const message = args.map(this.format).join(' ');
      const stream = typeof this.stream === 'function' ? this.stream(level) : this.stream;
      const { separator } = this;
      stream.write(`${time && grey(`${time} ${separator}`)} ${labelColor(label)} ${color(separator)} ${message}\n`);
    }
  }

  static fromEnvironment(environment = 'development') {
    return new this(...({
      development: ['info', { displayTime: false }],
      production: ['warning'],
      test: ['critical', { displayTime: false }],
    }[environment]));
  }
};
