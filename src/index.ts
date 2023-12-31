import 'dotenv/config';

import Koa from 'koa';
import Router from '@koa/router';
import {bodyParser} from "@koa/bodyparser";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import databaseInitMiddleware from "./middlewares/databaseInit.middleware.js";
import authRouter from "./routes/auth/auth.routes.js";
import userRouter from "./routes/user/user.routes.js";
import postRouter from "./routes/post/post.routes.js";
import commentRouter from "./routes/comment/comment.routes.js";

const app = new Koa();
const router = new Router();

router.use(
  authRouter.routes(),
  userRouter.routes(),
  postRouter.routes(),
  commentRouter.routes()
);

//////////////////////////////////////////
//
//              MIDDLEWARES
//
//////////////////////////////////////////

app
  .use(loggerMiddleware)
  .use(bodyParser())
  .use(databaseInitMiddleware)
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
