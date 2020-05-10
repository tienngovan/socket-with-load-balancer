const redis = require('redis');
const bluebird = require('bluebird');

const env = require('./env');

bluebird.promisifyAll(redis);

const redisClient = redis.createClient(env.redis.uri);

module.exports = redisClient;
