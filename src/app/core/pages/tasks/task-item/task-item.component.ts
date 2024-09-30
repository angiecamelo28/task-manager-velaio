import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task: any;
  @Input() users: any[] = [];
  @Output() completeTask = new EventEmitter<void>();
  @Output() viewTask = new EventEmitter<void>();
  @Output() editTask = new EventEmitter<void>();

  markAsCompleted() {
    this.completeTask.emit();
  }
  seeDetails() {
    this.viewTask.emit();
  }

  edit() {
    this.editTask.emit();
  }
}
