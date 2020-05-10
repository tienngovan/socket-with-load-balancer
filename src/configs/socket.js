const socketIO = require('socket.io');
const redisAdapter = require('socket.io-redis');

const server = require('./express');
const env = require('./env');

const socketServer = socketIO.listen(server, {
  pingInterval: 2000,
  pingTimeout: 5000,
});
socketServer.adapter(redisAdapter(env.redis.uri));

module.exports = socketServer;
