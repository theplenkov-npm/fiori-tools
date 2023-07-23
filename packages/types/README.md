# UI5 Middleware types

This package is a part of [Fiori Tools Extensions](https://www.npmjs.com/package/fiori-tools) project which is set of plugins working on top of [SAP Fiori Tools](https://www.npmjs.com/package/@sap/ux-ui5-tooling) or [UI5 server](https://www.npmjs.com/package/@ui5/server)

Currently it allows to define ui5 middleware with default types:

```typescript
import { UI5_Middleware } from '@fiori/types';

interface Input {
  foo?: string;
  bar?: string;
}

export const yourMiddleware: UI5_Middleware<Input> = function (input) {
  return (req, res, next) => {
    // do something

    next();
  };
};

export default yourMiddleware;
```

## Open issues
Currently it's using types declared in [open-ux-tools project](https://github.com/SAP/open-ux-tools/blob/main/types/ui5.d.ts) developed by SAP, and I'd really wish that those types may become also usable directly via npm package soon. The [issue](https://github.com/SAP/open-ux-tools/issues/1114) has been created for this feature request. Once that package is available may be there will be no need in this package too.