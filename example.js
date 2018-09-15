'use strict'

const bikeRacks = require('./full.json')

const atFriedrichstr = bikeRacks['900000100001']

console.log('at S+U Friedrichstraße:')
for (let [id, tags] of atFriedrichstr) {
	console.log('id', id, 'tags', tags)
}
