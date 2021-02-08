var cluster = require('cluster');
var app = require('./app');
var debug = require('debug')('domain-service:server');
var appTools = require('../lib/appTools');
var http = require('http');

if (cluster.isMaster) {
  var workerCount = require('os').cpus().length;
  for (var i = 0; i < workerCount; i++) {
    cluster.fork();
  }

  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    cluster.fork();
  });
} else {
  var port = appTools.normalizePort(process.env.PORT || '3001');
  app.set('port', port);

  var server = http.createServer(app);

  server.listen(port);
  server.on('error', appTools.onError);
  server.on('listening', function () {
    console.log('listening');
  });
}
