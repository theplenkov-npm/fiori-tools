/// <reference types="./ui5.d.ts" />
import { RequestHandler } from 'express';

import { MiddlewareParameters } from '@ui5/server';

export * from '@ui5/server';

export type UI5_Middleware<t> = (
  input: Readonly<MiddlewareParameters<t>>
) => Promise<RequestHandler> | RequestHandler;
