/**
 * Created by jyyeh77 on 8/18/16.
 */
var Sequelize = require('sequelize');
var db = require('./_db');
var Place = require('./place');
var Hotel = require('./hotel');
var Restaurant = require('./restaurant');
var Activity = require('./activity');

var Day = db.define('day', {
	number: Sequelize.INTEGER
})

Day.belongsTo(Hotel);
Day.belongsToMany(Restaurant, {through: 'day_restaurant'});
Day.belongsToMany(Activity, {through: 'day_activity'});

module.exports = Day;