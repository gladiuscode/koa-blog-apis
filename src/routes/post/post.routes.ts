import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import database from "../../database/init.database.js";

const postRouter = new Router({
  prefix: '/post'
});

postRouter.get('/', async (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = database.data.posts;
});

postRouter.get('/:id', authenticationMiddleware, async (ctx) => {
  const { id } = ctx.params;

  const selectedPost = database.data.posts.find(post => post.id === id);
  if (!selectedPost) {
    ctx.response.status = 404;
    ctx.response.message = "Post not found";
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = selectedPost;
});

export default postRouter;
