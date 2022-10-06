import { FC, memo } from 'react';
import classNames from 'classnames';

import './Badge.scss';
import type { BadgeProps } from './interfaces';

export const Badge: FC<BadgeProps> = memo(({ color, onClick, className }) => (
  <div
    role="presentation"
    onClick={onClick}
    className={classNames('badge', { [`badge--${color}`]: color }, className)}
  />
));
