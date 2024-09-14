import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Joi from "joi";
import User from "../models/userModel";
import { generateToken } from "../utils/jwtUtils";
import { Role } from "../models/userModel";  // Importing the Role enum for validation

interface UserInterface {
  username: string;
  email: string;
  password: string;
  role: Role;
  id?: string;
}

// Joi validation schema for registration
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(Role.Admin, Role.Manager, Role.Staff).required(), // Adjusted roles for validation
});

// Joi validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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
    res.status(500).json({ message: "Server error" });
  }
};
