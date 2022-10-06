/* eslint-disable no-alert */
import { FC, memo, useCallback } from 'react';
import classNames from 'classnames';
import axios from 'axios';

import removeSvg from '../../assets/img/remove.svg';
import { Badge } from '../Badge';
import type { ListItem } from '../../interfaces';

import type { ListProps } from './interfaces';
import './List.scss';

export const List: FC<ListProps> = memo(({ items, isRemovable, onClick, onRemove, onClickItem, activeItem }) => {
  const removeList = useCallback(
    (item: ListItem) => {
      if (window.confirm('Вы действительно хотите удалить список?')) {
        axios.delete(`http://localhost:3001/lists/${item.id}`).then(() => {
          onRemove?.(item.id);
        });
      }
    },
    [onRemove],
  );

  return (
    <ul role="presentation" onClick={onClick} className="list">
      {items.map((item, index) => (
        <li
          role="presentation"
          /* eslint-disable-next-line react/no-array-index-key */
          key={`${item?.colorId}-${index}`}
          className={classNames(item?.className, {
            active: item.active ? item.active : activeItem && activeItem.id === item.id,
          })}
          onClick={() => onClickItem?.(item)}
        >
          <i>{item.icon ? item.icon : <Badge color={item?.color?.name ?? ''} />}</i>
          <span>
            {item.name}
            {item.tasks && ` (${item.tasks.length})`}
          </span>
          {isRemovable && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
            <img className="list__remove-icon" src={removeSvg} alt="Remove icon" onClick={() => removeList(item)} />
          )}
        </li>
      ))}
    </ul>
  );
});
