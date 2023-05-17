import express from 'express';
import mongoose from 'mongoose';
import { signInValidation, taskCreateValidation, registerValidation } from './validations.js';
import dotenv from 'dotenv';
import checkAuth from './utils/checkAuth.js';
import UsersController from './controllers/UsersController.js';
import TasksController from './controllers/TasksController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import cors from 'cors';

dotenv.config();

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('DB OK');
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();

app.use(express.json());
app.use(cors());

app.post('/auth/register', registerValidation, handleValidationErrors, UsersController.register);
app.post('/auth/sign-in', signInValidation, handleValidationErrors, UsersController.signIn);
app.get('/auth/me', checkAuth, UsersController.getMe);

app.get('/tasks', checkAuth, TasksController.getAll);
app.get('/tasks/:id', checkAuth, TasksController.getOne);
app.post('/tasks', checkAuth, taskCreateValidation, handleValidationErrors, TasksController.create);
app.patch('/tasks/:id', checkAuth, TasksController.update);
app.delete('/tasks/:id', checkAuth, TasksController.remove);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Server OK');
});
