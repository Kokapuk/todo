import { FormEvent, useState } from 'react';
import style from './TaskForm.module.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ITask } from '../../types';

interface IProps {
  createNewTask(task: ITask): void;
}

const TaskForm = (props: IProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.createNewTask({ _id: Date.now(), text: content, completed: false } as ITask);
    setContent('');
  };

  return (
    <form className={style.form} onSubmit={(e) => handleSubmit(e)}>
      <input
        value={content}
        onInput={(e) => setContent(e.currentTarget.value)}
        placeholder='Add a new task'
        className={style.input}
        type='text'
        required
        minLength={0}
      />
      <TransitionGroup className={style['send-container']}>
        {content.length > 0 && (
          <CSSTransition
            timeout={200}
            classNames={{
              enter: style['send-enter'],
              enterActive: style['send-enter-active'],
              exit: style['send-exit'],
              exitActive: style['send-exit-active'],
            }}>
            <button className={style.send}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='icon-button'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
                />
              </svg>
            </button>
          </CSSTransition>
        )}
      </TransitionGroup>
    </form>
  );
};

export default TaskForm;
