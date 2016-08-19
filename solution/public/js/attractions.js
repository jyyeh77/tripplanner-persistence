'use strict';
/* global $ attractionModule hotels restaurants activities */

/**
 * This module holds collection of enhanced attraction objects which can be
 * easily looked up by type and id. It is primarily used when someone clicks
 * to add an attraction in the `options` module.
 */

var attractionsModule = (function () {

var enhanced = {};
  // application state
var restaurants, hotels, activities
  $.ajax({
      method: 'GET',
      url: '/api/restaurants'
    })
    .then(function(foundRestaurants) {
      restaurants = foundRestaurants;
      enhanced.restaurants = restaurants.map(attractionModule.create)
    })
    .catch(function(err){
      console.log(err);
    })
  $.ajax({
      method: 'GET',
      url: '/api/activities'
    })
    .then(function(foundActivities) {
      activities = foundActivities;
      enhanced.activities = activities.map(attractionModule.create)
    })
    .catch(function(err){
      console.log(err);
    })
  $.ajax({
      method: 'GET',
      url: '/api/hotels'
    })
    .then(function(foundHotels) {
      hotels = foundHotels;
      enhanced.hotels = hotels.map(attractionModule.create)
    })
    .catch(function(err){
      console.log(err)
    })


  // private helper methods (only available inside the module)

  function findById (array, id) {
    return array.find(function (el) {
      return +el.id === +id;
    });
  }

  // globally accessible module methods (available to other modules)

  var publicAPI = {

    getByTypeAndId: function (type, id) {
      if (type === 'hotel') return findById(enhanced.hotels, id);
      else if (type === 'restaurant') return findById(enhanced.restaurants, id);
      else if (type === 'activity') return findById(enhanced.activities, id);
      else throw Error('Unknown attraction type');
    },

    getEnhanced: function (databaseAttraction) {
      var type = databaseAttraction.type;
      var id = databaseAttraction.id;
      var found = publicAPI.getByTypeAndId(type, id);
	    console.log("type: ", type, "id: ", id, "found: ", found);
      if (found) return found;
      throw Error('enhanced version not found', databaseAttraction);
    }

  };

  return publicAPI;

}());
