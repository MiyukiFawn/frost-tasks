import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskState } from 'src/app/enums/task-states';
import { environment } from 'src/app/environments/environment';
import { NewTask } from 'src/app/interfaces/new-task';
import { Task } from 'src/app/interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  isGuest(): boolean {
    return localStorage.getItem('guest-login') === null ? false : true;
  }

  getTasks(): Observable<Task[]> {
    if (this.isGuest())
      return new Observable<Task[]>((observer) => {
        observer.next(this.getTasksFromMem().reverse());
      });

    return this.http.get<Task[]>(environment.apiUrl + '/tasks');
  }

  createTask(newTask: NewTask): Observable<Task> {
    if (this.isGuest())
      return new Observable<Task>((observer) => {
        const createdTask: Task = {
          id: this.makeid(10),
          title: newTask.title,
          description: newTask.description,
          owner_id: 'guest-id',
          creation_date: new Date(),
          status: TaskState.UNCHECKED,
          prepend: undefined,
        };

        this.addTaskToMem(createdTask);

        observer.next(createdTask);
      });

    return this.http.post<Task>(environment.apiUrl + '/tasks', newTask, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('login-token')}`,
      },
    });
  }

  deleteTask(task: Task): Observable<Task> {
    const data = {
      id: task.id,
      status: 'DELETED',
    };

    if (this.isGuest())
      return new Observable<Task>((Observable) => {
        this.removeTaskFromMem(task);
        Observable.next(task);
      });

    return this.http.put<Task>(environment.apiUrl + '/tasks', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('login-token')}`,
      },
    });
  }

  checkTask(task: Task): Observable<Task> {
    const data = {
      id: task.id,
      status: task.status.toString() === 'CHECKED' ? 'UNCHECKED' : 'CHECKED',
    };

    if (this.isGuest())
      return new Observable<Task>((observer) => {
        const editedTask: Task = {
          id: task.id,
          creation_date: task.creation_date,
          description: task.description,
          owner_id: task.owner_id,
          title: task.title,
          prepend: task.prepend,
          status:
            task.status === TaskState.CHECKED
              ? TaskState.UNCHECKED
              : TaskState.CHECKED,
        };
        this.updateTaskFromMem(editedTask);

        observer.next(editedTask);
      });

    return this.http.put<Task>(environment.apiUrl + '/tasks', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('login-token')}`,
      },
    });
  }

  makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  updateTaskFromMem(task: Task) {
    let taskList = this.getTasksFromMem();
    let i = taskList.findIndex((t) => t.id === task.id);

    taskList[i] = task;

    localStorage.setItem('tasks', JSON.stringify(taskList));
  }

  removeTaskFromMem(task: Task) {
    let tasks: Task[] = this.getTasksFromMem();
    const i = tasks.findIndex((t) => t.id === task.id);

    tasks.splice(i, 1);

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  addTaskToMem(task: Task) {
    let tasks: Task[] = this.getTasksFromMem();

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  getTasksFromMem(): Task[] {
    let tasks: Task[];

    try {
      tasks = JSON.parse(localStorage.getItem('tasks') ?? '[]');
    } catch (err) {
      tasks = [];
    }

    return tasks;
  }
}
