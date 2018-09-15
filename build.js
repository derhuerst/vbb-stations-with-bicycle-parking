'use strict'

const queryOverpass = require('@derhuerst/query-overpass')
const berlin = require('german-states-bbox').BE
const Flatbush = require('flatbush')
const computeDistance = require('gps-distance')

let stations = require('vbb-stations/full.json')
stations = Object.values(stations)

const index = new Flatbush(stations.length);
for (const s of stations) {
	const loc = s.location
	index.add(loc.longitude, loc.latitude, loc.longitude, loc.latitude)
}
index.finish()

const nearby = (latitude, longitude, distance = .2) => {
	return index.search(
		longitude - distance / 100, // minX
		latitude - distance / 100, // minY
		longitude + distance / 100, // maxX
		latitude + distance / 100 // maxY
	)
	.map((i) => {
		const s = Object.assign({}, stations[i])
		const loc = s.location
		s.distance = computeDistance(latitude, longitude, loc.latitude, loc.longitude)
		return s
	})
	.sort((a, b) => a.distance - b.distance)
}

const bbox = [
	berlin.minLat, // south
	berlin.minLon, // west
	berlin.maxLat, // north
	berlin.maxLon // east
]

// todo: parking racks with unknown capacity
queryOverpass(`
[out:json][timeout:60][bbox:${bbox.join(',')}];
node
	[amenity=bicycle_parking]
	[capacity];
out body;
`)
.then((parkingRacks) => {
	for (let rack of parkingRacks) {
		const capacity = parseInt(rack.tags.capacity)
		if (Number.isNaN(capacity)) {
			console.warn(rack.id, 'has an invalid capacity')
			continue
		}

		const close = nearby(rack.lat, rack.lon, .5)
		// todo
		break
	}
})
.catch(console.error)
