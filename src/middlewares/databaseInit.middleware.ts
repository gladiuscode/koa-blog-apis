import Koa from "koa";
import DatabaseDatasource from "../data/datasources/database.datasource.js";

const databaseInitMiddleware: Koa.Middleware = async (context, next) => {
  try {
    context.state.database = new DatabaseDatasource();
  } catch (e) {
    context.status = 401;
    context.message = "Something went wrong during database initialization.";
  }
  return next();
}

export default databaseInitMiddleware;
