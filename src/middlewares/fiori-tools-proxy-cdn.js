const express = require("express");
// nodejs jQuery
const cheerio = require("cheerio");
const zlib = require("zlib");

module.exports = function ({ options }) {
  // create new router
  const app = express();

  // build cdn from config
  const { configuration } = options;
  const { home_page, fiori_tools_proxy } = configuration;
  const cdn = (({ url, version } = fiori_tools_proxy.ui5) =>
    version ? `${url}/${version}` : url)();

  const home_page_full = `${cdn}${home_page}`;

  app.get(home_page, (req, res, next) => {
    let { send } = res;

    function decompress(data, encoding) {
      switch (encoding) {
        case "gzip":
          return zlib.gunzipSync(data);
        default:
          return data;
      }
    }

    Object.assign(res, {
      send(data) {
        switch (this.statusCode) {
          case 200: {
            const encoding = res.getHeader("content-encoding");
            let $ = cheerio.load(decompress(data, encoding));

            //resolve scripts
            Array.from($("script"))
              .filter((script) => script?.attribs?.src)
              .forEach((script) => {
                let attr = $(script).attr();
                attr.src = new URL(attr.src, home_page_full).toString();
              });

            //resolve links
            Array.from($("link"))
              .filter((node) => node?.attribs?.href)
              .forEach((node) => {
                let attr = $(node).attr();
                attr.href = new URL(attr.href, home_page_full).toString();
              });

            res.removeHeader("content-encoding");
            send.call(this, $.html());

            //send.call(this, compress($.html(), encoding));
            break;
          }
          // eslint-disable-next-line no-fallthrough
          default:
            send.apply(this, arguments);
        }
      },
    });

    next();
  });

  return app;
};
