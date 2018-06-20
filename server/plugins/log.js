const {
  red, yellow, magenta, blue, grey, cyan,
} = require('chalk');
const { inspect } = require('util');

const defaults = {
  levels: ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'],
  colors: [red.bold, red, red.bold, red, magenta, yellow, blue, grey],
  inverse: [true, true],
  separator: '•',
  labels: ['EMERG', 'ALERT', 'CRITI', 'ERROR', ' WARN', ' NOTE', ' INFO', 'DEBUG'],
  format(value) {
    if (value instanceof Error) {
      const indent = string => string.replace(/\n */g, '\n        ');
      const message = value.message ? indent(value.message.trim()) : '<Unknown error>';
      let stack = '';
      if (value.stack) {
        stack = indent(value.stack.replace(`${value}`, ''));
      }
      return `${red(message)}${stack && `\n${grey(stack)}\n`}`;
    } else if (typeof value === 'object') {
      return cyan(inspect(value));
    }
    return value;
  },
  stream: level => (level <= 4 ? process.stderr : process.stdout),
};

class Log {
  constructor(level, stream = defaults.stream, options = {}) {
    // Options
    Object.assign(this, defaults, { ...options, stream });
    this.level = this.levels.indexOf(level);

    // Level methods
    this.levels.forEach((name, logLevel) => {
      this[name] = (...args) => this.print(logLevel, ...args);
    });
  }

  print(level, ...args) {
    if (level <= this.level) {
      const color = this.colors[level];
      const labelColor = this.inverse[level] ? color.inverse : color;
      const label = `${this.labels[level]}`;
      const message = args.map(this.format).join(' ');
      const stream = typeof this.stream === 'function' ? this.stream(level) : this.stream;
      stream.write(`${labelColor(label)} ${color(this.separator)} ${message}\n`);
    }
  }
}

// Log plugin
module.exports = {
  name: 'log',
  options: {
    __root: 'level',
    level: {
      default: 'info',
      type: String,
      enum: Log.levels,
    },
    report: {
      default: process.stdout,
    },
  },
  init: (ctx) => {
    ctx[module.exports.name] = new Log(ctx.options.log.level, ctx.options.log.report);
  },
};
