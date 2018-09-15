'use strict'

const Flatbush = require('flatbush')
const merged = require('merged-vbb-stations')
const computeDistance = require('gps-distance')
const berlin = require('german-states-bbox').BE
const queryOverpass = require('@derhuerst/query-overpass')
const {writeFileSync} = require('fs')
const {join} = require('path')

let stations = require('vbb-stations/full.json')
stations = Object.values(stations).filter((s) => {
	// filter child stations
	const shouldMerge = s.id !== merged[s.id]
	if (shouldMerge) console.warn('ignoring', s.id, s.name)
	return !shouldMerge
})

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

queryOverpass(`
[out:json][timeout:60][bbox:${bbox.join(',')}];
node[amenity=bicycle_parking];
out body;
`)
.then((parkingRacks) => {
	// station ID -> [[rack ID, rack capacity], ...]
	const simple = Object.create(null)
	// station ID -> [[rack ID, rack tags], ...]
	const full = Object.create(null)

	for (let rack of parkingRacks) {
		let capacity = null
		if ('capacity' in rack.tags) {
			rack.tags.capacity = parseInt(rack.tags.capacity)
			if (Number.isNaN(rack.tags.capacity)) {
				console.warn(rack.id + '', 'has an invalid capacity')
				continue
			}
		}

		const close = nearby(rack.lat, rack.lon, .5)
		if (close.length === 0) {
			console.warn(rack.id + '', 'has no stations within .5km')
			continue
		}
		const closest = close[0]
		const secondClosest = close[1]
		if (secondClosest && closest.distance / secondClosest.distance > .7) {
			console.warn(rack.id + '', 'has two very similarly close stations')
			continue
		}

		const sId = closest.id
		if (simple[sId]) simple[sId].push([rack.id, rack.tags.capacity])
		else simple[sId] = [[rack.id, rack.tags.capacity]]
		if (full[sId]) full[sId].push([rack.id, rack.tags])
		else full[sId] = [[rack.id, rack.tags]]
	}

	console.info('writing index.json')
	writeFileSync(join(__dirname, 'index.json'), JSON.stringify(simple))
	console.info('writing full.json')
	writeFileSync(join(__dirname, 'full.json'), JSON.stringify(full))
})
.catch(console.error)
