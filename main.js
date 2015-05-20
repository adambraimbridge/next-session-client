'use strict';
var request  = require('./src/request');
var cache = require('./src/cache');


function details(){
	// cache contains products then we must've already done a details call
	if(cache('products')){
		return Promise.resolve(cache());
	}
	return request('/').then(function(sessionDetails){
		if(sessionDetails){
			cache(sessionDetails);
		}

		return sessionDetails;
	});
}

function uuid(){
	if(cache('uuid')){
		return Promise.resolve({uuid:cache('uuid')});
	}

	return request('/uuid').then(function(response){
		cache('uuid', response.uuid);
		return response;
	});
}

function validate(){
	return request('/validate');
}

module.exports = {
	details : details,
	uuid : uuid,
	validate : validate,
	cache : cache,
	cookie : function () {
		return (/FTSession=([^;]+)/.exec(document.cookie) || [null, ''])[1];
	}
};
