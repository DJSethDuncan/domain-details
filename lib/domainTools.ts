async function ping (host, deadline=10) {
    try {
        var ping = require('ping');
        const pingResponse = await ping.promise.probe(host, {
            timeout: 10,
            deadline: deadline
        });
        const response = {
            status: (pingResponse.alive ? 'alive' : 'dead'),
            time: pingResponse.time,
            packetLoss: pingResponse.packetLoss,
            ip: pingResponse.numeric_host
        }

        return Promise.resolve(response);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function reverseDNS (host) {
    try {
        const dns = require('dns')
        const dnsPromises = dns.promises

        // let reverseLookup = await dnsPromises.reverse(host);
        const reverseLookup = await dnsPromises.reverse(host);
        return Promise.resolve(reverseLookup);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function rdap (host, hostType) {
    try {
        const axios = require('axios');

        let hostIP = '';

        if (hostType == 'domain') {
            let pingResponse = await ping(host, 1);
            hostIP = pingResponse.ip;
        } else if (hostType == 'ip') {
            hostIP = host
        }

        let rdapTargetUrl = 'https://rdap.arin.net/registry/ip/' + hostIP
        
        const rdapResponse = await axios.get(rdapTargetUrl)

        return Promise.resolve(rdapResponse.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function geolocation (host) {
    try {
        const axios = require('axios');
        var options = {
            method: 'GET',
            url: 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/',
            params: { ip: '142.250.68.132' },
            headers: {
                'x-rapidapi-key': '9Q6sIgEuammsholhpMNtnj7es06lp1FchbZjsnoqDmGMZuxiAD',
                'x-rapidapi-host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
            }
        };
        const geoResponse = await axios.request(options)
        return Promise.resolve(geoResponse.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports.ping = ping;
module.exports.reverseDNS = reverseDNS;
module.exports.rdap = rdap;
module.exports.geolocation = geolocation;