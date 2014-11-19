var garuda = require('./modules/garuda');
var citilink = require('./modules/citilink');
var airasia = require('./modules/airasia');
var express = require('./modules/express');
// var sriwijaya = require('./modules/sriwijaya');
// var lion = require('./modules/lion');
var scrapers = {
	garuda: garuda,
	citilink: citilink,
	airasia: airasia,
	express: express,
	// sriwijaya: sriwijaya,
	// lion: lion,
}

module.exports = scrapers;