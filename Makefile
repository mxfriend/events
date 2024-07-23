.PHONY: default
default: cjs

.PHONY: rebuild
rebuild: clean cjs

.PHONY: clean
clean:
	rm -rf cjs types

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

cjs: node_modules
	node_modules/.bin/tsc
