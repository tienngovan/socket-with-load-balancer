const messageQueue = require('../configs/rsmq');
const logger = require('../configs/winston');
const MessageQueueKey = require('../utils/MessageQueueKey');
const messageService = require('./service');

function sendMessage(queueName, messageString) {
  const message = JSON.parse(messageString);

  messageService.sendMessage(message.userId, queueName, message.socketData);
}

function deleteMessage(queueName, messageId) {
  messageQueue.deleteMessage(
    { qname: queueName, id: messageId },
    (deleteError, deleteResponse) => {
      if (deleteResponse === 1) {
        logger.debug(`Deleted message with id: ${messageId}`);
      } else {
        logger.debug(
          `Could not delete message with id ${messageId} because of ${deleteError}`,
        );
      }
    },
  );
}

function handleMessage(queueName) {
  messageQueue.receiveMessage({ qname: queueName }, (error, response) => {
    logger.debug(`Message data: ${response.message}`);
    if (response && response.id) {
      sendMessage(queueName, response.message);
      deleteMessage(queueName, response.id);
    } else {
      logger.debug(
        'Could not receive message, message may be received in another server',
      );
    }
  });
}

function checkStuckMessage(queueName) {
  messageQueue.popMessage({ qname: queueName }, (error, response) => {
    if (response && response.id) {
      logger.debug(`Found a stuck message: ${response.id}, send it`);
      sendMessage(queueName, response.message);
      logger.debug(`Recheck stuck messages for queue [${queueName}]`);
      checkStuckMessage(queueName);
    } else {
      logger.debug(`No stuck messages for queue [${queueName}]`);
    }
  });
}

function sendStuckMessages() {
  messageQueue.listQueues((error, response) => {
    if (response) {
      response.forEach(queueName => {
        logger.debug(`Check stuck messages for queue [${queueName}]`);
        checkStuckMessage(queueName);
      });
    } else {
      logger.debug(`Could not get all queues because of ${error}`);
    }
  });
}

function handleMessages(redisClient) {
  sendStuckMessages();

  redisClient.on('subscribe', (channel, count) => {
    logger.debug(`Listening to channel: ${channel} - count: ${count}`);
  });
  redisClient.on('message', (channel, message) => {
    logger.debug(
      `Receive message on channel: ${channel} - message: ${message}`,
    );

    switch (channel) {
      case MessageQueueKey.MESSAGE_CHANNEL_NAME:
        handleMessage(MessageQueueKey.MESSAGE_QUEUE_NAME);
        break;
      default:
        logger.debug(`Could not handle message for channel [${channel}]`);
    }
  });

  redisClient.subscribe(MessageQueueKey.MESSAGE_CHANNEL_NAME);
}

module.exports = {
  handleMessages,
};
