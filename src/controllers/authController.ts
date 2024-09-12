import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { generateToken } from "../utils/jwtUtils";

interface UserInterface {
  username: string;
  email: string;
  password: string;
  role: string;
  id?: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: UserInterface | any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
  }
};
