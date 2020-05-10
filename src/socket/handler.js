const logger = require('../configs/winston');
const messageService = require('../message/service');

function handleChatMessages(socket) {
  socket.on('message', fromMessage => {
    let { message } = fromMessage;
    if (fromMessage.toUserId == null || message == null) {
      logger.debug('To user is empty');
    } else {
      const toMessage = fromMessage;
      toMessage.message = message;
      toMessage.fromUserId = socket.userId;
      toMessage.sendAt = new Date().getTime();
      toMessage.type = 'chat';

      messageService.sendMessage(
        toMessage.toUserId,
        'incomeMessage',
        toMessage,
        toMessage,
      );
    }
  });
}

function handleMessages(socket) {
  handleChatMessages(socket);
}

module.exports = {
  handleMessages,
};
