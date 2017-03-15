const request = require('./src/request');
const cache = require('./src/cache');
const requests = {};

const getUuid = () => {
	const cachedUUID = cache('uuid');
	if (cachedUUID) {
		return Promise.resolve({ uuid: cachedUUID });
	}

	const [, sessionId] = /FTSession_s=([^;]+)/.exec(document.cookie) || [];
	if (!sessionId) {
		return Promise.resolve({ uuid: undefined });
	}

	if (!requests.uuid) {
		// pull out the session id from the FTSession_s cookie
		requests.uuid = request(`/sessions/s/${sessionId}`)
			.then(({ uuid } = {}) => {
				delete requests.uuid;
				if (uuid) {
					cache('uuid', uuid);
				}
				return { uuid };
			});
	}

	return requests.uuid;
};

const getProducts = () => {
	const cachedProducts = cache('products');
	const cachedUUID = cache('uuid');
	if (cachedProducts && cachedUUID){
		return Promise.resolve({ products: cachedProducts, uuid: cachedUUID });
	}

	if (!requests.products) {
		requests.products = request('/products')
			.then(( { products, uuid } = {}) => {
				delete requests.products;
				if (products) {
					cache('uuid', uuid);
				}
				if (uuid) {
					cache('uuid', uuid);
				}
				return { products, uuid };
			});
	}

	return requests.products;
};

const validate = () => {
	return getUuid()
		.then(response => response ? true : false);
};

export {
	uuid: getUuid,
	products: getProducts,
	validate,
	cache,
	cookie: () => (/FTSession=([^;]+)/.exec(document.cookie) || [null, ''])[1]
};
