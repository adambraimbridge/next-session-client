'use strict';
require('isomorphic-fetch');
require('es6-promise').polyfill();

var sessionServiceEndpoint = 'https://session-next.ft.com';
var jsonpTimeout = 2000;

window.FT = window.FT || {};

var jsonpCallbacks = [];

function generateCallbackName(){
	var base = 'sessionServiceJsonpCallback';
	var callbackName = base + '_' + (jsonpCallbacks.length+1);
	jsonpCallbacks.push(callbackName);
	return callbackName;
}

function fetchRequest(url){
	return fetch(sessionServiceEndpoint + url, {credentials:'include'});
}

function jsonpRequest(url){
	return new Promise(function(resolve, reject){
		var callbackName = generateCallbackName();
		var timeout;
		window.FT[callbackName] = function(response){
			response = JSON.parse(response);
			resolve({ok:response.success, json:function(){
				return Promise.resolve(response.data);
			}});
			if(timeout){
				clearTimeout(timeout);
			}
		};

		var scriptTag = document.createElement('script');
		scriptTag.async = true;
		scriptTag.defer = true;
		scriptTag.src = sessionServiceEndpoint + url + '?callback=FT.'+callbackName;
		document.body.appendChild(scriptTag);

		timeout = setTimeout(function(){
			reject(new Error('JSONP request to ' + url + ' timed out'));
		}, jsonpTimeout);
	});
}




function request(url){
	// if we don't have a session token cookie, don't bother..
	if(document.cookie.indexOf('FTSession=') === -1){
		return Promise.resolve(false);
	}

	var requestFunc = ('XDomainRequest' in window) ? jsonpRequest : fetchRequest;
	return requestFunc(url).then(function(response){
		if(response.ok){
			return (url === '/validate') ? Promise.resolve(true) : response.json();
		}else{
			return Promise.resolve(false);
		}

	}).catch(function(e){
		setTimeout(function(){
			throw e;
		}, 0);
	});
}

module.exports = request;
