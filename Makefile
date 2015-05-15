.PHONY: test

clean:
	git clean -xfd

install:
	origami-build-tools install

verify:
	nbt verify --skip-layout-checks

test:
	./node_modules/karma/bin/karma start

test-app:
	rm -rf test/app/public/
	mkdir test/app/public/
	browserify test/app/main.js --debug --transform debowerify > test/app/public/bundle.js
	node test/app/server.js
