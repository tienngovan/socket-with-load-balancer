# SOCKET WITH LOAD BALANCER

## Requires:

- Nodejs v12+
- Redis-server
- Create .env file follow env-template

## Start socket server

### Start multiple server with difference port

#### First server

```
PORT=3001 node src/index.js
```

#### and Second server

```
PORT=3002 node src/index.js
```

#### and others

```
...
```

## Start testing client

#### Start populate message to message queue (Simulate sending message from server side)

```
node test/message.js
```

#### Start clients (Slimulate some client receiving message)

```
node test/socket.js
```
