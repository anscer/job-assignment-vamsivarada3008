var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const db = client.db('anscer_db');
const collection = db.collection('user_management');
const secret = process.env.JWT_SECRET;
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Internal server error
 */
export const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = yield bcrypt.hash(password, 10);
    try {
        yield client.connect();
        // Check if user already exists
        const existingUser = yield collection.findOne({ username });
        if (existingUser) {
            yield client.close();
            return res.status(400).json({ message: 'Username already exists', success: false });
        }
        const user = { username, password: hashedPassword };
        const result = yield collection.insertOne(user);
        yield client.close();
        const token = jwt.sign({ username: user.username }, secret, {
            expiresIn: '1h',
        });
        res.cookie('jwt', token, { httpOnly: true, secure: false }); // Set secure to true in production
        res.status(201).json({ message: 'Registration successful', success: true });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, success: false });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred", success: false });
        }
    }
});
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        yield client.connect();
        const user = yield collection.findOne({ username });
        yield client.close();
        if (!user) {
            return res.redirect('/login?error=Invalid credentials');
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/login?error=Invalid credentials');
        }
        const token = jwt.sign({ username: user.username }, secret, {
            expiresIn: '1h',
        });
        res.cookie('jwt', token, { httpOnly: true, secure: false }); // Set secure to true in production
        res.json({ token, redirectTo: '/api/states' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, success: false });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred", success: false });
        }
    }
});
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
export const logoutUser = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
};
