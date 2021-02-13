# Domain Services Cluster

A clustered backend API that will look up specific data about hosts. Pairs well with [Domain Services API](https://github.com/DJSethDuncan/domain-services-api)

Available endpoints:

* POST: `/geolocation`
* POST: `/rdap`
* POST: `/ping`
* POST: `/reversedns`

### Setup

Set up .ENV w/ desired port and RapidAPI key (I used a [RapidAPI](https://rapidapi.com/) API for GeoLocation. Everything else was public.)

* Clone
* `npm i`
* `npm run build`
* `npm start`

### Clustering

Looks up the available cpus, then spawns x workers that all listen on the same port.

### Notes

Uses ESLint/Prettier to enforce my preferred code styling. If you don't like it, submit a PR and we'll talk.
Uses Mocha/Chai for testing via `npm run test`