const express = require("express");

module.exports = function ({ options }) {
  const app = express();

  let { configuration } = options;

  let { home_page } = configuration;

  // only needed to create URL
  const dummy = "http://localhost";

  // change URL parameters
  app.get("/", (req, res) => {
    // create dummy url to reuse URL api
    let oUrl = new URL(home_page, dummy);
    //fill query
    Object.entries(req.query).forEach((query) =>
      oUrl.searchParams.set(query[0], query[1])
    );
    res.redirect(oUrl.toString().replace(dummy, ""));
  });

  return app;
};
