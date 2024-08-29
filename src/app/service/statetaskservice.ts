import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Statetask } from '../model/statetask';

const baseUrl = 'http://localhost:3000/api/v1/state-tasks';

@Injectable({
  providedIn: 'root',
})
export class StatetaskService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Statetask[]> {
    return this.http.get<Statetask[]>(baseUrl);
  }

  get(id: any): Observable<Statetask> {
    return this.http.get<Statetask>(`${baseUrl}/${id}`);
  }

}
