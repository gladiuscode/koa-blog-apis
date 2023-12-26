import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";

const userRouter = new Router({
  prefix: '/user'
});

userRouter.get('/me', authenticationMiddleware, async (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = ctx.state.user;
});

userRouter.delete('/', authenticationMiddleware, async (ctx) => {
  const deletedUser = await ctx.state.database.deleteUserBy(ctx.state.user.email);
  ctx.response.status = 200;
  ctx.response.message = "User has been deleted";
  ctx.response.body = deletedUser;
});

export default userRouter;
