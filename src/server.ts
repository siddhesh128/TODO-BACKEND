import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import userRoutes from './routes/userRoutes';
import todoRoutes from './routes/todoRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Use the routes
app.use( userRoutes);
app.use( todoRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// Extend the Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}
