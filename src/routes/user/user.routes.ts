import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import database from "../../database/init.database.js";

const userRouter = new Router({
  prefix: '/user'
});

userRouter.get('/me', authenticationMiddleware, async (ctx) => {
  const currentUser = database.data.users.find(user => user.email === ctx.state.userEmail);
  if (!currentUser) {
    ctx.response.status = 404;
    ctx.response.message = "User not found";
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = currentUser;
});

userRouter.delete('/', authenticationMiddleware, async (ctx) => {
  const currentUser = database.data.users.find(user => user.email === ctx.state.userEmail);
  if (!currentUser) {
    ctx.response.status = 404;
    ctx.response.message = "User not found";
    return;
  }

  database.data.users = database.data.users.filter(user => user.email !== ctx.state.userEmail);

  ctx.response.status = 200;
  ctx.response.message = "User has been deleted";
});

export default userRouter;
