import type { ListItem, Maybe } from '../../interfaces';

export interface ListProps {
  items: ListItem[];
  isRemovable?: boolean;
  onClick?: () => void;
  onRemove?: (id: number) => void;
  onClickItem?: (list: ListItem) => void;
  activeItem?: Maybe<ListItem>;
}
