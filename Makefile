.PHONY: test

verify:
	nbt verify

test:
	./node_modules/karma/bin/karma start
