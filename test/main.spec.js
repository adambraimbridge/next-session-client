const sinon = require('sinon');

const session = require('../main');

describe('Session Client', function () {
	const jsonpCallbackName = '$$$JSONP_CALLBACK';

	const sessionData = {'uuid':'e1d24b36-30de-434d-a087-e04c17377ac7', 'products': 'P0, P1'};

	before(function () {
		if(document.cookie.indexOf('FTSession=') < 0){
			document.cookie += 'FTSession=0-HSSzYw3kNN06CH4EwXN3rHzwAAAU1NL7xtww.MEYCIQDXxFJypS8uRn86Fjlcw9wVrf2vzC2kkd9XbcJmZpenrwIhAP0q2fTmfBa0WkJzGtnrwfcuIl3oBxXzwabrcHXE41xi';
		}
		session.cache.clear();
	});

	afterEach(function () {
		if(document.body.appendChild.restore){
			document.body.appendChild.restore();
		}
		session.cache.clear();
	});

	function setupFetch (data, ok){
		const jsonFunc = function () {
			return Promise.resolve(data);
		};

		window.fetch = sinon.stub().returns(Promise.resolve({ok:ok, json:jsonFunc}));
	}

	function setupJsonp (data, ok){
		sinon.stub(document.body, 'appendChild', function () {
			const jsonpResponse = JSON.stringify({success:ok,data:data});
			setTimeout(function () {
				window.FT[jsonpCallbackName](jsonpResponse);
			}, 500);
		});
	}

	function setup (data, success){
		setupFetch(data, success);
		setupJsonp(data, success);
	}

	it('Should be able to get session uuid', function () {
		setup({uuid:sessionData.uuid}, true);
		return session.uuid()
			.then(function (response) {
				response.uuid.should.equal(sessionData.uuid);
			});
	});

	it('Should be able to check if a session is valid', function () {
		setup({}, false);
		return session.validate()
			.then(function (isValid) {
				isValid.should.be.false;
			});
	});

	it('Should be able to get the user\'s products', function () {
		setup({uuid:sessionData.uuid, products:sessionData.products}, true);
		return session.products()
			.then(function (response) {
				response.products.should.equal(sessionData.products);
			});
	});

});

describe('Cookie helper', function () {
	it('should extract the session id from document.cookie', function () {
		'FTSession=;blah=blah;blurb=blurb;FTSession=hs9uy(S89`uxf9mymwapSDSA*&Ofnyszyo;thing=thing;'
			.split(';').forEach(function (c) {
				document.cookie = c + ';';
			});

		session.cookie().should.equal('hs9uy(S89`uxf9mymwapSDSA*&Ofnyszyo');
	});

	it('should extract missing session id from document.cookie', function () {
		'FTSession=;blah=blah;blurb=blurb;thing=thing;'
			.split(';').forEach(function (c) {
				document.cookie = c + ';';
			});
		session.cookie().should.equal('');
	});
});
