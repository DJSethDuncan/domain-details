var express = require('express');
import { Request, Response, NextFunction } from 'express';
var DomainTools = require('../lib/domainTools')  
var path = require('path');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config();

// Geolocation
app.post('/geolocation', async function (req: Request, res: Response, next: NextFunction) {
    try {
        // use ping to get ip then do lookup
        let response = await DomainTools.geolocation(req.body.host)
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})

// RDAP
app.post('/rdap', async function (req: Request, res: Response, next: NextFunction) {
    try {
        let ipRegex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
        let hostType = (ipRegex.test(req.body.host)) ? 'ip' : 'domain';
        let rdapResponse = await DomainTools.rdap(req.body.host, hostType);
        res.json(rdapResponse)
    } catch (err) {
        res.json(err)
    }
})

// Reverse DNS
app.post('/reversedns', async function (req: Request, res: Response, next: NextFunction) {
    try {
        let reverseDNSResponse = await DomainTools.reverseDNS(req.body.host)
        res.json(reverseDNSResponse)
    } catch (err) {
        res.json(err)
    }
})


// Ping
app.post('/ping', async function (req: Request, res: Response, next: NextFunction) {
    try {
        let pingResponse = await DomainTools.ping(req.body.host)
        res.json(pingResponse)
    } catch (err) {
        res.json(err)
    }
})

module.exports = app;
