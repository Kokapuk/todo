import style from './Task.module.css';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ITask } from '../../types';
import { useState } from 'react';

interface IProps {
  task: ITask;
  setChecked(checked: boolean): void;
  deleteTask(): void;
}

const Task = (props: IProps) => {
  return (
    <div className={style.container}>
      <label className={cn([style['check-label'], props.task.completed && style.checked])}>
        <input
          checked={props.task.completed}
          onChange={(e) => props.setChecked(e.target.checked)}
          className='checkbox'
          type='checkbox'
        />
        {props.task.text}
      </label>
      <TransitionGroup>
        {props.task.completed && (
          <CSSTransition
            timeout={200}
            classNames={{
              enter: style['delete-enter'],
              enterActive: style['delete-enter-active'],
              exit: style['delete-exit'],
              exitActive: style['delete-exit-active'],
            }}>
            <button className={cn(style.delete)} onClick={props.deleteTask}>
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
                  d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                />
              </svg>
            </button>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Task;
