const fs = require("fs");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const ProxyAgent = require("proxy-agent");

function readConfig(config, path) {
  if (config) {
    return config;
  }

  if (path) {
    try {
      let oFile = fs.readFileSync(path);
      //let aResources = await resources.rootProject.byPath(path);
      return JSON.parse(oFile);
    } catch (error) {
      throw `File ${path} is not found. Middleware fiori-tools-neo-app is ignored.`;
    }
  }
}

try {
  var agent = ((
    proxy_url = process.env.http_proxy ||
      process.env.https_proxy ||
      process.env.HTTP_PROXY ||
      process.env.HTTPS_PROXY
  ) => proxy_url && new ProxyAgent(proxy_url))();
} catch (error) {
  // proxy agent is not initialized
}

module.exports = function ({ options }) {
  try {
    let oNeoApp = readConfig(
      options &&
        options.configuration &&
        options.configuration.neo &&
        options.configuration.neo.app,
      "neo-app.json"
    );

    let oDestinations = readConfig(
      options &&
        options.configuration &&
        options.configuration.neo &&
        options.configuration.neo.destinations,
      "neo-dest.json"
    );
    const app = express();

    [oNeoApp && oNeoApp.routes]
      .flat()
      .forEach(({ path, target, description }) => {
        let path_description = description && `(${description})`;

        let { type, name, entryPath } = target;

        switch (type) {
          case "sapui5":
          case "destination":
            try {
              console.log(`Path detected: ${path} ${path_description}`);
              let oDestination = oDestinations[name];

              app.use(
                path,
                createProxyMiddleware(
                  oDestination.target,
                  Object.assign(
                    {
                      changeOrigin: true,
                      pathRewrite: entryPath && { [`^${path}`]: entryPath },
                      // may be later to implement real should proxy rule
                      agent: oDestination.useProxy && agent,
                    },
                    oDestination
                  )
                )
              );
            } catch (error) {
              console.warn(
                `Destination ${name} is not found in configuration. Path "${path}" is not configured`
              );
            }
        }
      });

    return app;
  } catch (error) {
    console.warn(error);
    return function (req, res, next) {
      next();
    };
  }
};
