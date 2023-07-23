# Home Page UI5 middleware

This package is a part of [Fiori Tools Extensions](https://www.npmjs.com/package/fiori-tools) project which is set of plugins working on top of [SAP Fiori Tools](https://www.npmjs.com/package/@sap/ux-ui5-tooling) or [UI5 server](https://www.npmjs.com/package/@ui5/server)

## What does it do?

Standard `fiori run` / `ui5 serve` command run http://localhost:8080 serving your static file tree by default. This extension may redirect you to a specifc page from a root path.

![](../../docs/img/redirect_to_home_page.gif)

In the template provided by Fiori Tools application generator we can see test/flpSandbox.html and test/flpSandboxMockServer.html files. Besides of that we have also sandbox launchpad available as a part of UI5 library and we can take it directly from the test resources. [Fiori Launchpad - Sandbox for application development](https://ui5.sap.com/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Shell-home). In addition to that, sandbox launchpad delivers possibility to maintain application config as a separate fioriSandbox.json file which creates even a space to generate it via API.

## How to use

Standard `fiori run`/`ui5 serve` command run just http://localhost:8080 page while may be you want to redirect to a specifc page as a home page. This extension can be used in two modes:

```yaml
specVersion: '3.0'
type: library
metadata:
  name: { { your app } }
server:
  customMiddleware:
    - name: fiori-tools-home-page
      beforeMiddleware: serveIndex
      configuration:
        home_page: path/to/your/home/page.html
        query:
          use-additional-parameter: true
```

or just like this as a shortcut to `home_page: /test-resources/sap/ushell/shells/sandbox/fioriSandbox.html`, delivered by ui5 library itself.

```yaml
specVersion: '3.0'
type: library
metadata:
  name: { { your app } }
server:
  customMiddleware:
    - name: fiori-tools-sandbox
      beforeMiddleware: serveIndex
      configuration:
        query:
          sap_ui_debug: true
```

it is important to remember that /test-reources should be served by your server too, for example using proxy middleware

```yaml
server:
  customMiddleware:
    - name: fiori-tools-proxy
      beforeMiddleware: compression
      configuration:
        ui5:
          path:
            - /resources
            - /test-resources
        url: https://ui5.sap.com
```
