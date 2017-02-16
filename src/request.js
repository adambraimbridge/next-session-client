'use strict';

function request (url) {
	// if we don't have a session token cookie, don't bother..
	if (document.cookie.indexOf('FTSession=') === -1) {
		return Promise.reject(new Error('No session cookie found'));
	}

	return fetch(`https://session-next.ft.com${url}`, {
		credentials:'include',
		useCorsProxy: true
	}).then(function (response) {
		if (response.ok){
			return (url === '/validate') ? Promise.resolve(true) : response.json();
		} else {
			return (url === '/validate') ? Promise.resolve(false) : Promise.reject(response.status);
		}

	}).catch(function (e) {
		const message = e.message || '';
		if (message.indexOf('timed out') > -1 || message.indexOf('Network request failed') > -1 || message.indexOf('Not Found') > -1) {
			// HTTP timeouts and invalid sessions are a fact of life on the internet.
			// We don't want to report this to Sentry.
		} else {
			document.body.dispatchEvent(new CustomEvent('oErrors.log', {
				bubbles: true,
				detail: {
					error: e,
					info: {
						component: 'next-session-client'
					}
				}
			}))
		}
	});
}

module.exports = request;
