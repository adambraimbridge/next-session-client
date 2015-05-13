'use strict';
var request  = require('./src/request');
var cache = require('./src/cache');


function session(){
	if(cache('email')){
		return Promise.resolve(cache());
	}

	return request('/').then(function(sessionDetails){
		cache(sessionDetails);
		return sessionDetails;
	});
}

session.uuid = function(){
	if(cache('uuid')){
		return Promise.resolve(cache('uuid'));
	}

	return request('/uuid').then(function(response){
		cache('uuid', response.uuid);
		return response.uuid;
	});
};

session.validate = function(){
	return request('/validate');
};

module.exports = session;
