const socketIO = require('socket.io-client');
const logger = require('../src/configs/winston');

function startSocket() {
  const socket = socketIO('http://localhost:3001?token=u1');
  socket.on('connect', function() {
    logger.debug('Socket 1 connected');
  });
  socket.on('incomeMessage', function(data) {
    logger.debug(`Income Data 1 ${JSON.stringify(data)}`);
  });
  socket.on('disconnect', function() {});
}

function startSocket2() {
  const socket = socketIO('http://localhost:3002?token=u2');
  socket.on('connect', function() {
    logger.debug('Socket 2 connected');
  });
  socket.on('incomeMessage', function(data) {
    logger.debug(`Income Data 2 ${JSON.stringify(data)}`);
  });
  socket.on('disconnect', function() {});
}

startSocket();
startSocket2();
