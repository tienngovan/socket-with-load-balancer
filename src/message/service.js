const logger = require('../configs/winston');
const socketService = require('../socket/service');

function sendMessage(userId, socketKey, socketData) {
  if (userId === 'ALL_USER') {
    socketService.emitMessageToAll(socketKey, socketData);
  } else {
    socketService
      .getSocket(userId)
      .then(socketId => {
        if (socketId && socketId.toString().trim().length > 0) {
          logger.debug(`Send socket message: ${socketKey} to user: ${userId}`);
          socketService.emitMessage(socketId, socketKey, socketData);
        } else {
          logger.debug(`Socket not found for user: ${userId}`);
        }
      })
      .catch(error => {
        logger.error(error);
      });
  }
}

module.exports = {
  sendMessage,
};
