import { FC, useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';

import { List } from '../List';
import { Badge } from '../Badge';
import closeSvg from '../../assets/img/close.svg';

import type { AddListProps } from './interfaces';
import './AddList.scss';

const DEFAULT_ITEMS = [
  {
    id: 999,
    className: 'list__add-button',
    icon: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1V15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 8H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    name: 'Добавить список',
  },
];

export const AddList: FC<AddListProps> = memo(({ colors, onAdd }) => {
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [seletedColor, selectColor] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (Array.isArray(colors)) {
      selectColor(colors[0]?.id);
    }
  }, [colors]);

  const onClose = useCallback(() => {
    setVisiblePopup(false);
    setInputValue('');
    selectColor(colors?.[0].id ?? 0);
  }, [colors]);

  const addList = useCallback(() => {
    if (!inputValue) {
      throw new Error('Введите название списка');
    }
    setIsLoading(true);
    axios
      .post('http://localhost:3001/lists', {
        name: inputValue,
        colorId: seletedColor,
      })
      .then(({ data }) => {
        const color = colors?.filter((c) => c.id === seletedColor)[0];
        const listObj = { ...data, color, tasks: [] };
        onAdd(listObj);
        onClose();
      })
      .catch((e) => {
        throw new Error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [colors, inputValue, onAdd, onClose, seletedColor]);

  const handleOpenPopup = useCallback(() => setVisiblePopup(true), []);

  return (
    <div className="add-list">
      <List onClick={handleOpenPopup} items={DEFAULT_ITEMS} />
      {visiblePopup && (
        <div className="add-list__popup">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
          <img onClick={onClose} src={closeSvg} alt="Close button" className="add-list__popup-close-btn" />

          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="field"
            type="text"
            placeholder="Название списка"
          />

          <div className="add-list__popup-colors">
            {colors?.map((color) => (
              <Badge
                onClick={() => selectColor(color.id)}
                key={color.id}
                color={color.name}
                className={seletedColor === color.id ? 'active' : ''}
              />
            ))}
          </div>
          <button type="submit" onClick={addList} className="button">
            {isLoading ? 'Добавление...' : 'Добавить'}
          </button>
        </div>
      )}
    </div>
  );
});
