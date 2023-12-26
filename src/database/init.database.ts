import {JSONPreset} from "lowdb/node";
import {Comment, Post, User} from "./types.database.js";

interface Database {
  users: User[];
  posts: Post[];
  comments: Comment[];
}

const database = await JSONPreset<Database>('db.json', { users: [], posts: [], comments: [] });

export default database;
