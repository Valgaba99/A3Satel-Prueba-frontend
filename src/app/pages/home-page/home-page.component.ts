import { Task } from './../../model/task';

import { TaskService } from './../../service/taskservice';
import { StatetaskService } from './../../service/statetaskservice';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Statetask } from '../../model/statetask';
import { Router } from '@angular/router';
import { error } from 'console';

interface Asignado {
  id?: number;
  nombre?: string;
}
export interface Estado {
  id?: number;
  nombre?: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    EditorModule,
    TableModule,
    ToastModule,
    DropdownModule,
    FormsModule
  ],
  providers: [TaskService, StatetaskService, MessageService],
})
export class HomePageComponent implements OnInit {
  displayDialog: boolean = false;
  submitted: boolean = false;

  usuario: string = 'Víctor Algaba Bueno';

  currentTask = new Task();
  alltasks!: Task[];

  asignados: Asignado[] | undefined;
  estados: Estado[] | undefined;
  statemodel: Statetask[] | undefined;
  selectestado: string | Estado | undefined;
  selectasignado: string | Asignado | undefined;

  constructor(
    private taskService: TaskService,
    private statetaskService: StatetaskService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.retrieveStatetasks();
    this.asignados = [
      { id: 1, nombre: 'Alfredo moreno lopez' },
      { id: 2, nombre: 'Emilio garcia lora' },
      { id: 3, nombre: 'Víctor algaba bueno' },
    ];
    this.retrieveTasks();
  }

  // Obtener todas las tareas de la API y insertar en la tabla
  retrieveTasks(): void {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.alltasks = data;
      },
      error: (e) => console.error(e),
    });
  }

  // Obtener estados de la API y insertar en desplegable
  retrieveStatetasks(): void {
    this.statetaskService.getAll().subscribe({
      next: (data) => {
        this.statemodel = data;
        this.estados = this.statemodel;
      },
      error: (e) => console.error(e),
    });
  }

  // Abrir cuadro de dialogo
  dialogTask() {
    this.currentTask = new Task();
    this.displayDialog = true;
  }

  onSubmit() {
    if (this.currentTask && this.currentTask.id) {
      console.log("si ID");
      this.editTask();
    } else {
      console.log("no ID");
      this.saveaddTask();
    }
  }

  // Insertar registro en base de dato
  saveaddTask(): void {
    if (!this.selectasignado || !this.selectestado) {
      console.error('Asignado a o Estado no están definidos');
      return;
    }
    const nombreEstado =
      typeof this.selectestado === 'string'
        ? this.selectestado
        : this.selectestado?.nombre;
    const nombreAsigando =
      typeof this.selectasignado === 'string'
        ? this.selectasignado
        : this.selectasignado?.nombre;

    this.currentTask = {
      nombre: this.currentTask.nombre,
      asignadoa: nombreAsigando,
      estado: nombreEstado,
      descripcion: this.currentTask.descripcion,
    };

    this.taskService.create(this.currentTask).subscribe({
      next: (res) => {
        console.log(res);
        this.displayDialog = false;
        this.submitted = true;
        this.resetTask();
        this.retrieveTasks();
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  // Eliminar registro en base de dato
  deleteTask(id: number) {
    this.taskService.delete(id).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tarea borrada correctamente',
        });
        this.retrieveTasks();
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  // Editar registro en base de dato
  loadForm(id: number): void {
    this.router.navigate([], {
      queryParams: { id: id },
      queryParamsHandling: 'merge', // mantiene otros parámetros de la URL
      skipLocationChange: false // actualiza la URL
    });
    const selectTask = this.alltasks.find((p) => p.id === id);
    if (selectTask) {
      this.currentTask = {
        id: selectTask.id,
        nombre: selectTask.nombre,
        descripcion: selectTask.descripcion,
      };
      this.selectasignado = selectTask.asignadoa;
      this.selectestado = selectTask.estado;
      this.displayDialog = true;
      console.log(this.currentTask);
    } else {
      console.error('Task not found');
    }
  }
  editTask(): void {
    if (!this.selectasignado || !this.selectestado) {
      console.error('Asignado a o Estado no están definidos');
      return;
    }

    const nombreEstado =
      typeof this.selectestado === 'string'
        ? this.selectestado
        : this.selectestado?.nombre;
    const nombreAsignado =
      typeof this.selectasignado === 'string'
        ? this.selectasignado
        : this.selectasignado?.nombre;

    const updatedTask = {
      //id: this.currentTask.id,
      nombre: this.currentTask.nombre,
      asignadoa: nombreAsignado,
      estado: nombreEstado,
      descripcion: this.currentTask.descripcion,
    };

    console.log(updatedTask);

    this.taskService.update(this.currentTask.id!, updatedTask).subscribe({
      next: (response) => {
        console.log('Task updated successfully', response);
        this.displayDialog = false;
        this.resetTask()
        this.retrieveTasks()
      },
      error: (error) => {
        console.error('Error updating task', error);
      }
    });
  }

  // Limpiar campos de formulario
  resetTask(): void {
    this.selectasignado = '';
    this.selectestado = '';
    this.currentTask.nombre = '';
    this.currentTask.descripcion = '';
  }
}
