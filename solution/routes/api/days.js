var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Day = require('../../models/day');

router.get('/api/days/gethotel/:hotelId', function(req, res, next){
	Hotel.findById(req.params.hotelId)
		.then(function(foundHotel){
			console.log("Found existing hotel...", foundHotel.name);
			res.send(foundHotel);
		})
		.catch(next);
})

router.put('/api/days/addhotel/:id', function(req, res, next) {
	Day.findById(req.params.id)
		.then(function(foundDay) {
			console.log("found day" + foundDay.number)
			console.log(req.body.hotelId)
			return foundDay.setHotel(req.body.hotelId)
		})
		.then(function() {
			res.end();
		})
		.catch(next)
})

// adding a day via ajax request in trip.js addDay()
router.post('/api/days/:number', function(req, res, next) {
	Day.create({
			number: req.params.number
		})
		.then(function(createdDay) {
			console.log("Created: Day " + createdDay.number);
			res.send(createdDay);
		})
		.catch(next);
})

// deletes a day via ajax request in trip.js deleteDay()
router.get('/api/days/:id', function(req, res, next) {
	Day.findById(req.params.id)
		.then(function(foundDay) {
			return foundDay.destroy();
		})
		.then(function(doneDay) {
			console.log("Day is destroyed in DB!");
			res.end();
		})
		.catch(function(err) {
			console.log(err);
		})
})

// intercept AJAX request for rendering already entered day
router.get('/api/days/render/:id', function(req, res, next) {
	Day.findById(req.params.id)
		.then(function(foundDay) {
			console.log('Found Day number...', foundDay.number)
			return foundDay.getHotel();
		})
		.then(function(foundHotel) {
			console.log("Found hotel...", foundHotel.name);
			res.end();
		})
		.catch(next);
})

// to intercept ajax GET request from front end to retrieve all Days in Sequelize DB
router.get('/api/days', function(req, res, next) {
	var foundHotels;
	Day.findAll()
		.then(function(foundDays) {
			console.log("Finding all days...")
			res.send(foundDays);
		})
		.catch(next);
})

module.exports = router;
