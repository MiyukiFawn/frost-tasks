import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faPlus,
  faCheck,
  faList,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { NgxMasonryComponent } from 'ngx-masonry';
import { NewTask } from 'src/app/interfaces/new-task';
import { Task } from 'src/app/interfaces/task';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;

  addTaskForm = new FormGroup(
    {
      title: new FormControl<string>(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      description: new FormControl(''),
    },
    {
      updateOn: 'submit',
    }
  );

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401)
          this.authService.refreshToken().subscribe({
            error: () => this.authService.logout(),
            next: (data) => {
              this.authService.updateAccessToken(
                data.access_token,
                data.refresh_token
              );
              this.getTasks();
            },
          });
      },
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
    });
  }

  faPlus = faPlus;
  faCheck = faCheck;
  faList = faList;
  faTrash = faTrash;

  tasks: Task[] = [];
  isLoading: boolean = true;

  canSubmit: boolean = true;
  onSubmitNewTask() {
    this.addTaskForm.markAllAsTouched();

    if (!this.addTaskForm.valid) return;

    this.canSubmit = false;
    const newTask: NewTask = {
      title: this.addTaskForm.value.title!,
      description: this.addTaskForm.value.description ?? '',
    };

    this.taskService.createTask(newTask).subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401)
          this.authService.refreshToken().subscribe({
            error: () => this.authService.logout(),
            next: (data) => {
              this.authService.updateAccessToken(
                data.access_token,
                data.refresh_token
              );
              this.onSubmitNewTask();
            },
          });
        else {
          console.log(err.error);
          this.canSubmit = true;
        }
      },
      next: (data) => {
        data.prepend = true;
        this.tasks.unshift(data);

        this.closeModalButton.nativeElement.click();

        this.canSubmit = true;
      },
    });
  }

  onCancelNewTask() {
    this.addTaskForm.reset();
  }

  onToggleCheck(task: Task) {
    this.taskService.checkTask(task).subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401)
          this.authService.refreshToken().subscribe({
            error: () => this.authService.logout(),
            next: (data) => {
              this.authService.updateAccessToken(
                data.access_token,
                data.refresh_token
              );
              this.onToggleCheck(task);
            },
          });
      },
      next: (data) => {
        this.tasks.find((t) => t.id === data.id)!.status = data.status;
      },
    });
  }

  onDelete(task: Task) {
    this.taskService.deleteTask(task).subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401)
          this.authService.refreshToken().subscribe({
            error: () => this.authService.logout(),
            next: (data) => {
              this.authService.updateAccessToken(
                data.access_token,
                data.refresh_token
              );
              this.onDelete(task);
            },
          });
      },
      next: (data) => {
        const index = this.tasks.indexOf(task);

        this.tasks.splice(index, 1);
      },
    });
  }
}
