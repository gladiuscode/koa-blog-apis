import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";

const userRouter = new Router({
  prefix: '/user'
});

userRouter.get('/me', authenticationMiddleware, async (ctx) => {
  const currentUser = await ctx.state.database.getUserBy(ctx.state.userEmail);
  if (!currentUser) {
    ctx.response.status = 404;
    ctx.response.message = "User not found";
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = currentUser;
});

userRouter.delete('/', authenticationMiddleware, async (ctx) => {
  const currentUser = await ctx.state.database.getUserBy(ctx.state.userEmail);
  if (!currentUser) {
    ctx.response.status = 404;
    ctx.response.message = "User not found";
    return;
  }

  const deletedUser = await ctx.state.database.deleteUserBy(currentUser.email);

  ctx.response.status = 200;
  ctx.response.message = "User has been deleted";
  ctx.response.body = deletedUser;
});

export default userRouter;
