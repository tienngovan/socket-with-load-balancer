const MessageQueueKey = require('../src/utils/MessageQueueKey');
const { sendMessage } = require('./utils/message');

setInterval(() => {
  sendMessage(MessageQueueKey.MESSAGE_QUEUE_NAME, 'u1', { test: 'xxx' });
}, 3000);

setInterval(() => {
  sendMessage(MessageQueueKey.MESSAGE_QUEUE_NAME, 'u2', { test: 'yyy' });
}, 4000);

setInterval(() => {
  sendMessage(MessageQueueKey.MESSAGE_QUEUE_NAME, 'ALL_USER', { test: 'zzz' });
}, 5000);
