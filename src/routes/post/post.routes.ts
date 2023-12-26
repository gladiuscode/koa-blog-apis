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
  const { title, description, date } = ctx.request.body;
  if (!title || !description) {
    ctx.response.status = 404;
    ctx.response.message = "Missing title / description";
    return;
  }

  const newPost = await ctx.state.database.createPost({title, description, date, author: ctx.state.user.id});

  ctx.response.status = 200;
  ctx.response.message = "Post creation completed";
  ctx.response.body = newPost;
});

postRouter.delete('/:id', authenticationMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const selectedPost = await ctx.state.database.getPostBy(id);
  if (!selectedPost) {
    ctx.response.status = 404;
    ctx.response.message = "Post not found";
    return;
  }

  const isAuthor = ctx.state.user.id === selectedPost.author;
  if (!isAuthor) {
    ctx.response.status = 401;
    ctx.response.message = "You can't delete other people's posts";
    return;
  }

  const deletedPost = await ctx.state.database.deletePostBy(id);

  ctx.response.status = 200;
  ctx.response.message = "Your post has been deleted";
  ctx.response.body = deletedPost;
});

postRouter.patch('/:id', authenticationMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const selectedPost = await ctx.state.database.getPostBy(id);
  if (!selectedPost) {
    ctx.response.status = 404;
    ctx.response.message = "Post not found";
    return;
  }

  const isAuthor = ctx.state.user.id === selectedPost.author;
  if (!isAuthor) {
    ctx.response.status = 401;
    ctx.response.message = "You can't delete other people's posts";
    return;
  }

  const { title, description } = ctx.request.body;
  if (!title && !description) {
    ctx.response.status = 400;
    ctx.response.message = "Nothing to update";
    return;
  }

  const updatedPost = await ctx.state.database.updatePostBy({ id, title, description });

  ctx.response.status = 200;
  ctx.response.message = "Your post has been updated";
  ctx.response.body = updatedPost;
});

postRouter.get('/:id/comment', async (ctx) => {
  const { id } = ctx.params;
  const selectedPost = await ctx.state.database.getPostBy(id);
  if (!selectedPost) {
    ctx.response.status = 404;
    ctx.response.message = "Post not found";
    return;
  }

  const postComments = await ctx.state.database.getPostComments(id);

  ctx.response.status = 200;
  ctx.response.body = postComments;
})

export default postRouter;
