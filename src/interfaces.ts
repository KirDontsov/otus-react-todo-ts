import type { ColorItem } from './components/AddList/interfaces';

export type Maybe<T> = T | null;

export interface TaskItem {
  id: number;
  listId?: number;
  text: string;
  completed?: boolean;
}

export interface ListItem {
  id: number;
  name?: string;
  colorId?: number;
  tasks?: TaskItem[];
  active?: boolean;
  text?: string;
  icon?: JSX.Element;
  className?: string;
  color?: ColorItem;
}
