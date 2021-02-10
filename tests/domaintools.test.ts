import { expect } from 'chai';
import * as domainTools from '../lib/domainTools';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const testIP = '127.0.0.1';
const testDomain = 'www.google.com';
const googleDNSIP = '8.8.8.8';
const googleDNSDomain = 'dns.google';

describe('.env', function () {
  it('PORT exists', function () {
    expect(process.env.PORT).to.not.be.empty;
  });
  it('rapidAPIKey exists', function () {
    expect(process.env.rapidAPIKey).to.not.be.empty;
  });
});

describe('pingHost', function () {
  it('works with ip', async function () {
    const pingResponse = await domainTools.pingHost(testIP, 1);
    expect(pingResponse).to.have.keys('status', 'time', 'packetLoss', 'ip');
  });
  it('works with domain', async function () {
    const pingResponse = await domainTools.pingHost(testDomain, 1);
    expect(pingResponse).to.have.keys('status', 'time', 'packetLoss', 'ip');
  });
});

describe('reverseDNS', function () {
  it('works with ip', async function () {
    const reversDNSResponse = await domainTools.reverseDNS(testIP);
    expect(reversDNSResponse).to.be.an('array');
  });
  it('works with domain', async function () {
    const reversDNSResponse = await domainTools.reverseDNS(testDomain);
    expect(reversDNSResponse).to.be.an('array');
  });
  it('returns expected domain if an known ip was supplied', async function () {
    const reversDNSResponse = await domainTools.reverseDNS(googleDNSIP);
    expect(reversDNSResponse[0]).to.equal(googleDNSDomain);
  });
  it('returns a matching domain if a domain was supplied', async function () {
    const reversDNSResponse = await domainTools.reverseDNS(testDomain);
    expect(reversDNSResponse[0]).to.equal(testDomain);
  });
});

describe('rdap', function () {
  it('works with ip', async function () {
    const rdapResponse = await domainTools.rdap(testIP);
    expect(rdapResponse).to.have.keys(
      'arin_originas0_originautnums',
      'cidr0_cidrs',
      'endAddress',
      'entities',
      'events',
      'handle',
      'ipVersion',
      'links',
      'name',
      'notices',
      'objectClassName',
      'port43',
      'rdapConformance',
      'remarks',
      'startAddress',
      'status'
    );
  });
  it('works with domain', async function () {
    const rdapResponse = await domainTools.rdap(testDomain);
    expect(rdapResponse).to.have.keys(
      'arin_originas0_originautnums',
      'cidr0_cidrs',
      'endAddress',
      'entities',
      'events',
      'handle',
      'parentHandle',
      'ipVersion',
      'links',
      'name',
      'notices',
      'objectClassName',
      'port43',
      'rdapConformance',
      'startAddress',
      'status',
      'type'
    );
  });
});

describe('geolocation', function () {
  it('works with ip', async function () {
    const geolocationResponse = await domainTools.geolocation(testIP);
    expect(geolocationResponse).to.be.an('object');
  });
  it('works with domain', async function () {
    const geolocationResponse = await domainTools.geolocation(testDomain);
    expect(geolocationResponse).to.be.an('object');
  });
});

describe('getHostType', function () {
  it('works with ip', function () {
    expect(domainTools.getHostType(testIP)).to.equal('ip');
  });
  it('works with domain', function () {
    expect(domainTools.getHostType(testDomain)).to.equal('domain');
  });
});
