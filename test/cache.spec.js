'use strict';
var cache = require('../src/cache');
var expect = require('chai').expect;


describe.only('Cache', function(){

	it('Should be able to save and retrieve an object', function(done){
		var obj = {foo:'bar'};
		cache(obj);
		expect(cache()).to.deep.equal(obj);
		done();
	});

	it('Should be able to save and retrieve a saved value', function(done){
		var uuid = 'svsdvsdvsdvsv';
		cache('uuid', uuid);
		expect(cache('uuid')).to.equal(uuid);
		done();
	});

});
