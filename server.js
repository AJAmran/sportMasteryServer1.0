import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import catchError from './middlewares/catchError.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.129hgrr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

run().catch(console.dir);

// Global error handling middleware
app.use(catchError);

app.use('/auth', authRoutes);
app.use('/classes', classRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Sport Master is running');
});

app.listen(port, () => {
  console.log(`Sport Master is listening on port ${port}`);
});
