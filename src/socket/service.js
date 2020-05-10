const socketServer = require('../configs/socket');
const redisClient = require('../configs/redis');

function userPrefix(string) {
  return `user_${string}`;
}

async function saveSocket(socket) {
  const data = await redisClient
    .multi()
    .hset(userPrefix(socket.userId), 'socketId', socket.id)
    .hset(userPrefix(socket.userId), 'onlineTime', String(new Date().getTime()))
    .expire(userPrefix(socket.userId), 172800) // 2 days
    .execAsync();
  return [data[0], data[1]];
}

async function getSocket(userId) {
  const data = await redisClient
    .multi()
    .hget(userPrefix(userId), 'socketId')
    .expire(userPrefix(userId), 172800) // 2 days
    .execAsync();
  return data[0];
}

async function deleteSocket(userId) {
  const data = await redisClient
    .multi()
    .hdel(userPrefix(userId), 'socketId')
    .hdel(userPrefix(userId), 'onlineTime')
    .expire(userPrefix(userId), 60) // 1 min
    .execAsync();
  return data[0];
}

function emitMessage(room, eventName, data) {
  socketServer.to(room).emit(eventName, data);
}

function emitMessageToAll(eventName, data) {
  socketServer.emit(eventName, data);
}

module.exports = {
  saveSocket,
  getSocket,
  deleteSocket,
  emitMessage,
  emitMessageToAll,
};
