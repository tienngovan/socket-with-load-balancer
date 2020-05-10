const http = require('http');
const express = require('express');
const createError = require('http-errors');
const expressWebService = require('@financial-times/express-web-service');
const HealthCheck = require('@financial-times/health-check');

const env = require('./env');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const health = new HealthCheck({
  checks: [
    {
      // the memory check
      type: 'memory',
      threshold: 80,
      interval: 15000,
      id: 'system-memory',
      name: 'System Memory Usage',
      severity: 2,
      businessImpact: 'Things may be slow',
      technicalSummary: 'Something went wrong!',
      panicGuide: "Don't panic",
    },
    {
      // the CPU check
      type: 'cpu',
      threshold: 80,
      interval: 5000,
      id: 'system-cpu',
      name: 'System CPU Usage',
      severity: 2,
      businessImpact: 'Things may be slow',
      technicalSummary: 'Something went wrong!',
      panicGuide: "Don't panic",
    },
    {
      // the disk space check
      type: 'disk-space',
      threshold: 80,
      interval: 15000,
      id: 'system-disk-space',
      name: 'System Disk Space Usage',
      severity: 2,
      businessImpact: 'New files may not be saved',
      technicalSummary: 'Something went wrong!',
      panicGuide: "Don't panic",
    },
  ],
});

app.use(
  '/manage',
  expressWebService({
    manifestPath: `${__dirname}/../../package.json`,
    about: {
      schemaVersion: 1,
      name: 'websocket',
    },
    healthCheck: health.checks(),
  }),
);

app.get('/', (req, res, next) => {
  next(createError(403));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env.env !== 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = http.createServer(app);

module.exports = server;
