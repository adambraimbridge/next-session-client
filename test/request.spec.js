'use strict';
/*global describe, it, before, afterEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var request = require('../src/request');

describe('request', function(){

	var jsonpCallbackName = '$$$JSONP_CALLBACK';

	before(function(){
		if(document.cookie.indexOf('FTSession=') < 0){
			document.cookie += 'FTSession=0-HSSzYw3kNN06CH4EwXN3rHzwAAAU1NL7xtww.MEYCIQDXxFJypS8uRn86Fjlcw9wVrf2vzC2kkd9XbcJmZpenrwIhAP0q2fTmfBa0WkJzGtnrwfcuIl3oBxXzwabrcHXE41xi';
		}
	});

	afterEach(function(){
		delete window.XDomainRequest;
		if(document.body.appendChild.restore){
			document.body.appendChild.restore();
		}
	});

	function setupFetch(response){
		var jsonFunc = function(){
			return Promise.resolve(response);
		};

		window.fetch = sinon.stub().returns(Promise.resolve({ok:true, json:jsonFunc}));
	}

	function setupJsonp(response){
		sinon.stub(document.body, 'appendChild', function(){
			var jsonpResponse = JSON.stringify(response);
			setTimeout(function(){
				window.FT[jsonpCallbackName](jsonpResponse);
			}, 500);
		});
	}

	it('Should select the correct mechanism based on CORS support', function(done){
		window.XDomainRequest = {};
		setupJsonp({success:true,data:{}});
		request('/').then(function(response){
			sinon.assert.called(document.body.appendChild);
			done();
		}).catch(done);
	});

	it('Should be able to make a CORS request to the session service', function(done){
		var email = 'paul.i.wilson@ft.com';
		setupFetch({email:email});
		request('/').then(function(response){
			try{
				sinon.assert.calledWith(window.fetch, 'https://session-next.ft.com/', {credentials:'include'});
			}catch(e){
				done(e);
			}
			done();
		}).catch(done);
	});

	it('Should be able to make a JSONP request to the session service', function(done){
		var email = 'paul.i.wilson@ft.com';
		window.XDomainRequest = {};
		setupJsonp({success:true,data:{email:email}});
		request('/').then(function(response){
			sinon.assert.called(document.body.appendChild);
			var script = document.body.appendChild.lastCall.args[0];
			expect(script.src).to.equal('https://session-next.ft.com/?callback=FT.'+jsonpCallbackName);
			done();
		}).catch(done);
	});

});
