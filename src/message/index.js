const logger = require('../configs/winston');
const redisClient = require('../configs/redis');
const MessageQueueKey = require('../utils/MessageQueueKey');
const messageQueue = require('../configs/rsmq');
const messageHandler = require('./handler');

function createQueue(queueName) {
  return new Promise((resolve, reject) => {
    messageQueue.createQueue(
      {
        qname: queueName,
        vt: 60,
        delay: 0,
        maxsize: -1,
      },
      (error, response) => {
        if (response === 1) {
          logger.debug(`Queue [${queueName}] created`);
          resolve();
        } else {
          logger.debug(
            `Could not create queue [${queueName}] because of ${error}`,
          );
          if (error.message === messageQueue.ERRORS.queueExists) {
            resolve();
          } else {
            reject();
          }
        }
      },
    );
  });
}

function createQueues() {
  Promise.all([createQueue(MessageQueueKey.MESSAGE_QUEUE_NAME)])
    .then(() => {
      logger.debug('All queues are ready!!!');
      messageHandler.handleMessages(redisClient.duplicate());
    })
    .catch(() => {
      logger.error('Could not prepare all queues, please fix it!!!');
    });
}

module.exports = {
  createQueues,
};
