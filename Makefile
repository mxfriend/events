.PHONY: default
default: dist

.PHONY: rebuild
rebuild: clean dist

.PHONY: clean
clean:
	rm -rf dist

node_modules:
	npm ci

.PHONY: lint
lint: node_modules
	node_modules/.bin/eslint src esm
	node_modules/.bin/prettier --check src esm

.PHONY: pretty
pretty: node_modules
	node_modules/.bin/eslint --fix src esm
	node_modules/.bin/prettier --write src esm

dist: node_modules
	node_modules/.bin/tsc
