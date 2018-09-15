'use strict'

const test = require('tape')

const simple = require('.')
const full = require('./full.json')

const isObj = o => o !== null && 'object' === typeof o && !Array.isArray(o)

const friedrichstr = '900000100001'

test('simple', (t) => {
	t.ok(simple, 'simple must be an object')

	const keys = Object.keys(simple)
	t.ok(keys.length > 0, 'simple must not be empty')
	for (const stationId of keys) {
		const racks = simple[stationId]
		t.ok(Array.isArray(racks), `simple['${stationId}'] must be an array`)
		t.ok(racks.length > 0, `simple['${stationId}'] must not be empty`)

		for (let i = 0; i < racks.length; i++) {
			const rack = racks[i]
			const name = `simple['${stationId}'][${i}]`

			t.ok(Array.isArray(rack), name + ' must be an array')
			const [osmId, capacity] = rack

			t.ok(typeof osmId, 'number', name + '[0] must be a number')
			if (capacity !== null) {
				t.ok(typeof capacity, 'number', name + '[1] must be a number or null')
			}
		}
	}

	t.end()
})

test('full', (t) => {
	t.ok(full, 'full must be an object')

	const keys = Object.keys(full)
	t.ok(keys.length > 0, 'full must not be empty')
	for (const stationId of keys) {
		const racks = full[stationId]
		t.ok(Array.isArray(racks), `full['${stationId}'] must be an array`)
		t.ok(racks.length > 0, `full['${stationId}'] must not be empty`)

		for (let i = 0; i < racks.length; i++) {
			const rack = racks[i]
			const name = `full['${stationId}'][${i}]`

			t.ok(Array.isArray(rack), name + ' must be an array')
			const [osmId, tags] = rack

			t.ok(typeof osmId, 'number', name + '[0] must be a number')
			t.ok(isObj(tags), name + '[1] must be an object')

			const tagNames = Object.keys(tags)
			t.ok(tagNames.length > 0, name + '[1] must not be empty')
		}
	}

	t.end()
})

test(`should have Friedrichstraße (${friedrichstr})`, (t) => {
	t.ok(full[friedrichstr])
	t.end()
})
