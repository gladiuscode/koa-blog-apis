import {JSONPreset} from "lowdb/node";
import {User} from "./types.database.js";

interface Database {
  users: User[];
}

const database = await JSONPreset<Database>('db.json', { users: [] });

export default database;
