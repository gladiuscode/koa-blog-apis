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
    const decodedJWT = AuthenticationUtils.verifyToken(actualToken);
    if (typeof decodedJWT.payload === 'string') {
      context.state.userEmail = decodedJWT.payload;
      return next();
    }

    context.state.userEmail = decodedJWT.payload.email;
    return next();
  } catch (e) {
    context.status = 401;
    context.message = "Access Denied. Token Expired";
  }
}

export default authenticationMiddleware;
