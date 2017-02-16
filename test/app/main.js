/* eslint-disable no-console */
'use strict';

require('fetch');
require('es6-promise').polyfill();

const session = require('../../main');

function handleClick (e){
	const target = e.target;
	const method = target.getAttribute('data-method');
	console.log('Call method ' + method);
	const result = session[method]();
	if(result.then){
		result.then(function (response){
			console.log('Response from ' + method + ' is:');
			console.dir(response);
		}).catch(function (err){
			console.error(err);
		});
	} else {
		console.log('Response from ' + method + ' is:');
		console.dir(result);
	}

}

function addClick (el){
	console.log('add click to', el);
	el.addEventListener('click', handleClick);
}

[].slice.call(document.querySelectorAll('.buttons button'), 0).forEach(addClick);
