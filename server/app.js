import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
config();

const app = express();

// built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// third-Party Middleware
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

// server status check route
app.get('/ping', (_req, res) => {
  res.send('Pong');
});

// default catch all route - 404
app.all('*', (_req, res) => {
  res.send('OOps!!! 404 Not Found');
});

export default app;
