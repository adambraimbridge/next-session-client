'use strict';
const request = require('./src/request');
const cache = require('./src/cache');
const promises = {};

function uuid (){
	const uuid = cache('uuid')

	if (uuid){
		return Promise.resolve({
			uuid:uuid
		});
	}
	if (!promises.uuid) {
		promises.uuid = request('/uuid').then(function (response){
			cache('uuid', response.uuid);
			return response;
		});
	}

	return promises.uuid;
}

function products () {
	const cachedProducts = cache('products');
	const cachedUUID = cache('uuid');

	if(cachedProducts && cachedUUID){
		return Promise.resolve({products:cachedProducts, uuid:cachedUUID});
	}

	if (!promises.products) {
		promises.products = request('/products').then(function (response) {
			cache('products', response.products);
			cache('uuid', response.uuid);
			return response;
		});
	}

	return promises.products;
}

function validate () {
	return request('/validate');
}

module.exports = {
	uuid : uuid,
	validate : validate,
	cache : cache,
	products: products,
	cookie : function () {
		return (/FTSession=([^;]+)/.exec(document.cookie) || [null, ''])[1];
	}
};
