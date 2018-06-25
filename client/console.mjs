const logToConsole = (level, ...args) => console[level](...args);
export const log = (...args) => logToConsole('log', ...args);
export const debug = (...args) => logToConsole('debug', ...args);
export const warn = (...args) => logToConsole('warn', ...args);
export const error = (...args) => logToConsole('error', ...args);
