import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { fileURLToPath } from 'url';
import path from 'path';
const router = express.Router();
// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static HTML files from the public directory
router.get('/login', (req, res) => {
    const error = req.query.error;
    res.sendFile(path.resolve(__dirname, '../../public/login.html')); // Serve static HTML file
});
router.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public/register.html')); // Serve static HTML file
});
// Register and Login
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
export default router;
