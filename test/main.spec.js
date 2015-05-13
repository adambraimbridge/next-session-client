'use strict';
var session = require('../main');
var sinon = require('sinon');
var expect = require('chai').expect;

describe.only('Session Client', function(){

	var jsonpCallbackName = '$$$JSONP_CALLBACK';

	var sessionData = {"erightsId":"11624548","passportId":"4011624548","uuid":"e1d24b36-30de-434d-a087-e04c17377ac7","title":"Mr","firstName":"Paul","lastName":"Wilson","emailAddress":"paul.i.wilson@ft.com","groups":"FT Current Staff,Organisations,Individuals","products":"P0,Tools,P2"};

	before(function(){
		if(document.cookie.indexOf('FTSession=') < 0){
			document.cookie += 'FTSession=0-HSSzYw3kNN06CH4EwXN3rHzwAAAU1NL7xtww.MEYCIQDXxFJypS8uRn86Fjlcw9wVrf2vzC2kkd9XbcJmZpenrwIhAP0q2fTmfBa0WkJzGtnrwfcuIl3oBxXzwabrcHXE41xi';
		}
	});

	afterEach(function(){
		if(document.body.appendChild.restore){
			document.body.appendChild.restore();
		}
		session.cache.clear();
	});

	function setupFetch(data, ok){
		var jsonFunc = function(){
			return Promise.resolve(data);
		};

		window.fetch = sinon.stub().returns(Promise.resolve({ok:ok, json:jsonFunc}));
	}

	function setupJsonp(data, ok){
		sinon.stub(document.body, 'appendChild', function(){
			var jsonpResponse = JSON.stringify({success:ok,data:data});
			setTimeout(function(){
				window.FT[jsonpCallbackName](jsonpResponse);
			}, 500);
		});
	}

	function setup(data, success){
		setupFetch(data, success);
		setupJsonp(data, success);
	}

	it('Should be able to get session details', function(done){
		setup(sessionData, true);
		session.details().then(function(sessionDetails){
			expect(sessionDetails).to.deep.equal(sessionData);
			done();
		}).catch(done);
	});

	it('Should be able to get session uuid', function(done){
		setup({uuid:sessionData.uuid}, true);
		session.uuid().then(function(response){
			expect(response.uuid).to.equal(sessionData.uuid);
			done();
		}).catch(done);
	});

	it('Should be able to check if a session is valid', function(done){
		setup({}, false);
		session.validate().then(function(isValid){
			expect(isValid).to.be.false;
			done();
		}).catch(done);
	});

});
