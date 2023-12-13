import Koa from "koa";

const loggerMiddleware: Koa.Middleware = async (context, next) => {
  console.group('[REQUEST RECEIVED]');
  console.log('-> at', new Date().toLocaleString());
  console.log('-> headers', context.request.headers);
  console.log('-> path', context.request.path);
  console.groupEnd();

  await next();
}

export default loggerMiddleware;
