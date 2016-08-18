var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Day = require('../../models/day');




// adding a day via ajax request in trip.js addDay()
router.post('/api/days/:number', function(req, res, next){
	Day.create({
		number: req.params.number
	})
		.then(function(createdDay){
			console.log("Created: Day " + createdDay.number);
			res.send(createdDay);
		})
		.catch(next);
})

// deletes a day via ajax request in trip.js deleteDay()
router.get('/api/days/:id', function(req, res, next){
	Day.findById(req.params.id)
		.then(function(foundDay){
			return foundDay.destroy();
		})
		.then(function(doneDay){
			console.log("Day is destroyed in DB!");
			res.end();
		})
			.catch(function(err){
				console.log(err);
			})
})

router.get('/api/days/render/:id', function(req,res,next) {
	Day.findById(req.params.id)
	.then(function(foundDay){
		console.log(foundDay.number)
	})
	.then(function(foundHotel) {
		console.log(foundHotel.name)
	})
})

// to intercept ajax GET request from front end to retrieve all Days in Sequelize DB
router.get('/api/days', function(req, res, next){
	Day.findAll()
		.then(function(foundDays){
			res.send(foundDays);
		})
		.catch(next);
})

module.exports = router;
