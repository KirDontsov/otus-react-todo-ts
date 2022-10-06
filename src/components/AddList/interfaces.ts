import type { ListItem, Maybe } from '../../interfaces';

export interface ColorItem {
  id: number;
  hex: string;
  name: string;
}

export interface AddListProps {
  colors: Maybe<ColorItem[]>;
  onAdd: (item: ListItem) => void;
}
