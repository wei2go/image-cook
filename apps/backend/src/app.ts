import express from 'express';
import cors from 'cors';
import { entitiesRouter } from './routes/entities';
import { imagesRouter } from './routes/images';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/entities', entitiesRouter);
app.use('/images', imagesRouter);
