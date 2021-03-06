/* global sinon */
import request from '../../src/request';

describe('request', function () {
	before(function () {
		if(document.cookie.indexOf('FTSession=') < 0){
			document.cookie += 'FTSession=0-HSSzYw3kNN06CH4EwXN3rHzwAAAU1NL7xtww.MEYCIQDXxFJypS8uRn86Fjlcw9wVrf2vzC2kkd9XbcJmZpenrwIhAP0q2fTmfBa0WkJzGtnrwfcuIl3oBxXzwabrcHXE41xi';
		}
	});

	afterEach(function () {
		if(document.body.appendChild.restore){
			document.body.appendChild.restore();
		}
	});

	function setupFetch (response){
		const jsonFunc = function () {
			return Promise.resolve(response);
		};

		window.fetch = sinon.stub().returns(Promise.resolve({ok:true, json:jsonFunc}));
	}

	it('Should be able to make a CORS request to the session service', function () {
		const email = 'paul.i.wilson@ft.com';
		setupFetch({email:email});
		return request('/')
			.then(function () {
				sinon.assert.calledWith(window.fetch, 'https://session-next.ft.com/', {
					credentials: 'omit', useCorsProxy: true
				});
			});
	});
});
