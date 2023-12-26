import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";

const userRouter = new Router({
  prefix: '/user'
}).use(authenticationMiddleware);

userRouter.get('/me', async (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = ctx.state.user;
});

userRouter.delete('/', async (ctx) => {
  const deletedUser = await ctx.state.database.deleteUserBy(ctx.state.user.email);
  ctx.response.status = 200;
  ctx.response.message = "User has been deleted";
  ctx.response.body = deletedUser;
});

userRouter.get('/post', async (ctx) => {
  const posts = await ctx.state.database.getUserPosts(ctx.state.user.id);
  ctx.response.status = 200;
  ctx.response.body = posts;
})

userRouter.delete('/post', async (ctx) => {
  const deletedPosts = await ctx.state.database.deleteUserPosts(ctx.state.user.id);
  ctx.response.status = 200;
  ctx.response.body = deletedPosts;
})

userRouter.get('/comment', authenticationMiddleware, async (ctx) => {
  const comments = await ctx.state.database.getUserComments(ctx.state.user.id);

  ctx.response.status = 200;
  ctx.response.body = comments;
})

userRouter.delete('/comment', authenticationMiddleware, async (ctx) => {
  const deletedComments = await ctx.state.database.deleteUserComments(ctx.state.user.id);

  ctx.response.status = 200;
  ctx.response.message = "Your comments have been deleted";
  ctx.response.body = deletedComments;
});

export default userRouter;
