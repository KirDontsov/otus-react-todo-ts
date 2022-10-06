/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { produce } from 'immer';

import { List, AddList, Tasks } from './components';
import type { ListItem, Maybe, TaskItem } from './interfaces';

export const App: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lists, setLists] = useState<Maybe<ListItem[]>>(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState<Maybe<ListItem>>(null);

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data }) => {
      setLists(data);
    });
    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data);
    });
  }, []);

  const onAddList = useCallback((item: ListItem) => {
    setLists(
      produce((draft) => {
        draft?.push(item);
      }),
    );
  }, []);

  const onAddTask = useCallback((listId: number, taskObj: TaskItem) => {
    setLists(
      produce((draft) => {
        draft?.forEach((item: ListItem) => {
          if (item.id === listId) {
            item.tasks = [...(item?.tasks ?? []), taskObj];
          }
        });
      }),
    );
  }, []);

  const onEditTask = useCallback((listId: number, taskObj: TaskItem) => {
    const newTaskText = window.prompt('Текст задачи', taskObj?.text);

    if (!newTaskText) {
      return;
    }

    setLists(
      produce((draft) => {
        draft?.forEach((item) => {
          if (item.id === listId) {
            item.tasks = item?.tasks?.map((task) => {
              if (task.id === taskObj.id) {
                task.text = newTaskText;
              }
              return task;
            });
          }
        });
      }),
    );

    axios
      .patch(`http://localhost:3001/tasks/${taskObj.id}`, {
        text: newTaskText,
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

  const onRemoveTask = useCallback((listId: number, taskId: number) => {
    if (window.confirm('Вы действительно хотите удалить задачу?')) {
      setLists(
        produce((draft) => {
          draft?.forEach((item) => {
            if (item.id === listId) {
              item.tasks = item?.tasks?.filter((task) => task.id !== taskId);
            }
            return item;
          });
        }),
      );
      axios.delete(`http://localhost:3001/tasks/${taskId}`).catch((e) => {
        throw new Error(e);
      });
    }
  }, []);

  const onCompleteTask = useCallback((listId: number, taskId: number, completed: boolean) => {
    setLists(
      produce((draft) => {
        draft?.forEach((item) => {
          if (item.id === listId) {
            item.tasks = item?.tasks?.map((task) => {
              if (task.id === taskId) {
                task.completed = completed;
              }
              return task;
            });
          }
          return item;
        });
      }),
    );

    axios
      .patch(`http://localhost:3001/tasks/${taskId}`, {
        completed,
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

  const onEditListTitle = useCallback((id: number, title: string) => {
    setLists(
      produce((draft) => {
        draft?.forEach((item) => {
          if (item.id === id) {
            item.name = title;
          }
          return item;
        });
      }),
    );
  }, []);

  const handleRemove = useCallback((id: number) => {
    setLists(
      produce((draft) => {
        const index = draft?.findIndex((item) => item.id === id);
        if (index !== -1) draft?.splice(index as number, 1);
      }),
    );
  }, []);

  useEffect(() => {
    const listId = location.pathname.split('lists/')[1];
    if (lists) {
      const list = lists.find(({ id }) => id === Number(listId));
      setActiveItem(list ?? null);
    }
  }, [lists, location.pathname]);

  const handleClickAllItems = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleClickItem = useCallback(
    (list: ListItem) => {
      navigate(`/lists/${list.id}`);
    },
    [navigate],
  );

  const defaultItems = useMemo(
    () => [
      {
        id: 1999,
        active: location.pathname === '/',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.96 8.10001H7.74001C7.24321 8.10001 7.20001 8.50231 7.20001 9.00001C7.20001 9.49771 7.24321 9.90001 7.74001 9.90001H12.96C13.4568 9.90001 13.5 9.49771 13.5 9.00001C13.5 8.50231 13.4568 8.10001 12.96 8.10001V8.10001ZM14.76 12.6H7.74001C7.24321 12.6 7.20001 13.0023 7.20001 13.5C7.20001 13.9977 7.24321 14.4 7.74001 14.4H14.76C15.2568 14.4 15.3 13.9977 15.3 13.5C15.3 13.0023 15.2568 12.6 14.76 12.6ZM7.74001 5.40001H14.76C15.2568 5.40001 15.3 4.99771 15.3 4.50001C15.3 4.00231 15.2568 3.60001 14.76 3.60001H7.74001C7.24321 3.60001 7.20001 4.00231 7.20001 4.50001C7.20001 4.99771 7.24321 5.40001 7.74001 5.40001ZM4.86001 8.10001H3.24001C2.74321 8.10001 2.70001 8.50231 2.70001 9.00001C2.70001 9.49771 2.74321 9.90001 3.24001 9.90001H4.86001C5.35681 9.90001 5.40001 9.49771 5.40001 9.00001C5.40001 8.50231 5.35681 8.10001 4.86001 8.10001ZM4.86001 12.6H3.24001C2.74321 12.6 2.70001 13.0023 2.70001 13.5C2.70001 13.9977 2.74321 14.4 3.24001 14.4H4.86001C5.35681 14.4 5.40001 13.9977 5.40001 13.5C5.40001 13.0023 5.35681 12.6 4.86001 12.6ZM4.86001 3.60001H3.24001C2.74321 3.60001 2.70001 4.00231 2.70001 4.50001C2.70001 4.99771 2.74321 5.40001 3.24001 5.40001H4.86001C5.35681 5.40001 5.40001 4.99771 5.40001 4.50001C5.40001 4.00231 5.35681 3.60001 4.86001 3.60001Z"
              fill="black"
            />
          </svg>
        ),
        name: 'Все задачи',
      },
    ],
    [location],
  );

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List onClickItem={handleClickAllItems} items={defaultItems} />
        {lists?.length ? (
          <List
            items={lists}
            onRemove={handleRemove}
            onClickItem={handleClickItem}
            activeItem={activeItem}
            isRemovable
          />
        ) : (
          'Загрузка...'
        )}
        <AddList onAdd={onAddList} colors={colors} />
      </div>
      <div className="todo__tasks">
        <Routes>
          <Route
            path="/"
            element={
              lists &&
              lists?.map((list) => (
                <Tasks
                  key={list.id}
                  list={list}
                  onAddTask={onAddTask}
                  onEditTitle={onEditListTitle}
                  onRemoveTask={onRemoveTask}
                  onEditTask={onEditTask}
                  onCompleteTask={onCompleteTask}
                  withoutEmpty
                />
              ))
            }
          />
          <Route
            path="/lists/:id"
            element={
              lists &&
              activeItem && (
                <Tasks
                  list={activeItem}
                  onAddTask={onAddTask}
                  onEditTitle={onEditListTitle}
                  onRemoveTask={onRemoveTask}
                  onEditTask={onEditTask}
                  onCompleteTask={onCompleteTask}
                />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};
