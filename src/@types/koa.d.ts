import {IDatabaseDatasource} from "../data/datasources/database.datasource.js";
import {User} from "../database/types.database.js";

declare module 'koa' {
  interface DefaultState {
    database: IDatabaseDatasource;
    user: User;
  }
}
