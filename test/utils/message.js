const logger = require('../../src/configs/winston');
const messageQueue = require('../../src/configs/rsmq');

function sendMessage(name, userId, socketData) {
  messageQueue.sendMessage(
    {
      qname: name,
      message: JSON.stringify({ userId, socketData }),
    },
    (error, response) => {
      if (response) {
        logger.debug(`sent message with id: ${response}`);
      } else {
        logger.error(error);
      }
    },
  );
}

module.exports = {
  sendMessage,
};
