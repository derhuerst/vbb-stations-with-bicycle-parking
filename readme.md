# vbb-stations-with-bicycle-parking

**VBB stations with nearby bicycle parking facilities.** Taken from [OSM](https://www.openstreetmap.org/).

[![npm version](https://img.shields.io/npm/v/vbb-stations-with-bicycle-parking.svg)](https://www.npmjs.com/package/vbb-stations-with-bicycle-parking)
[![build status](https://api.travis-ci.org/derhuerst/vbb-stations-with-bicycle-parking.svg?branch=master)](https://travis-ci.org/derhuerst/vbb-stations-with-bicycle-parking)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-stations-with-bicycle-parking.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installation

```shell
npm install vbb-stations-with-bicycle-parking
```


## Usage

```js
const bikeRacks = require('vbb-stations-with-bicycle-parking/index.json')

const atFriedrichstr = bikeRacks['900000100001']
for (let [osmId, capacity] of atFriedrichstr) {
	console.log(osmId, capacity)
}
```

To get all OSM tags:

```js
const bikeRacksFull = require('vbb-stations-with-bicycle-parking/full.json')

const atFriedrichstr = bikeRacksFull['900000100001']
for (let [osmId, tags] of atFriedrichstr) {
	console.log(osmId, tags)
}
```


## Contributing

If you have a question or need support using `vbb-stations-with-bicycle-parking`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-stations-with-bicycle-parking/issues).
