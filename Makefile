# Load environment variables from .env file
include .env
export

.PHONY: inspect build

# Build the TypeScript project
build:
	npm run build

# Run the MCP inspector with environment variables
inspect: build
	npx @modelcontextprotocol/inspector \
		-e TENDERLY_ACCOUNT_SLUG=$(TENDERLY_ACCOUNT_SLUG) \
		-e TENDERLY_PROJECT_ID=$(TENDERLY_PROJECT_ID) \
		-e TENDERLY_ACCESS_TOKEN=$(TENDERLY_ACCESS_TOKEN) \
		node build/index.js 