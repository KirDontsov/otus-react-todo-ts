import { ListItem, TaskItem } from '../../interfaces';

export interface TasksProps {
  list: ListItem;
  onEditTitle: (id: number, title: string) => void;
  onAddTask: (listId: number, taskObj: TaskItem) => void;
  onRemoveTask: (listId: number, taskId: number) => void;
  onEditTask: (listId: number, taskObj: TaskItem) => void;
  onCompleteTask: (listId: number, taskId: number, completed: boolean) => void;
  withoutEmpty?: boolean;
}

export interface TaskProps {
  id: number;
  text: string;
  completed?: boolean;
  list: ListItem;
  onRemove: (listId: number, id: number) => void;
  onEdit: (listId: number, taskObj: TaskItem) => void;
  onComplete: (listId: number, id: number, checked: boolean) => void;
}

export interface AddTaskFormProps {
  list: ListItem;
  onAddTask: (id: number, data: TaskItem) => void;
}
