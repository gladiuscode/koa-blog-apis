import Router from "@koa/router";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import database from "../../database/init.database.js";

const usersRouter = new Router({
  prefix: '/users'
});

usersRouter.get('/me', authenticationMiddleware, async (ctx) => {
  const currentUser = database.data.users.find(user => user.email === ctx.state.userEmail);
  if (!currentUser) {
    ctx.response.status = 404;
    ctx.response.message = "User not found";
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = currentUser;
});

export default usersRouter;
