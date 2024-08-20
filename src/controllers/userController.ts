import { Request, Response } from 'express';
import db from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket, QueryError, OkPacket } from 'mysql2';

// User Registration
export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err: QueryError | null, results: RowDataPacket[]) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (results.length > 0)
        return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err: QueryError | null, result: OkPacket) => {
          if (err)
            return res.status(500).json({ message: "Error registering user" });
          res.status(201).json({
            id: result.insertId,
            username
          });
        }
      );
    }
  );
};

// User Login
export const loginUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err: QueryError | null, results: RowDataPacket[]) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (results.length === 0)
        return res.status(400).json({ message: "User not found" });

      const user = results[0] as {
        id: number;
        username: string;
        password: string;
      };

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "defaultSecret",
        { expiresIn: "1h" }
      );
      res.json({
        message: "Login successful",
        token
      });
    }
  );
};
