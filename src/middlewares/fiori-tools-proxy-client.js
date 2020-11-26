const express = require("express");

module.exports = function ({  options }) {
  const app = express();

  let { configuration } = options;

  let { backend } = configuration;

  [backend].flat().forEach(({ path, client }) => {
    app.use(`${path}*`, (req, res, next) => {
      let oUrl = new URL(req.originalUrl, "http://localhost");
      oUrl.searchParams.set("sap-client", client);
      req.originalUrl = oUrl.toString().replace("http://localhost", "");

      // req.query["sap-client"] = client;
      // req.headers["sap-client"] = client;
      // req.headers.cookie = req.headers.cookie.replace(
      //   /(?<=sap-client=).*(?=;)|(?<=sap-client=).*$/,
      //   client
      // );
      next();
    });
    console.log(`Setting up client ${client} for requests to ${path}`);
  });

  return app;
};
