import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({
      email,
      passwordHash,
      role: role || 'VIEWER',
    }).returning();

    const userRecord = newUser[0];
    if (!userRecord) return res.status(500).json({ message: 'Failed to create user' });

    const token = jwt.sign({ id: userRecord.id, role: userRecord.role }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    res.status(201).json({ user: userRecord, token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const userRecord = user[0];
    if (!userRecord) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: userRecord.id, role: userRecord.role }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    res.json({ user: userRecord, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};
