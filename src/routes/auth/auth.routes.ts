import Router from "@koa/router";
import AuthenticationUtils from "../../utils/authentication.utils";
import authenticationMiddleware from "../../middlewares/authentication.middleware";

const authRouter = new Router({
  prefix: '/auth'
});

authRouter.post('/login', async (ctx) => {
  const {email, password} = ctx.request.body;
  if (!email || !password) {
    ctx.response.status = 400;
    ctx.response.message = "Missing email and / or password";
    return;
  }

  try {
    // todo: implement authentication against db
    ctx.response.body = AuthenticationUtils.generateTokens({ email });
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.message = "Something went terribly wrong";
  }
});

authRouter.post('/refresh', async (ctx) => {
  const refreshToken = ctx.request.body.refreshToken;
  if (!refreshToken) {
    ctx.response.status = 401;
    ctx.response.message = "Access Denied. No refresh token provider";
    return;
  }

  try {
    const decodedJwt = AuthenticationUtils.verifyToken(refreshToken);
    if (typeof decodedJwt.payload === 'string') {
      ctx.response.status = 400;
      ctx.response.message = "Access Denied. Invalid refresh token.";
      return;
    }


    ctx.response.body = AuthenticationUtils.generateTokens({ email: decodedJwt.payload.email });
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.message = "Access Denied. Invalid refresh token.";
  }
});

authRouter.get('/tryAuth', authenticationMiddleware, async (ctx) => {
  ctx.response.body = {
    message: "Congratulations! You pass our authentication",
  }
});

export default authRouter;