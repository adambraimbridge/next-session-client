'use strict';
require('isomorphic-fetch');
require('es6-promise').polyfill();

var sessionServiceEndpoint = 'https://session-next.ft.com';
var callbackName = '$$$JSONP_CALLBACK';
var jsonpTimeout = 2000;

window.FT = window.FT || {};

function fetchRequest(url){
	return fetch(sessionServiceEndpoint + url, {credentials:'include'});
}

function jsonpRequest(url){
	return new Promise(function(resolve, reject){
		window.FT[callbackName] = function(response){
			resolve({ok:response.success, json:function(){
				return Promise.resolve(JSON.parse(response.data));
			}});
		};

		var scriptTag = document.createElement('script');
		scriptTag.async = true;
		scriptTag.defer = true;
		scriptTag.src = sessionServiceEndpoint + url + '?callback='+callbackName;
		document.body.appendChild(scriptTag);

		setTimeout(function(){
			resolve({ok:false, json:function(){
				return Promise.resolve({});
			}});
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
	})
}

module.exports = request;
