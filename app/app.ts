var express = require('express');
import { Request, Response, NextFunction } from 'express';
var path = require('path');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GEOIP
app.post('/geoip', function (req: Request, res: Response, next: NextFunction) {
    try {
        let response = {
            requrestedDomain: '',
            requestedDomainType: '',
            geoIP: 'Wichita, KS'
        }
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})

// RDAP
app.post('/rdap', function (req: Request, res: Response, next: NextFunction) {
    try {
        let response = {
            requrestedDomain: '',
            requestedDomainType: '',
            rdap: 'Wichita, KS'
        }
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})

// Reverse DNS
app.post('/reversedns', function (req: Request, res: Response, next: NextFunction) {
    try {
        let response = {
            requrestedDomain: '',
            requestedDomainType: '',
            reverseDNS: 'Wichita, KS'
        }
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})


// Reverse DNS
app.post('/ping', async function (req: Request, res: Response, next: NextFunction) {
    try {
        var DomainTools = require('../lib/domainTools')  
        let response = await DomainTools.ping(req.body.domain)
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})

module.exports = app;
