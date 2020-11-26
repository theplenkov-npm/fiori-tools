const express = require("express");

module.exports = function ({ options }) {
  const app = express();

  let { configuration } = options;

  let { home_page } = configuration;

  // change URL parameters
  app.get("/", (req, res) => {
    res.redirect(home_page);
  });

  return app;
};
