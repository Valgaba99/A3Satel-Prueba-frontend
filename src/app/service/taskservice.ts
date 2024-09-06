import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../model/task';

const baseUrl = 'http://localhost:3000/api/v1/tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(baseUrl);
  }

  get(id: number): Observable<Task> {
    return this.http.get<Task>(`${baseUrl}/${id}`);
  }

  create(data: Task): Observable<Task> {
    return this.http.post(baseUrl, data);
  }

  update(id: number, data: Task): Observable<any> {
    return this.http.patch(`${baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findById(id: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${baseUrl}?id=${id}`);
  }
}
