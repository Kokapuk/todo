import { useEffect, useState } from 'react';
import Task from '../../components/Task/Task';
import TaskForm from '../../components/TaskForm/TaskForm';
import { ITask, IUser } from '../../types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './Home.module.css';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import axios from '../../utils/axios';

const Home = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [token, setToken] = useAuth();
  const [me, setMe] = useState<IUser | null>(null);

  const loadTasks = async (): Promise<ITask[]> => {
    try {
      const tasks: ITask[] = (await axios.get('/tasks', { headers: { Authorization: `Bearer ${token}` } })).data;

      return tasks;
    } catch (error) {
      console.log(error);
      setToken(null);
      return [];
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchData = async () => {
      setTasks(await loadTasks());

      try {
        const user: IUser = (await axios.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })).data;
        setMe(user);
      } catch (error) {
        console.log(error);
        return setToken(null);
      }
    };

    fetchData();
  }, [token]);

  const createNewTask = async (task: ITask) => {
    let doc: ITask | null = null;

    try {
      doc = (await axios.post('/tasks', { text: task.text }, { headers: { Authorization: `Bearer ${token}` } })).data;
    } catch (error) {
      console.log(error);
      return setToken(null);
    }

    setTasks((prev) => [{ _id: doc!._id, text: doc!.text, completed: false }, ...prev]);
  };

  const setTaskChecked = async (id: string, completed: boolean) => {
    let doc: ITask | null = null;

    try {
      doc = (await axios.patch(`/tasks/${id}`, { completed: completed }, { headers: { Authorization: `Bearer ${token}` } })).data;
    } catch (error) {
      console.log(error);
      return setToken(null);
    }

    setTasks((prev) => {
      return prev.map((task) => {
        if (task._id == id) {
          task = { ...task, completed: doc!.completed };
        }

        return task;
      });
    });
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.log(error);
      return setToken(null);
    }

    setTasks((prev) => {
      return prev.filter((item) => {
        return item._id != id;
      });
    });
  };

  return (
    <>
      {me && (
        <button onClick={() => setToken(null)} className={styles.logout}>
          {me.login} - Logout
        </button>
      )}
      <div className={classNames('card-container', styles['card-container'])}>
        <h1>Tasks</h1>
        <TaskForm createNewTask={createNewTask} />
        <TransitionGroup className={styles['task-list']}>
          {tasks.map((task) => {
            return (
              <CSSTransition
                key={task._id}
                timeout={200}
                classNames={{
                  enter: styles['task-enter'],
                  enterActive: styles['task-enter-active'],
                  exit: styles['task-exit'],
                  exitActive: styles['task-exit-active'],
                }}>
                <Task
                  task={task}
                  setChecked={(checked) => setTaskChecked(task._id, checked)}
                  deleteTask={() => deleteTask(task._id)}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    </>
  );
};

export default Home;
