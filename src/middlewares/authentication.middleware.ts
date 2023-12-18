import Koa from "koa";
import AuthenticationUtils from "../utils/authentication.utils.js";

const authenticationMiddleware: Koa.Middleware = async (context, next) => {
  const accessToken = context.headers['authorization'];

  if (!accessToken) {
    context.status = 401;
    context.message = "Access Denied. No token provided.";
    return;
  }

  const actualToken = accessToken.slice(accessToken.indexOf(' ') + 1);

  try {
    AuthenticationUtils.verifyToken(actualToken);
    await next();
  } catch (e) {
    context.status = 401;
    context.message = "Access Denied. Token Expired";
  }
}

export default authenticationMiddleware;
