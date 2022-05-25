const express = require('express')
const cors = require('cors')
const app = express()
const MongoClient = require('mongodb').MongoClient

const NodeCache = require('node-cache')

const myCache = new NodeCache()

app.use(cors())
app.use(express.json())
require('dotenv').config()

let database
let collection
const limit = 100

app.get('/', (req, res) => {
	res.send('Bienvenue')
})

app.get('/api/arca', (req, res) => {
	collection.find({}, { limit:limit }).toArray((err, result) => {
		if(err) throw err
		res.send(result)
	})
})

//Détails somme par pays
app.get('/api/total/:pays/:year', (req, res) => {
	const { pays, year } = req.params
	
	collection.aggregate([
	{
		'$match': {
			'pays': `${pays}`
		}
	}, {
		'$group': {
			'_id': {
			'$dateToString': {
				'format': '%Y - %Hh', 
				'date': {
					'$toDate': '$temps'
				}
			}
			}, 
			'nombre': {
				'$count': {}
			}, 
			'somme': {
				'$sum': '$valeur'
			}
			}
		}, {
		'$sort': {
			'_id': 1
		}}, {
			'$match': {
				'$and': [
				{
					'_id': {
					'$gte': `${year}`+' - 00h'
					}
				}, {
					'_id': {
					'$lte': `${year}`+'- 24h'
					}
				}
				]
			}
		}
	], {allowDiskUse: true}).toArray(function(err, result) {
			if (err) throw err
			res.send(result)
		})
})

//Somme par pays
app.get('/api/total', (req, res) => {
	if (myCache.has('cache2')) {
		console.log('Depuis ma cache All country')
		return res.send(myCache.get('cache2'))
	} else {
		collection.aggregate([
			{
				'$group': {
					'_id': '$pays', 
					'nombre': {
						'$count': {}
					}, 
					'somme': {
						'$sum': '$valeur'
					}
				}
			}, {
				'$sort': {
					'_id': 1
				}
			}
		], {allowDiskUse: true}).toArray(function(err, result) {
			if (err) throw err
			myCache.set('cache2', result)
			console.log('Depuis mon API All country')
			res.send(result)
		})
	}
})

//Big query select time per hour year
app.get('/api/time/annee/:year', (req, res) => {
	const { year } = req.params

	if (myCache.has(`year-${year}`)) {
		console.log('Depuis ma cache FULLTIME ', year)
		return res.send(myCache.get(`year-${year}`))
	} else {
		collection.aggregate([
			{
			  '$group': {
				'_id': {
				  '$dateToString': {
					'format': '%Y - %Hh', 
					'date': {
					  '$toDate': '$temps'
					}
				  }
				}, 
				'nombre': {
				  '$count': {}
				}, 
				'somme': {
				  '$sum': '$valeur'
				}, 
				'moyenne': {
				  '$avg': '$valeur'
				}
			  }
			}, {
			  '$sort': {
				'_id': 1
			  }
			}, {
			  '$match': {
				'$and': [
				  {
					'_id': {
					  '$gte': `${year}`+' - 00h'
					}
				  }, {
					'_id': {
					  '$lte': `${year}`+'- 24h'
					}
				  }
				]
			  }
			}
		  ], {allowDiskUse: true}).toArray(function(err, result) {
			if (err) throw err
			myCache.set(`year-${year}`, result)
			console.log('Depuis mon API FULLTIME ', year)
			res.send(result)
		})
	}
})

app.get('/stats', (req, res) =>{
	res.send(myCache.getStats())
})

app.listen(`${process.env.DBPORT}`, () => {
	MongoClient.connect(`${process.env.DBLINK}`,
	{ useNewUrlParser: true, useUnifiedTopology: true }, (err, result) => {
		if(err) throw err
		database = result.db(`${process.env.DBNAME}`)
		collection = database.collection(`${process.env.DBCOLL}`)
		console.log(`Serveur connecté sur ${process.env.DBPORT}`)
	})
})