import cluster from 'cluster';
import http from 'http';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import * as appTools from '../lib/appTools';
import * as domainTools from '../lib/domainTools';
import dotenv from 'dotenv';
dotenv.config();

if (cluster.isMaster) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const workerCount = require('os').cpus().length;
  for (let i = 0; i < workerCount; i++) {
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
  // set up app
  const app = express();
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  const port = appTools.normalizePort(process.env.PORT || '3001');
  app.set('port', port);

  // Geolocation
  app.post('/geolocation', async function (req, res, next) {
    try {
      // use ping to get ip then do lookup
      const response = await domainTools.geolocation(req.body.host);
      res.json(response);
    } catch (err) {
      res.json(err);
    }
  });

  // RDAP
  app.post('/rdap', async function (req, res, next) {
    try {
      const ipRegex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
      const hostType = ipRegex.test(req.body.host) ? 'ip' : 'domain';
      const rdapResponse = await domainTools.rdap(req.body.host, hostType);
      res.json(rdapResponse);
    } catch (err) {
      res.json(err);
    }
  });

  // Reverse DNS
  app.post('/reversedns', async function (req, res, next) {
    try {
      const reverseDNSResponse = await domainTools.reverseDNS(req.body.host);
      res.json(reverseDNSResponse);
    } catch (err) {
      res.json(err);
    }
  });

  // Ping
  app.post('/ping', async function (req, res, next) {
    try {
      const pingResponse = await domainTools.pingHost(req.body.host);
      res.json(pingResponse);
    } catch (err) {
      res.json(err);
    }
  });

  const server = http.createServer(app);

  server.listen(port);
  server.on('error', appTools.onError);
  server.on('listening', function () {
    console.log('listening');
  });
}
