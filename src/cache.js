'use strict';

var detailsCache = {};


function cache(name, value) {
	if(typeof name === 'object'){
		detailsCache = name;
		return;
	}

	if(typeof name === 'string' && typeof value === 'string') {
		detailsCache[name] = value;
		return;
	}

	if(typeof name === 'string' && typeof value === 'undefined') {
		return detailsCache[name] || null;
	}

	if(typeof name === 'undefined' && typeof value === 'undefined') {
		return detailsCache;
	}

	throw new Error('Invalid arguments');
}

cache.clear = function(){
	detailsCache = {};
};

module.exports = cache;
