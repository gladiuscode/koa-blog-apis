import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";

const postRouter = new Router({
  prefix: '/post'
});

postRouter.get('/', async (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = await ctx.state.database.getPosts();
});

postRouter.get('/:id', async (ctx) => {
  const { id } = ctx.params;

  const selectedPost = await ctx.state.database.getPostBy(id);
  if (!selectedPost) {
    ctx.response.status = 404;
    ctx.response.message = "Post not found";
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = selectedPost;
});

postRouter.post('/', authenticationMiddleware, async (ctx) => {
  const currentUser = await ctx.state.database.getUserBy(ctx.state.userEmail);
  if (!currentUser) {
    ctx.response.status = 404;
    ctx.response.message = "User not found";
    return;
  }

  const { title, description, date } = ctx.request.body;
  if (!title || !description) {
    ctx.response.status = 404;
    ctx.response.message = "Missing title / description";
    return;
  }

  await ctx.state.database.createPost({title, description, date, author: currentUser.id});

  ctx.response.status = 200;
  ctx.response.message = "Post creation completed";
});

postRouter.delete('/:id', authenticationMiddleware, async (ctx) => {
  const currentUser = await ctx.state.database.getUserBy(ctx.state.userEmail);
  if (!currentUser) {
    ctx.response.status = 404;
    ctx.response.message = "User not found";
    return;
  }

  const { id } = ctx.params;
  const selectedPost = await ctx.state.database.getPostBy(id);
  if (!selectedPost) {
    ctx.response.status = 404;
    ctx.response.message = "Post not found";
    return;
  }

  const isAuthor = currentUser.id === selectedPost.author;
  if (!isAuthor) {
    ctx.response.status = 401;
    ctx.response.message = "You can't delete other people's posts";
    return;
  }

  await ctx.state.database.deletePostBy(id);

  ctx.response.status = 200;
  ctx.response.message = "Your post has been deleted";
});

export default postRouter;
