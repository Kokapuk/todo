import jwt from 'jsonwebtoken';
import TaskModel from '../models/Task.js';

export default async (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');

  if (token) {
    try {
      const decrypted = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decrypted._id;

      if (!req.params.id) {
        return next();
      }

      const task = await TaskModel.findById(req.params.id);

      if (!task) {
        return next();
      }

      if (task.user != req.userId) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      next();
    } catch (err) {
      console.log(err);

      return res.status(403).json({
        message: 'Forbidden',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }
};
