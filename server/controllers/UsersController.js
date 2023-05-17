import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  try {
    const relevantUser = await UserModel.findOne({ login: req.body.login });

    if (relevantUser) {
      return res.status(409).json({
        message: 'Login already in use',
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      login: req.body.login,
      passwordHash: hash,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    res.json({ ...user._doc, token });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Failed to register',
    });
  }
};

const signIn = async (req, res) => {
  try {
    const user = await UserModel.findOne({ login: req.body.login }).select('passwordHash').exec();

    if (!user) {
      return res.status(401).json({
        message: 'Wrong login or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Wrong login or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Failed to sign in',
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User with this id does not exist' });
    }

    return res.json(user);
  } catch (error) {
    console.log(err);

    res.status(500).json({
      message: 'Failed to get data about you',
    });
  }
};

export default { register, signIn, getMe };
