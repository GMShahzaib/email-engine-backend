import jwt from 'jsonwebtoken';
import Env from '../env/Env.js';


export const createAccessToken = (id) =>
  jwt.sign({ id }, Env.JWT_SECRET, {
    expiresIn: Env.JWT_TOKEN_EXPIRATION,
  });

export const createRefreshToken = (id) =>
  jwt.sign({ id }, Env.JWT_REFRESH_SECRET, {
    expiresIn: Env.JWT_REFRESH_TOKEN_EXPIRATION,
  });