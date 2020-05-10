const RedisSMQ = require('rsmq');

const redisClient = require('./redis');

const rsmq = new RedisSMQ({
  client: redisClient,
  realtime: true,
});

module.exports = rsmq;
