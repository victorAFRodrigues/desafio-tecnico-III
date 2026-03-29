import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateExameDto, Exame } from '../models/exame';
import { PaginatedResponse } from '../models/pagination';

@Injectable({ providedIn: 'root' })
export class ExameService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/Examees';

  getAll(page = 1, pageSize = 10): Observable<PaginatedResponse<Exame>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Exame>>(this.apiUrl, { params });
  }

  create(dto: CreateExameDto): Observable<{ statusCode: number; data: Exame }> {
    return this.http.post<{ statusCode: number; data: Exame }>(this.apiUrl, dto);
  }
}
