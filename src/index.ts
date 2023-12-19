import Koa from 'koa';
import Router from '@koa/router';
import {bodyParser} from "@koa/bodyparser";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import authRouter from "./routes/auth/auth.routes.js";
import userRouter from "./routes/user/user.routes.js";

const app = new Koa();
const router = new Router();

router.use(
  authRouter.routes(),
  userRouter.routes(),
);

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
