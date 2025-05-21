import express from 'express';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Inline token validation route
router.post('/validate', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return res.sendStatus(200); // Token is valid
  } catch (err) {
    console.error('JWT validation failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;
