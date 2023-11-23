import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).send({ error: true, message: 'Unauthorized access' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).send({ error: true, message: 'Unauthorized access' });
  }
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'Unauthorized access' });
    }
    req.decoded = decoded;
    next();
  });
};

export { authenticateToken };
