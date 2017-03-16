import cache from '../src/cache';

describe('Cache', function () {

	it('Should be able to save and retrieve an object', function () {
		const obj = { foo: 'bar' };
		cache(obj);
		cache().should.eql(obj);
	});

	it('Should be able to save and retrieve a saved value', function () {
		const uuid = 'svsdvsdvsdvsv';
		cache('uuid', uuid);
		cache('uuid').should.equal(uuid);
	});

});
