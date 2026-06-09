import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('Event & Media Management Platform API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
