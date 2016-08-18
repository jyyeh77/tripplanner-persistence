var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');

router.get('/api/hotels', function(req, res, next) {
	Hotel.findAll()
		.then(function(hotels){
			res.send(hotels);
		})
		.catch(next);
});

router.get('/api/restaurants', function(req, res, next){
	Restaurant.findAll()
		.then(function(foundRestaurants){
			res.send(foundRestaurants);
		})
		.catch(next);
})

router.get('/api/activities', function(req, res, next){
	Activity.findAll()
		.then(function(foundActivities){
			res.send(foundActivities);
		})
		.catch(next);
})

module.exports = router;
