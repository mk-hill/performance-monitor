/**
 * Gather performance data from all node clients, serve in react client
 *
 * https://github.com/elad/node-cluster-socket.io
 *
 * Entry point for cluster
 * Spawn workers which will handle socket.io data flow
 */

const express = require('express');
const cluster = require('cluster');
const net = require('net');
const socketio = require('socket.io');
// const helmet = require('helmet')

const port = process.env.PORT || 8181;
const numProcesses = require('os').cpus().length;

// have to run redis via: $ redis-server
// check to see if it's running -- redis-cli monitor
const ioRedis = require('socket.io-redis');
const farmhash = require('farmhash');
const socketWorker = require('./socketWorker');

if (cluster.isMaster) {
  // This stores our workers. We need to keep them to be able to reference
  // them based on source IP address. It's also useful for auto-restart,
  // for example.
  const workers = [];

  // Helper function for spawning worker at index 'i'.
  const spawn = (i) => {
    workers[i] = cluster.fork();

    // Optional: Restart worker on exit
    workers[i].on('exit', (code, signal) => {
      // console.log('respawning worker', i);
      spawn(i);
    });
  };

  // Spawn workers.
  for (let i = 0; i < numProcesses; i++) {
    spawn(i);
  }

  // Helper function for getting a worker index based on IP address.
  // This is a hot path so it should be really fast. The way it works
  // is by converting the IP address to a number by removing non numeric
  // characters, then compressing it to the number of slots we have.
  //
  // Compared against "real" hashing (from the sticky-session code) and
  // "real" IP number conversion, this function is on par in terms of
  // worker index distribution only much faster.
  //
  // Ensures each ip is assigned the same worker even after reconnect
  const getWorkerIndex = (ip, len) => farmhash.fingerprint32(ip) % len; // works with IPv6 too

  // in this case, we are going to start up a tcp connection via the net
  // module INSTEAD OF the http module. Express will use http, but we need
  // an independent tcp port open for cluster to work. This is the port that
  // will face the internet
  const server = net.createServer({ pauseOnConnect: true }, (connection) => {
    // We received a connection and need to pass it to the appropriate
    // worker. Get the worker for this connection's source IP and pass
    // it the connection.
    const worker = workers[getWorkerIndex(connection.remoteAddress, numProcesses)];
    worker.send('sticky-session:connection', connection);
  });
  server.listen(port);
  console.log(`Master listening on port ${port}`);
} else {
  // Note we don't use a port here because the master listens on it for us.
  const app = express();
  // app.use(express.static(__dirname + '/public'));
  // app.use(helmet());

  // Not exposing worker express server to the outside world.
  const expressServer = app.listen(0, 'localhost');
  // console.log("Worker listening...");
  const server = socketio(expressServer);

  // Tell Socket.IO to use the redis adapter. By default, the redis
  // server is assumed to be on localhost:6379. You don't have to
  // specify them explicitly unless you want to change them.
  // redis-cli monitor
  server.adapter(ioRedis({ host: 'localhost', port: 6379 }));

  // Here you might use Socket.IO middleware for authorization etc.
  // on connection, send the socket over to our module with socket stuff
  server.on('connection', (socket) => {
    socketWorker(server, socket);
    console.log(`connected to worker: ${cluster.worker.id}`);
  });

  // Listen to messages sent from the master. Ignore everything else.
  process.on('message', (message, connection) => {
    if (message !== 'sticky-session:connection') {
      return;
    }

    // Emulate a connection event on the server by emitting the
    // event with the connection the master sent us.
    expressServer.emit('connection', connection);

    connection.resume();
  });
}
