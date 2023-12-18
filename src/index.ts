import Koa from 'koa';
import Router from '@koa/router';
import {bodyParser} from "@koa/bodyparser";
import loggerMiddleware from "./middlewares/logger.middleware";
import authRouter from "./routes/auth/auth.routes";

const app = new Koa();
const router = new Router();

router.use(authRouter.routes());

//////////////////////////////////////////
//
//              MIDDLEWARES
//
//////////////////////////////////////////

app
  .use(loggerMiddleware)
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

//////////////////////////////////////////
//
//              ROUTES
//
//////////////////////////////////////////

app.listen(3000, () => {
  console.log('Server open and listening on port: ', 3000);
});
