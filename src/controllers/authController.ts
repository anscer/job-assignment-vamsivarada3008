import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);

const db = client.db('anscer_db');
const collection = db.collection('user_management');
const secret = process.env.JWT_SECRET!;

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
export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    
    // Check if user already exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      await client.close();
      return res.status(400).json({ message: 'Username already exists', success: false });
    }

    const user = { username, password: hashedPassword };
    const result = await collection.insertOne(user);
    
    await client.close();

    const token = jwt.sign({ username: user.username }, secret, {
      expiresIn: '1h',
    });

    res.cookie('jwt', token, { httpOnly: true, secure: false }); // Set secure to true in production
    res.status(201).json({ message: 'Registration successful', success: true });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message, success: false });
    } else {
      res.status(500).json({ message: "An unknown error occurred", success: false });
    }
  }
};

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
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const user = await collection.findOne({ username });
    await client.close();

    if (!user) {
      return res.redirect('/login?error=Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/login?error=Invalid credentials');
    }

    const token = jwt.sign({ username: user.username }, secret, {
      expiresIn: '1h',
    });

    res.cookie('jwt', token, { httpOnly: true, secure: false }); // Set secure to true in production
    res.json({ token, redirectTo: '/api/states' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message, success: false });
    } else {
      res.status(500).json({ message: "An unknown error occurred", success: false });
    }
  }
};

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
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('jwt');
  res.redirect('/login');
};
