# Direct Load UI5 Middleware ( CDN injection )

This package is a part of [Fiori Tools Extensions](https://www.npmjs.com/package/fiori-tools) project which is set of plugins working on top of [SAP Fiori Tools](https://www.npmjs.com/package/@sap/ux-ui5-tooling) or [UI5 server](https://www.npmjs.com/package/@ui5/server)

## What does it do?

By default UI5 server serves resources from a localhost. This way of serving resources creates additional load on your server to proxy and cache multiple files. From the other side, when using files from CDN browser already supports caching out of the box. UI5 docs describe such a technique as [Bootstrapping From SAPUI5 CDN](https://ui5.sap.com/#/topic/2d3eb2f322ea4a82983c1c62a33ec4ae). The idea is simple - we use an absolute URL in bootstrap script instead of the relative one. 

UI5 Middleware allows you to inject cdn using [directLoad](https://www.npmjs.com/package/@sap-ux/ui5-proxy-middleware#loading-ui5-sources-directly-from-ui5-cdn) parameter. However the issue is - it allows to do this only for statically served files. Therefore such an extension doesn't bring that much value if you can just change the html file in your project.

Meanwhile the current extension implements a similar feature, but in a slightly different way. Instead of reading files from the file storage we intersept the html content by a given path and if it's ui5 page - it will inject an absolute URL into `sap-ushell-bootstrap` and `sap-ui-bootstrap` scripts

This extension will trasform html page like this:

```html
<script id="sap-ushell-bootstrap" src="../../bootstrap/sandbox.js"></script>
<script id="sap-ui-bootstrap" src="../../../../../resources/sap-ui-core.js"></script>
```

into a page with resolved absolute links:

```html
<script
  id="sap-ushell-bootstrap"
  src="https://sapui5.hana.ondemand.com/1.78.0/test-resources/sap/ushell/bootstrap/sandbox.js"
></script>

<script
  id="sap-ui-bootstrap"
  src="https://sapui5.hana.ondemand.com/1.78.0/resources/sap-ui-core.js"
></script>
```

## How to use

To use this middeware you need to provide paths to listen ( should be html page currently ) and ui5 config

```yaml
server:
  customMiddleware:
    - name: fiori-tools-proxy-cdn
      beforeMiddleware: fiori-tools-proxy
      configuration:
        paths:
          - /**/fioriSandbox.html        
        ui5:
          path:
            - /resources
            - /test-resources
          url: https://sapui5.hana.ondemand.com
        version: 1.78.0        
```

It is also possible to use yaml v1 tags to reuse your config from ui5-proxy-middleware / fiori-tools-proxy

```yaml
server:
  customMiddleware:
    - name: ui5-proxy-middleware
      beforeMiddleware: compression
      configuration: &ui5-config
        ui5:
          path:
            - /resources
            - /test-resources
          url: https://sapui5.hana.ondemand.com
        version: 1.115.0
    - name: fiori-tools-proxy-cdn
      beforeMiddleware: ui5-proxy-middleware
      configuration:
        paths:
          - /**/fioriSandbox.html
        <<: *ui5-config    
```
