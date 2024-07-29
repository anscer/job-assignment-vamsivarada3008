var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!db) {
        try {
            yield client.connect();
            db = client.db('anscer_db');
            console.log("Connected to MongoDB");
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
    return db;
});
export default connectDB;
