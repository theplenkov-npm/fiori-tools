const express = require("express");
const nocache = require("nocache");
// nodejs jQuery
const cheerio = require("cheerio");
const zlib = require("zlib");

module.exports = function ({options}) {
  // create new router
  const app = express();

  // build cdn from config
  const {configuration} = options;
  const {home_page, fiori_tools_proxy} = configuration;
  const cdn = (({url, version} = fiori_tools_proxy.ui5) =>
    version ? `${url}/${version}` : url)();

  const home_page_full = `${cdn}${home_page}`;

  // console.log("CDN bootstrap plugin is loaded");

  app.get(home_page, (req, res, next) => {
    let {send, write} = res;

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
          nocache()(req, res, () => {});
          console.log(`CDN ${cdn} is injected into ${home_page}`);
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
    });

    next();
  });

  return app;

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
    return $.html();
  }
};
