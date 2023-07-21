import { UI5_Middleware } from '@fiori/types';

export interface RedirectToHomePageInput {
  home_page: string;
  query?: Record<string, unknown>;
}

const localhost = 'http://localhost';

export const redirectToHomePage: UI5_Middleware<RedirectToHomePageInput> =
  function (input) {
    if (!input?.options?.configuration?.home_page) {
      console.log(
        'Home page is not provided. fiori-tools-home-page middleware is ignored',
      );
      return (req, res, next) => next();
    }

    const { configuration } = input.options;
    const { home_page, query } = configuration;
    return (req, res, next) => {
      if (req.path === '/') {
        // create dummy url to reuse URL api
        const oUrl = new URL(home_page, localhost);

        // set query parameters from config
        if (query) {
          for (const [key, value] of Object.entries(query)) {
            const v = value?.toString();
            if (v) {
              oUrl.searchParams.set(key, v);
            }
          }
        }

        // set query parameters from request
        for (const [key, value] of Object.entries(req.query)) {
          const v = value?.toString();
          if (v) {
            oUrl.searchParams.set(key, v);
          }
        }

        return res.redirect(oUrl.toString().replace(localhost, ''));
      }
      return next();
    };
  };

export default redirectToHomePage;
