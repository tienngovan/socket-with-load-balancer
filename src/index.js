const logger = require('./configs/winston');
const env = require('./configs/env');
const server = require('./configs/express');
const socketServer = require('./socket');
const messageServer = require('./message');

server.listen(process.env.PORT || env.port, () => {
  logger.debug(`Server started on port ${env.port} (${env.env})`);
});

messageServer.createQueues();
socketServer.monitorConnection();
