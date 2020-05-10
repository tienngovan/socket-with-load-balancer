const logger = require('../configs/winston');
const socketServer = require('../configs/socket');
const socketService = require('./service');
const socketHandler = require('./handler');

function saveSocketConnection(socket) {
  socketService
    .saveSocket(socket)
    .then(result => {
      logger.debug(`Socket - ${socket.id}: connected with result: ${result}`);

      socketHandler.handleMessages(socket);
    })
    .catch(error => {
      logger.error(`Could not save socket: ${error}`);

      socket.disconnect(true);
    });
}

function handleNewConnection(socket) {
  logger.debug(`Socket - ${socket.id}: new connection`);

  if (socket.handshake.query.token === undefined) {
    logger.debug(`Socket - ${socket.id}: token not found`);

    socket.disconnect(true);
    return;
  }
  socket.userId = socket.handshake.query.token;

  saveSocketConnection(socket);
}

function handleDisconnectConnection(socket, reason) {
  logger.debug(`Socket - ${socket.id}: disconnected because of: ${reason}`);

  socketService
    .getSocket(socket.userId)
    .then(socketId => {
      if (
        socketId &&
        socketId.toString().trim().length > 0 &&
        socketId === socket.id
      ) {
        logger.debug(
          `socketId is this socket.id, delete all data for ${socket.userId}`,
        );

        socketService.deleteSocket(socket.userId);
      } else {
        logger.debug(
          `socketId is not this socket.id, will not delete data for ${socket.userId}`,
        );
      }
    })
    .catch(error => {
      logger.error(error);
    });
}

function monitorConnection() {
  socketServer.on('connection', socket => {
    handleNewConnection(socket);

    socket.on('disconnect', reason => {
      handleDisconnectConnection(socket, reason);
    });
    socket.on('error', error => {
      logger.error(error);
    });
  });
}

module.exports = {
  monitorConnection,
};
