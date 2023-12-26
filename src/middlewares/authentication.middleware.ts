import Koa from "koa";
import AuthenticationUtils from "../utils/authentication.utils.js";
import {Jwt} from "jsonwebtoken";

const getUserEmailInJwt = (payload: Jwt['payload']) => {
  if (typeof payload === 'string') {
    return payload;
  }

  return payload.email;
}

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
    const email = getUserEmailInJwt(decodedJWT.payload);
    const user = await context.state.database.getUserBy(email);
    if (!user) {
      context.status = 404;
      context.message = "User not found.";
      return;
    }

    context.state.user = user;
    return next();
  } catch (e) {
    context.status = 401;
    context.message = "Access Denied. Token Expired";
  }
}

export default authenticationMiddleware;
