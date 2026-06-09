import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './services/socket';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import mediaRoutes from './routes/mediaRoutes';
import downloadRoutes from './routes/downloadRoutes';
import userRoutes from './routes/userRoutes';
import socialRoutes from './routes/socialRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initSocket(httpServer);

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social', socialRoutes);

app.get('/', (req, res) => {
  res.send('Event & Media Management Platform API');
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
