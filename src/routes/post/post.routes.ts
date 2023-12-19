import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import database from "../../database/init.database.js";
import {v4} from "uuid";

const postRouter = new Router({
  prefix: '/post'
});

postRouter.get('/', async (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = database.data.posts;
});

postRouter.get('/:id', async (ctx) => {
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

postRouter.post('/', authenticationMiddleware, async (ctx) => {
  const currentUser = database.data.users.find(user => user.email === ctx.state.userEmail);
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

  database.data.posts.push({
    id: v4(),
    title,
    description,
    author: currentUser.email,
    date: date ?? new Date().toISOString(),
  })

  await database.write();

  ctx.response.status = 200;
  ctx.response.message = "Post creation completed";
});


export default postRouter;
