.PHONY: test

clean:
	git clean -xfd

install:
	npm install

verify:
	nbt verify

test:
	karma start
