import { RequestHandler } from 'express';

import { MiddlewareParameters } from '@ui5/server';

export type UI5_Middleware<t> = (
  input: Readonly<MiddlewareParameters<t>>
) => Promise<RequestHandler> | RequestHandler;
