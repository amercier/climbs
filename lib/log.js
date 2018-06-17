const {
  cyan, grey, magenta, blue, yellow, red,
} = require('chalk');

const severities = {
  DEBUG: 0,
  LOG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
};

const colors = [grey, magenta, blue, yellow, red];
const ribbons = ['DEBUG', '  LOG', ' INFO', ' WARN', 'ERROR'];

function format(value) {
  return typeof value === 'object' ? cyan(JSON.stringify(value)) : value;
}

function print(channel, severity, ...args) {
  const color = colors[severity];
  const ribbon = `${ribbons[severity]} •`;
  const message = args.map(format).join(' ');
  channel.write(`${color(ribbon)} ${message}\n`);
}

const makePrinter = (channel, severity) => (...args) => print(channel, severity, ...args);

const { stdout, stderr } = process;

module.exports = {
  severities,
  colors,
  ribbons,
  print,
  debug: makePrinter(stdout, severities.DEBUG),
  log: makePrinter(stdout, severities.LOG),
  info: makePrinter(stdout, severities.INFO),
  warn: makePrinter(stderr, severities.WARN),
  error: makePrinter(stderr, severities.ERROR),
};
