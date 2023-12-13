import Koa from "koa";
import AuthenticationUtils from "../utils/authentication.utils";

const authenticationMiddleware: Koa.Middleware = async (context, next) => {
  const accessToken = context.headers['authorization'];

  if (!accessToken) {
    context.status = 401;
    context.message = "Access Denied. No token provided.";
    return;
  }

  const actualToken = accessToken.slice(accessToken.indexOf(' ') + 1);
  AuthenticationUtils.verifyToken(actualToken);
  await next();
}

export default authenticationMiddleware;
