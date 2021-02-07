async function ping (host) {
    try {

        console.log('domaintools ping')

        var ping = require('ping');
        
        let pingResponse = await ping.promise.probe(host, {
            timeout: 10,
            extra: ['-i', '2'],
        });

        let response = {
            requrestedDomain: host,
            ping: {
                status: (pingResponse.alive ? 'alive' : 'dead'),
                time: pingResponse.time,
                packetLoss: pingResponse.packetLoss,
                ip: pingResponse.numeric_host
            }
        }

        return Promise.resolve(response);
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports.ping = ping;