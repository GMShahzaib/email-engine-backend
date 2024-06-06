import jwt from 'jsonwebtoken';
import Env from '../env/Env.js';
import AppError from './AppError.js';


export const createAccessToken = (id) =>
  jwt.sign({ id }, Env.JWT_SECRET, {
    expiresIn: Env.JWT_TOKEN_EXPIRATION,
  });

export const createRefreshToken = (id) =>
  jwt.sign({ id }, Env.JWT_REFRESH_SECRET, {
    expiresIn: Env.JWT_REFRESH_TOKEN_EXPIRATION,
  });



export const verifyToken = async (req, res, next) => {
  
  // Check if access token is provided in cookies or headers
  const token = (req.cookies.accessToken || (req.header('Authorization') && req.header('Authorization').split(' ')[1]))
  if (!token) return next(new AppError('No token, authorization denied', 401));

  try {
    const decoded = jwt.verify(
      token,
      Env.JWT_SECRET,
    );

    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError('Token is not valid', 401));
  }
};