'use strict';
var request = require('./src/request');
var cache = require('./src/cache');
var promises = {};

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
	uuid : uuid,
	validate : validate,
	cache : cache,
	cookie : function () {
		return (/FTSession=([^;]+)/.exec(document.cookie) || [null, ''])[1];
	}
};
