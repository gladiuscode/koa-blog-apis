import {IDatabaseDatasource} from "../data/datasources/database.datasource.js";

declare module 'koa' {
  interface DefaultState {
    database: IDatabaseDatasource;
    userEmail: string;
  }
}
