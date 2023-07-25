# UI5 Tooling + Typescript

This extension brings a tiny command which will allow you to serve your TS middleware on your UI5 server without compilation.
It's using embedded ts-node esm loader allowing us to resolve _.js references to _.ts files on the fly.

## How to use

`ui5-ts` is nothing more than just `ui5` CLI loaded via ts-node, therefore it has same interface with commands like `ui5-ts serve`.

## Things to remember

- it requires ts-node to be installed globally or as a dependency
- it supports only middlewares developed as ESM modules
- it requires dotenv to init your environment variables from .env file in your cwd
