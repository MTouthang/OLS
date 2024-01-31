import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
config();

const app = express();

// built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// third-Party Middleware
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRoutes);

// server status check route
// TODO: change or add the API version in future
app.get('/ping', (_req, res) => {
  res.send('Pong');
});

// custom Error middleware
app.use(errorMiddleware);

// default catch all route - 404
app.all('*', (_req, res) => {
  res.send('OOps!!! 404 Not Found');
});

export default app;
