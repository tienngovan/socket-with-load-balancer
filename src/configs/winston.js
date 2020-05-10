const winston = require('winston');

const env = require('./env');

const logger = winston.createLogger({
  level: env.logLevel,
  format: winston.format.json(),
  transports: [
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (env.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

module.exports = logger;
