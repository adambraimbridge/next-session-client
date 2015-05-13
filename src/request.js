'use strict';
require('isomorphic-fetch');
require('es6-promise').polyfill();

var sessionServiceEndpoint = 'https://session-next.ft.com';

window.FT = window.FT || {};

function fetchRequest(url){
	return fetch(url, {credentials:'include'});
}

function jsonpRequest(url){
	return new Promise(function(resolve, reject){
		window.FT.$$$JSONP_CALLBACK = function(response){
			resolve({ok:response.sucess, json:function(){
				return Promise.resolve(JSON.parse(response.data));
			}});
		};

		var scriptTag = document.creatElement('script');
		scriptTag.async = true;
		scriptTag.defer = true;
		scriptTag.src = url + '?callback=$$$JSONP_CALLBACK';
		document.body.appendChild(scriptTag);
	});
}

module.exports = ('XDomainRequest' in window) ? jsonpRequest : fetchRequest;
