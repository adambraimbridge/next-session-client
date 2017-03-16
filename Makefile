include n.Makefile

unit-test:
	karma start test/karma.conf.js

test: verify unit-test
