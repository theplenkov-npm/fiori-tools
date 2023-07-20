import { UI5_Middleware } from '@fiori/types';
import { redirectToHomePage, RedirectToHomePageInput } from './home-page.js';
import { deepmerge as merge } from 'deepmerge-ts';

const sandbox: RedirectToHomePageInput = {
  home_page: '/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html',
};

export const redirectToSandbox: UI5_Middleware<RedirectToHomePageInput> = (
  input
) => {
  return redirectToHomePage(
    merge(input, { options: { configuration: sandbox } })
  );
};

export default redirectToSandbox;
