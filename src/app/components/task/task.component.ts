import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskState } from 'src/app/enums/task-states';
import { Task } from 'src/app/interfaces/task';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  @Input({ required: true }) Task!: Task;

  @Output() toggleCheck = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
  faTrash = faTrash;

  onToggleCheck() {
    this.toggleCheck.emit(this.Task);
  }

  onDelete() {
    this.delete.emit(this.Task);
  }
}
