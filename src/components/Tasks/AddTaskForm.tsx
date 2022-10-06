import { ChangeEvent, FC, memo, useCallback, useState } from 'react';
import axios from 'axios';

import addSvg from '../../assets/img/add.svg';

import type { AddTaskFormProps } from './interfaces';

export const AddTaskForm: FC<AddTaskFormProps> = memo(({ list, onAddTask }) => {
  const [visibleForm, setFormVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleFormVisible = useCallback(() => {
    setFormVisible(!visibleForm);
    setInputValue('');
  }, [visibleForm]);

  const addTask = useCallback(() => {
    setIsLoading(true);
    axios
      .post('http://localhost:3001/tasks', {
        listId: list.id,
        text: inputValue,
        completed: false,
      })
      .then(({ data }) => {
        onAddTask(list.id, data);
        toggleFormVisible();
      })
      .catch((e) => {
        throw new Error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inputValue, list, onAddTask, toggleFormVisible]);

  const handleChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => setInputValue(target.value), []);

  return (
    <div className="tasks__form">
      {!visibleForm ? (
        <div role="presentation" onClick={toggleFormVisible} className="tasks__form-new">
          <img src={addSvg} alt="Add icon" />
          <span>Новая задача</span>
        </div>
      ) : (
        <div className="tasks__form-block">
          <input value={inputValue} className="field" type="text" placeholder="Текст задачи" onChange={handleChange} />
          <button type="submit" disabled={isLoading} onClick={addTask} className="button">
            {isLoading ? 'Добавление...' : 'Добавить задачу'}
          </button>
          <button type="submit" onClick={toggleFormVisible} className="button button--grey">
            Отмена
          </button>
        </div>
      )}
    </div>
  );
});
