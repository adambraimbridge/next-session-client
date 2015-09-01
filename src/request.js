'use strict';

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

			try {
				response = JSON.parse(response);
			} catch (e) {
				reject(new Error('Error parsing session response'));
				return;
			}

			if (response.success) {
				resolve({
					ok:response.success,
					json: function(){
						return Promise.resolve(response.data);
					}
				});
			} else {
				reject(new Error('JSONp session request failed: ' + url));
			}

			if (timeout){
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
	if (document.cookie.indexOf('FTSession=') === -1) {
		return Promise.reject(new Error('No session cookie found'));
	}

	var requestFunc = ('XDomainRequest' in window) ? jsonpRequest : fetchRequest;
	return requestFunc(url).then(function(response){
		if (response.ok){
			return (url === '/validate') ? Promise.resolve(true) : response.json();
		} else {
			return (url === '/validate') ? Promise.resolve(false) : Promise.reject(response.status);
		}

	}).catch(function(e) {
		var message = e.message || "";
		if (message.indexOf('timed out') > -1 || e.message.indexOf('Network request failed') > -1) {
			// HTTP timeouts are a fact of life on the internet.
			// We don't want to report this to Sentry.
		} else {
			setTimeout(function() {
				throw e;
			}, 0);
		}
	});
}

module.exports = request;
