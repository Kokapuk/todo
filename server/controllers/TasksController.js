import TaskModel from '../models/Task.js';

const create = async (req, res) => {
  try {
    const doc = new TaskModel({
      text: req.body.text,
      user: req.userId,
    });

    const task = await await doc.save();

    res.json(task);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Failed to create a task',
    });
  }
};

const getAll = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.userId }).sort({ pinned: -1, createdAt: -1 }).exec();

    res.json(tasks);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Failed to get your tasks',
    });
  }
};

const getOne = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task was not found' });
    }

    res.json(task);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Failed to get post',
    });
  }
};

const update = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        text: req.body.text,
        completed: req.body.completed,
        pinned: req.body.pinned,
      },
      { returnDocument: 'after' }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task was not found' });
    }

    res.json(task);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Failed to update task',
    });
  }
};

const remove = async (req, res) => {
  const postId = req.params.id;

  try {
    const task = await TaskModel.findByIdAndDelete(postId);

    if (!task) {
      return res.status(404).json({
        message: 'Task was not found',
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: 'Failed to remove task',
    });
  }
};

export default { create, getAll, getOne, update, remove };
