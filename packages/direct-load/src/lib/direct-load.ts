import { UI5_Middleware } from '@fiori/types';
import * as cheerio from 'cheerio';
import { FioriToolsProxyConfigUI5 } from '@sap-ux/ui5-config';
// import { urlToHttpOptions } from 'node:url';
import * as path from 'node:path';

interface Input {
  paths?: Array<string>;
  ui5?: Partial<FioriToolsProxyConfigUI5>;
}

export const injectUI5cdn: UI5_Middleware<Input> = function (input) {
  const HTML_MOUNT_REGEX = input.options.configuration?.paths?.map(
    (mountPath) => {
      const regexPattern = `^${mountPath.replace('**', '.*')}$`;
      return new RegExp(regexPattern);
    }
  );

  return (req, res, next) => {
    //skip if ui5 url is not provided
    if (!input.options.configuration?.ui5?.url) {
      return next();
    }

    // Check if the requested path matches any of the pre-compiled regex patterns
    const isMatch = HTML_MOUNT_REGEX?.some((regex) => regex.test(req.url));

    // If there's a match, handle the request accordingly
    if (isMatch) {
      // Create a variable to store the modified content
      const { write, end } = res;
      const chunks: Buffer[] = [];

      const cdnUrl = new URL( path.join('/',input.options.configuration?.ui5?.version || '', req.url ),input.options.configuration?.ui5?.url);

      // Override the write method to capture the response content
      res.write = function (chunk) {
        chunks.push(Buffer.from(chunk));
      } as typeof write;

      // Override the end method to modify the response content before sending it
      res.end = function (data, encoding) {
        if (data) {
          chunks.push(Buffer.from(data));
        }
        const html = Buffer.concat(chunks).toString();
        const modifiedContent = bootstrapCDN(html);
        res.setHeader('Content-Length', Buffer.byteLength(modifiedContent));
        write.call(res, modifiedContent, encoding as never);
        end.call(res, undefined, encoding as never);
      } as typeof end;

      const bootstrapCDN = (html: string) => {
        const $ = cheerio.load(html);

        $('#sap-ushell-bootstrap, #sap-ui-bootstrap').each((_i, el) => {
          const src = el.attribs['src'];
          if (src) {
            const newUrl = new URL(src, cdnUrl);
            $(el).attr('src', newUrl.toString());
          }
        });

        return $.html();
      };
    }
    next();
  };
};

export default injectUI5cdn;
