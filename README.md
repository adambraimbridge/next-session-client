# Next Session Client
[![Build Status](https://snap-ci.com/Financial-Times/next-session-client/branch/master/build_image)](https://snap-ci.com/Financial-Times/next-session-client/branch/master)

A client for working with the Ft Next service from the front-end.

## Installing

	npm install --save ft-next-session-client


## Using

	var session = require('ft-next-session-client');

	// get uuid from session
	session.uuid().then(function(data){
		// data will be false if session is invalid
		var uuid = data.uuid
	});

	// get session cookie
	session.cookie()

## Note

The `uuid` method is cached server-side.  If you need to be sure that the user is logged in, use `validate()`.
