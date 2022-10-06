/* eslint-disable no-alert */
import { FC, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import editSvg from '../../assets/img/edit.svg';

import { AddTaskForm } from './AddTaskForm';
import { Task } from './Task';
import type { TasksProps } from './interfaces';

import './Tasks.scss';

export const Tasks: FC<TasksProps> = memo(
  ({ list, onEditTitle, onAddTask, onRemoveTask, onEditTask, onCompleteTask, withoutEmpty }) => {
    const editTitle = useCallback(() => {
      const newTitle = window.prompt('Название списка', list.name);
      if (newTitle) {
        onEditTitle(list.id, newTitle);
        axios
          .patch(`http://localhost:3001/lists/${list.id}`, {
            name: newTitle,
          })
          .catch((e) => {
            throw new Error(e);
          });
      }
    }, [list, onEditTitle]);

    return (
      <div className="tasks">
        <Link to={`/lists/${list.id}`}>
          <h2 style={{ color: list?.color?.hex }} className="tasks__title">
            {list.name}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
            <img onClick={editTitle} src={editSvg} alt="Edit icon" />
          </h2>
        </Link>

        <div className="tasks__items">
          {!withoutEmpty && list.tasks && !list.tasks.length && <h2>Задачи отсутствуют</h2>}
          {list.tasks &&
            list.tasks.map((task) => (
              <Task
                key={task.id}
                list={list}
                onEdit={onEditTask}
                onRemove={onRemoveTask}
                onComplete={onCompleteTask}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...task}
              />
            ))}
          <AddTaskForm key={list.id} list={list} onAddTask={onAddTask} />
        </div>
      </div>
    );
  },
);
