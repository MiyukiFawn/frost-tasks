import { TaskState } from 'src/app/enums/task-states';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskState;
  creation_date: Date;
  owner_id: string;
  prepend: boolean | undefined;
}
