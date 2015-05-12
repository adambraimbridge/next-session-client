'use strict';
var request  = require('./src/request');

function makeRequest(url){
	return request(url).then(function(response){
		return response.ok ? response.json() : Promise.resolve(false);
	}).catch(function(e){
		setTimeout(function(){
			throw e;
		}, 0);
	})
}

function session(){
	return makeRequest('/');
}

session.validate = function(){
	return makeRequest('/validate');
};

module.exports = session;
