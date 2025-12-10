import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { entitiesRouter } from './routes/entities';
import { imagesRouter } from './routes/images';

export const app = express();

// Security headers
app.use(helmet());

// CORS configuration - restrict to frontend URL
const allowedOrigins = [
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Request size limits
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/entities', entitiesRouter);
app.use('/images', imagesRouter);
