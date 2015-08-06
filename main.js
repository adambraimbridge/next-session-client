'use strict';
var request  = require('./src/request');
var cache = require('./src/cache');
var promises = {};

function details(){
	// cache contains products then we must've already done a details call
	if (cache('products')){
		return Promise.resolve(cache());
	}
	if (!promises.session) {
		promises.session = request('/').then(function(sessionDetails){
			if(sessionDetails){
				cache(sessionDetails);
			}
			return sessionDetails;
		});
		promises.uuid = promises.uuid || promises.session.then(function (sessionDetails) {
			return {uuid: sessionDetails.uuid};
		});
	}
	return promises.session;
}

function uuid(){
	var uuid = cache('uuid')

	if (uuid){
		return Promise.resolve({
			uuid:uuid
		});
	}
	if (!promises.uuid) {
		promises.uuid = request('/uuid').then(function(response){
			cache('uuid', response.uuid);
			return response;
		});
	}

	return promises.uuid;
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
