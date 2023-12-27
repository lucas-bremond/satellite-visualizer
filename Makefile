# Apache License 2.0

project_name := satellite-visualizer
project_version := $(shell git describe --tags --always)

image_url := $(project_name)

# Dev //////////////////////////////////////////////////////////////////////////////////////////////////////////////// #

dev-image: ## Build development image
	docker build \
		--file="$(CURDIR)/development/Dockerfile" \
		--build-arg="USER_UID=$(shell id -u)" \
		--build-arg="USER_GID=$(shell id -g)" \
		--tag=$(image_url) \
		--tag=$(image_url):$(project_version) \
		.
.PHONY: dev-image

dev: dev-image ## Start development environment
	docker run \
		--name=$(project_name) \
		-it \
		--rm \
		--volume="$(CURDIR):/workspace:delegated" \
		--workdir="/workspace" \
		$(image_url) \
		zsh
.PHONY: dev

serve:
	docker-compose up --build
.PHONY: serve

# General //////////////////////////////////////////////////////////////////////////////////////////////////////////// #

clean: ## Clean repository
	find . -type d -name "build" -exec rm -rf {} +
	find . -type d -name "dist" -exec rm -rf {} +
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name ".pnpm-store" -exec rm -rf {} +
	find . -type f -name "coverage" -exec rm -rf {} +
	find . -type f -name "report" -exec rm -rf {} +
	find . -type d -name ".turbo" -exec rm -rf {} +
	find . -type f -name ".eslintcache" -exec rm -rf {} +
	find . -type f -name ".stylelintcache" -exec rm -rf {} +
.PHONY: clean

reset: ## Reset repository
	git clean -xdf
.PHONY: reset

help: ## Show help
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help

# Variables ////////////////////////////////////////////////////////////////////////////////////////////////////////// #

.EXPORT_ALL_VARIABLES:
DOCKER_BUILDKIT = 1

.DEFAULT_GOAL := help
