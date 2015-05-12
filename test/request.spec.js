'use strict';
var expect = require('chai').expect;
var sinon = require('sinon');
var request = require('../src/request');

describe('request', function(){

	afterEach(function(){
		window.XDomainRequest = undefined;
	});

	function setup(response){
		window.fetch = sinon.stub().returns(Promise.resolve({ok:true, response:response}));
	}

	it.only('Should select the correct mechanism based on CORS support', function(done){
		window.XDomainRequest = {};
		setup('OK');
		request('/').then(function(response){
			var url = window.fetch.lastCall.args[0];
			expect(url).to.contain('callback=');
			done();
		})
	});

	it('Should be able to make a CORS request to the session service');

	it('SHould be able to make a JSONP request to the session service');

});
