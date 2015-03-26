var garuda    = require('./modules/garuda');
var citilink  = require('./modules/citilink');
var airasia   = require('./modules/airasia');
var express   = require('./modules/express');
var sriwijaya = require('./modules/sriwijaya');
var lion      = require('./modules/lion');
var kalstar      = require('./modules/kalstar');
var scrapers  = {
	garuda    : garuda,
	citilink  : citilink,
	airasia   : airasia,
	express   : express,
	sriwijaya : sriwijaya,
	lion      : lion,
	kalstar      : kalstar,
};
module.exports = scrapers;
