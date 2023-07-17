import { RequestHandler } from 'express';

type UI5_MiddlewareInput<configuration> = {
  options: { configuration?: configuration };
};

export type UI5_Middleware<t> = (
  input: Readonly<UI5_MiddlewareInput<t>>
) => Promise<RequestHandler> | RequestHandler;
