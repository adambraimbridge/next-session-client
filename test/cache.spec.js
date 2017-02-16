'use strict';
/*global describe, it*/
const cache = require('../src/cache');
const expect = require('chai').expect;


describe('Cache', function (){

	it('Should be able to save and retrieve an object', function (done){
		const obj = {foo:'bar'};
		cache(obj);
		expect(cache()).to.deep.equal(obj);
		done();
	});

	it('Should be able to save and retrieve a saved value', function (done){
		const uuid = 'svsdvsdvsdvsv';
		cache('uuid', uuid);
		expect(cache('uuid')).to.equal(uuid);
		done();
	});

});
