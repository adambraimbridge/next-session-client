.PHONY: test

clean:
	git clean -xfd

install:
	npm install

verify:
	nbt verify

test:
	karma start

test-app:
	rm -rf test/app/public/
	mkdir test/app/public/
	browserify test/app/main.js --debug --transform debowerify > test/app/public/bundle.js
	node test/app/server.js
