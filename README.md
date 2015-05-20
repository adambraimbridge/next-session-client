# Next Session Client

A client for working with the Ft Next service from the front-end.

## Installing

	npm install --save ft-next-session-client


## Using

	var session = require('ft-next-session-client');

	// check if current session is valid
	session.validate().then(function(isValid){
		// true or false
	});

	// check session details
	session.details().then(function(sessionDetails){
		// object or false if session is invalid
	});

	// get uuid from session
	session.uuid().then(function(data){
		// data will be false if session is invalid
		var uuid = data.uuid
	});

	// get session cookie
	session.cookie()

## Note

The `details` and `uuid` methods are cached server-side.  If you need to be sure that the user is logged in, use `validate()`.
