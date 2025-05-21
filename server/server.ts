import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import statsRoutes from './routes/stats';
import playoffScraper from './routes/playoffScraper'; // ✅ NEW IMPORT

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'https://hockey-scores.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ✅ Route setup
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/stats', playoffScraper); // ✅ Add this route for playoff scraping

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
