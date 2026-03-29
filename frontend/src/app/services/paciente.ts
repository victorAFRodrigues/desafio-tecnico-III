import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePacienteDto, Paciente } from '../models/paciente';
import { PaginatedResponse } from '../models/pagination';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/pacientes';

  getAll(page = 1, pageSize = 10): Observable<PaginatedResponse<Paciente>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Paciente>>(this.apiUrl, { params });
  }

  create(dto: CreatePacienteDto): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, dto);
  }
}
