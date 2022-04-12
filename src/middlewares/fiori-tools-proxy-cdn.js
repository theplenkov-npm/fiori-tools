const express = require("express");
const nocache = require("nocache");
// nodejs jQuery
const cheerio = require("cheerio");
const zlib = require("zlib");
const assert = require('assert').strict;

module.exports = function ({ options }) {
  // create new router
  const app = express();

  // build cdn from config
  const { configuration } = options;

  const { ui5, path, theme } = configuration;

  assert(ui5, "ui5 configuration is not provided for fiori-tools-proxy-cdn middleware");

  const cdn = (({ url, version } = ui5) =>
    version ? `${url}/${version}` : url)();

  // console.log("CDN bootstrap plugin is loaded");

  app.get(path || '*.html', (req, res, next) => {
    let { send, write } = res;

    const home_page_full = `${cdn}${req.url}`;

    // function debug() {
    //   // eslint-disable-next-line no-debugger
    //   debugger;
    // }

    // // res.socket.on("data", () => debug());
    // res.socket.on("end", () => debug());


    // console.log("CDN bootstrap plugin is triggered");

    function decompress(data, encoding) {
      switch (encoding) {
        case "gzip":
          return zlib.gunzipSync(data);
        default:
          return data;
      }
    }

    Object.assign(res, {
      write(chunk) {
        try {
          let html = bootstrapCDN(chunk.toString());
          this.header().set("content-length", html.length);
          nocache()(req, res, () => { });
          return write.call(this, Buffer.from(html));
        } catch (error) {
          return write.apply(this, arguments);
        }
      },
      send(data) {
        console.log(`Send home page`);
        switch (this.statusCode) {
          case 200: {
            const encoding = res.getHeader("content-encoding");
            res.removeHeader("content-encoding");
            send.call(this, bootstrapCDN(decompress(data, encoding)));
            break;
          }
          // eslint-disable-next-line no-fallthrough
          default:
            send.apply(this, arguments);
        }
      },
      // end() {
      //   debug();
      // }
    });

    next();

    function bootstrapCDN(html) {
      let $ = cheerio.load(html);

      //resolve scripts
      Array.from($("script"))
        .filter((script) => script && script.attribs && script.attribs.src)
        .forEach((script) => {
          let attr = $(script).attr();
          attr.src = new URL(attr.src, home_page_full).toString();
        });

      //resolve links
      Array.from($("link"))
        .filter((node) => node && node.attribs && node.attribs.href)
        .forEach((node) => {
          let attr = $(node).attr();
          attr.href = new URL(attr.href, home_page_full).toString();
        });


      // bootstrap theme
      theme && Array.from($("#sap-ui-bootstrap")).forEach((node) => {
        let attr = $(node).attr();
        attr["data-sap-ui-theme"] = theme;
      });

      return $.html();
    }

  });

  return app;


};
