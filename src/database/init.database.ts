import {JSONPreset} from "lowdb/node";
import {Post, User} from "./types.database.js";

interface Database {
  users: User[];
  posts: Post[];
}

const database = await JSONPreset<Database>('db.json', { users: [], posts: [] });

export default database;
