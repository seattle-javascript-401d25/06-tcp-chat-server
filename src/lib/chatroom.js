'use strict';

const EventEmitter = require('events');
const net = require('net');
const logger = require('./logger');
const Client = require('../model/client');


const PORT = process.env.PORT || 3000;

const server = net.createServer();
const event = new EventEmitter();
const socketPool = {};

const parseData = (buffer) => {
  const text = buffer.toString().trim();
  if (!text.startsWith('@')) return null;

  const [command, ...message] = text.split(' ');

  logger.log(logger.INFO, `THIS IS THE MESSAGE: ${command}`);
  logger.log(logger.INFO, `THIS IS THE MESSAGE: ${message}`);

  return { command, message };
};

const dispatchAction = (client, buffer) => {
  const entry = parseData(buffer);
  if (entry) event.emit(entry.command, entry, client);
};

// these are all the event listeners
event.on('@all', (data, client) => {
  logger.log(logger.INFO, data);
  Object.keys(socketPool).forEach((clientIdKey) => {
    const targetedClient = socketPool[clientIdKey];
    targetedClient.socket.write(`<${client.nickname}>: ${data.message}\n`);
  });
});

event.on('@nickname', (data, client) => {
  logger.log(logger.INFO, data);
  socketPool[client._id].nickname = data.message;
  client.socket.write(`You have changed your client name to ${data.message}\n`);
});

event.on('@list', (data, client) => {
  logger.log(logger.INFO, data);
  Object.keys(socketPool).forEach((clientIdKey) => {
    client.socket.write(`${socketPool[clientIdKey].nickname}\n`);
  });
});

event.on('@quit', (data, client) => {
  logger.log(logger.INFO, data);
  // remove from socketPool
  delete socketPool[client._id];
  client.socket.destroy();
});

server.on('connection', (socket) => {
  const client = new Client(socket);

  socket.write(`Welcome to the chatroom, ${client.nickname}!\n`);
  // keep a record of that client in our socketPool by making a 
  // new key value pair that looks like this:
  // { 'dafsaed922919101: { 
  //   _id: dafsaed922919101,
  //   nickname: Client no. dafsaed922919101,
  //   socket: really big object
  // }}
  socketPool[client._id] = client;
  logger.log(logger.INFO, `A new client ${client.nickname} has entered the chatroom!`);

  socket.on('data', (buffer) => {
    dispatchAction(client, buffer);
  }); 
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, () => {
        logger.log(logger.INFO, `Server up on PORT: ${PORT}`);
      });
    }, 1000);
  } else {
    console.log(err);
  }
});

server.listen(PORT, () => {
  logger.log(logger.INFO, `Server up on PORT: ${PORT}`);
});
