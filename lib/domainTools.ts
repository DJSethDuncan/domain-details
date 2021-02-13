import ping from 'pingman';
import axios from 'axios';
import * as dns from 'dns';

export async function pingHost(host: string, echos = 5): Promise<Record<string, unknown>> {
  try {
    const pingResponse = await ping(host, {
      timeout: 10,
      numberOfEchos: echos
    });
    const response = {
      status: pingResponse.alive ? 'alive' : 'dead',
      time: pingResponse.time,
      packetLoss: pingResponse.packetLoss,
      ip: pingResponse.numericHost
    };

    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function reverseDNS(host: string): Promise<string[]> {
  try {
    if (getHostType(host) == 'domain') {
      return Promise.resolve([host]);
    }
    const dnsPromises = dns.promises;
    // let reverseLookup = await dnsPromises.reverse(host);
    const reverseLookup = await dnsPromises.reverse(host);
    return Promise.resolve(reverseLookup);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function rdap(host: string): Promise<Record<string, unknown>> {
  try {
    const response = {};
    const hostType = getHostType(host);
    if (hostType == 'domain') {
      const pingResponse = await ping(host, {
        timeout: 10
      });
      response['status'] = pingResponse.alive ? 'alive' : 'dead';
      response['time'] = pingResponse.time;
      response['packetLoss'] = pingResponse.packetLoss;
      response['ip'] = pingResponse.numericHost;
    } else if (hostType == 'ip') {
      response['ip'] = host;
    }

    const rdapTargetUrl = 'https://rdap.arin.net/registry/ip/' + response['ip'];

    const rdapResponse = await axios.get(rdapTargetUrl);

    return Promise.resolve(rdapResponse.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function geolocation(host: string): Promise<Record<string, unknown>> {
  try {
    let ipAddress: any = '';
    let hostType = getHostType(host);
    if (hostType == 'domain') {
      const pingResponse = await pingHost(host, 1);
      ipAddress = pingResponse.numericHost;
    } else if (hostType == 'ip') {
      ipAddress = host;
    }
    const geoResponse = await axios({
      method: 'GET',
      url: 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/',
      params: { ip: ipAddress },
      headers: {
        'x-rapidapi-key': process.env.rapidAPIKey,
        'x-rapidapi-host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
      }
    });
    return Promise.resolve(geoResponse.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export function getHostType(host: string): string {
  const ipRegex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
  return ipRegex.test(host) ? 'ip' : 'domain';
}
