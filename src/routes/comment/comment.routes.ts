import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";

const commentRouter = new Router({
  prefix: '/comment'
});

commentRouter.get('/', async (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = await ctx.state.database.getComments();
});

commentRouter.get('/:id', async (ctx) => {
  const { id } = ctx.params;

  const selectedComment = await ctx.state.database.getCommentBy(id);
  if (!selectedComment) {
    ctx.response.status = 404;
    ctx.response.message = "Comment not found";
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = selectedComment;
});

commentRouter.post('/', authenticationMiddleware, async (ctx) => {
  const { text, postId } = ctx.request.body;
  if (!text || !postId) {
    ctx.response.status = 400;
    ctx.response.message = "Missing text / postId";
    return;
  }

  const newComment = await ctx.state.database.createComment({text, postId, author: ctx.state.user.id});

  ctx.response.status = 200;
  ctx.response.message = "Comment creation completed";
  ctx.response.body = newComment;
});

commentRouter.delete('/:id', authenticationMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const selectedComment = await ctx.state.database.getCommentBy(id);
  if (!selectedComment) {
    ctx.response.status = 404;
    ctx.response.message = "Comment not found";
    return;
  }

  const isAuthor = ctx.state.user.id === selectedComment.author;
  if (!isAuthor) {
    ctx.response.status = 401;
    ctx.response.message = "You can't delete other people's comments";
    return;
  }

  const deletedComment = await ctx.state.database.deleteCommentBy(id);

  ctx.response.status = 200;
  ctx.response.message = "Your comment has been deleted";
  ctx.response.body = deletedComment;
});

commentRouter.patch('/:id', authenticationMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const selectedComment = await ctx.state.database.getCommentBy(id);
  if (!selectedComment) {
    ctx.response.status = 404;
    ctx.response.message = "Comment not found";
    return;
  }

  const isAuthor = ctx.state.user.id === selectedComment.author;
  if (!isAuthor) {
    ctx.response.status = 401;
    ctx.response.message = "You can't update other people's comments";
    return;
  }

  const { text } = ctx.request.body;
  if (!text) {
    ctx.response.status = 400;
    ctx.response.message = "Nothing to update";
    return;
  }

  const updatedComment = await ctx.state.database.updateCommentBy({ id, text });

  ctx.response.status = 200;
  ctx.response.message = "Your comment has been updated";
  ctx.response.body = updatedComment;
})

export default commentRouter;
