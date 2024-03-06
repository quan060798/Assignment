import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';


const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';
const createToken = (user: { id: number; username: string }): string => {
    return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        username,
        password: hashedPassword,
      });
  
      const token = createToken(newUser.toJSON() as { id: number; username: string });
  
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
      res.status(201).json({ user: newUser });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        res.status(404).json({ error: 'User Not Found' });
        return;
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid Password' });
        return;
      }
  
      const token = createToken(user.toJSON() as { id: number; username: string });
  
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
      res.status(200).json({ user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: error.message });
        }
    }
  };
  
  export const logout = (_: Request, res: Response): void => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out successfully' });
  };