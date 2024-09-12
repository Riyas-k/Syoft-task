import jwt from 'jsonwebtoken';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export { generateToken };
