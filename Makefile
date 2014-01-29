build:
	@npm install
	@mocha

dist:
	@make build
	@browserify index.js -o index.dist.js
	@uglifyjs index.dist.js -o index.dist.min.js

.PHONY: build dist