import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);

let db:any;

const connectDB = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db('anscer_db');
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
  return db;
};

export default connectDB;
