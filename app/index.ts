import cluster from 'cluster';
import http from 'http';
import Joi from 'joi';
import express from 'express';
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
  // VALIDATION SCHEMA
  const domainSchema = Joi.object({
    host: Joi.alternatives().try(Joi.string().domain(), Joi.string().ip()).required(),
    service: Joi.string() // helpful for identifying which request is being returned
  });

  // SET UP APP
  const app: express.Application = express();

  app.get('*', function (req, res, next) {
    console.log('request made to worker ' + cluster.worker.id + ':pid ' + cluster.worker.process.pid);
    next();
  });

  // Geolocation
  app.get('/geolocation', async function (req, res, next) {
    try {
      const validatedQuery = await domainSchema.validateAsync(req.query);
      const response = await domainTools.geolocation(validatedQuery.host);
      res.json(response);
    } catch (err) {
      next(err);
    }
  });

  // RDAP
  app.get('/rdap', async function (req, res, next) {
    try {
      const validatedQuery = await domainSchema.validateAsync(req.query);
      const rdapResponse = await domainTools.rdap(validatedQuery.host);
      res.json(rdapResponse);
    } catch (err) {
      next(err);
    }
  });

  // Reverse DNS
  app.get('/reversedns', async function (req, res, next) {
    try {
      const validatedQuery = await domainSchema.validateAsync(req.query);
      const reverseDNSResponse = await domainTools.reverseDNS(validatedQuery.host);
      res.json(reverseDNSResponse);
    } catch (err) {
      next(err);
    }
  });

  // Ping
  app.get('/ping', async function (req, res, next) {
    try {
      const validatedQuery = await domainSchema.validateAsync(req.query);
      const pingResponse = await domainTools.pingHost(validatedQuery.host);
      res.json(pingResponse);
    } catch (err) {
      next(err);
    }
  });

  // RETURN ERRORS
  app.use(function (err, req, res, next) {
    const errResponse = {
      error: err
    };
    res.status(500).json(errResponse);
  });

  const server = http.createServer(app);
  const port = process.env.PORT || 3001;
  server.listen(port);

  server.on('listening', () => {
    console.log('listening on port ' + port);
  });
}
