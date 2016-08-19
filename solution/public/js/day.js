'use strict';
/* global $ utilsModule tripModule attractionsModule */

/**
 * A module for constructing front-end `day` objects, optionally from back-end
 * data, and managing the `attraction`s associated with a day.
 *
 * Day objects contain `attraction` objects. Each day also has a `.$button`
 * with its day number. Days can be drawn or erased via `.show()` and
 * `.hide()`, which updates the UI and causes the day's associated attractions
 * to `.show()` or `.hide()` themselves.
 *
 * This module has one public method: `.create()`, used by `days.js`.
 */

var dayModule = (function() {

  // jQuery selections

  var $dayButtons, $dayTitle;
  $(function() {
    $dayButtons = $('.day-buttons');
    $dayTitle = $('#day-title > span');
  });

  // Day class and setup

  function Day(data) {
    // for brand-new days
    this.number = 0;
    this.hotel = null;
    this.restaurants = [];
    this.activities = [];
    // for days based on existing data
    utilsModule.merge(data, this);

    $.ajax({
        method: "GET",
        url: '/api/days/gethotel/' + this.hotelId
      })
      .then(function(foundHotel) {
        console.log("Ajax get request successful, retrieved hotel...", foundHotel.name);
        this.hotel = foundHotel;
        console.log("Our hotel is now: ", this.hotel);
        if (this.hotel) {
          console.log("Detects existing hotel: ", this.hotel.name);
          this.hotel = attractionsModule.getEnhanced(this.hotel);

          function show(attraction) {
            attraction.show();
          }

          if (this.hotel) {
            console.log("Showing hotels!");
            show(this.hotel);
          }
        }
      })
      .catch(function(err) {
        console.log(err);
      })
      $.ajax({
        method: "GET",
        url: '/api/days/getrestaurants/' + this.id
      })
      .then(function(){
        console.log('request succesful')
      })
      .catch(function(err){
        console.log(err)
      });
    // if (this.hotel) {
    // console.log("Detects existing hotel: ", this.hotel.name);
    // this.hotel = attractionsModule.getEnhanced(this.hotel);
    // }
    // this.restaurants = this.restaurants.map(attractionsModule.getEnhanced);
    // this.activities = this.activities.map(attractionsModule.getEnhanced);


    // remainder of constructor
    this.buildButton().showButton();
  }

  // automatic day button handling

  Day.prototype.setNumber = function(num) {
    this.number = num;
    this.$button.text(num);
  };

  Day.prototype.buildButton = function() {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function() {
      this.blur(); // removes focus box from buttons
      tripModule.switchTo(self);
      console.log(self.id)

      // makes request to backend to save retrieve select day
      $.ajax({
          method: 'GET',
          url: '/api/days/render/' + self.id.toString()
        })
        .then(function() {
          console.log('click ajax successful')
        })
        .catch(function(err) {
          console.log(err);
        })
    });
    return this;
  };

  Day.prototype.showButton = function() {
    this.$button.appendTo($dayButtons);
    return this;
  };

  Day.prototype.hideButton = function() {
    this.$button.detach(); // detach removes from DOM but not from memory
    return this;
  };

  Day.prototype.show = function() {
    // day UI
    this.$button.addClass('current-day');
    console.log("Showing Day Number...", this.number);
    $dayTitle.text('Day ' + this.number);
    // attractions UI
    function show(attraction) {
      attraction.show();
    }

    if (this.hotel) {
      console.log("Showing hotels!");
      show(this.hotel);
    }
    this.restaurants.forEach(show);
    this.activities.forEach(show);
  };

  Day.prototype.hide = function() {
    // day UI
    this.$button.removeClass('current-day');
    $dayTitle.text('Day not Loaded');
    // attractions UI
    function hide(attraction) {
      attraction.hide();
    }
    if (this.hotel) hide(this.hotel);
    this.restaurants.forEach(hide);
    this.activities.forEach(hide);
  };

  // day updating

  Day.prototype.addAttraction = function(attraction) {
    // adding to the day object
    switch (attraction.type) {
      case 'hotel':
          // makes put request to server to associate hotel with select day
        $.ajax({
            method: 'PUT',
            url: '/api/days/addhotel/' + this.id,
            data: {
              hotelId: attraction.id
            }
          })
          .then(function() {
            console.log('click ajax successful')
          })
          .catch(function(err) {
            console.log(err);
          })
        if (this.hotel) this.hotel.hide();
        this.hotel = attraction;
        break;
      case 'restaurant':
        utilsModule.pushUnique(this.restaurants, attraction);
        break;
      case 'activity':
        utilsModule.pushUnique(this.activities, attraction);
        break;
      default:
        console.error('bad type:', attraction);
    }
    // activating UI
    attraction.show();
  };

  Day.prototype.removeAttraction = function(attraction) {
    // removing from the day object
    switch (attraction.type) {
      case 'hotel':
        $.ajax({
          method: "DELETE",
          url: "api/days/removehotel/" + this.id
        })
        .then(function(){
          console.log('ajax success')
          this.hotel = null;
        })
        .catch(function(err){
          console.log(err)
        })
        break;
      case 'restaurant':
        utilsModule.remove(this.restaurants, attraction);
        break;
      case 'activity':
        utilsModule.remove(this.activities, attraction);
        break;
      default:
        console.error('bad type:', attraction);
    }
    // deactivating UI
    attraction.hide();
  };

  // globally accessible module methods

  var publicAPI = {

    create: function(databaseDay) {
      return new Day(databaseDay);
    }

  };

  return publicAPI;

}());
