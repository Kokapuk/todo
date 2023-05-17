import { body } from 'express-validator';

export const signInValidation = [
  body('login', 'Login must be at least 3 characters').isLength({ min: 3 }),
  body('password', 'Password must be at least 6 characters length').isLength({ min: 6 }),
];

export const registerValidation = [...signInValidation];

export const taskCreateValidation = [body('text', 'Task text must be at least 1 characters').isLength({ min: 1 })];
