import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import cors from 'cors'; //Use cors connected with Frontend

dotenv.config();
const app = express();

app.use(express.json());

//Protect Http Headers
app.use(helmet())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Error Handling Middleware For handling Errors
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

export default app;
