import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET;

export const createJWT = (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, secretKey, { expiresIn: '6h' });
  res.send({ token });
};
