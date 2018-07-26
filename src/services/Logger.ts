import * as winston from 'winston';
import {format, transports} from 'winston';
import {TransformableInfo} from 'logform';

const {printf, combine, label, timestamp} = format;

const myFormat = printf((info: TransformableInfo) => {
  const {timestamp, level, message, stack} = info;
  return `${timestamp} ${level}: ${message} ${(!stack ? '' : '\n' + stack)}`;
});

export const logger = winston.createLogger({
  format: combine(
    label({label: 'right meow!'}),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'info.log', level: 'info'})]
});