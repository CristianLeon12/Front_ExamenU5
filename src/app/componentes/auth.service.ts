import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/login`, credentials);
  }

  getUserInfo(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/informacions/${userId}`);
  }

  uploadImage(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/informacions`, data);
  }

  updateImage(data: FormData, id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/informacions/${id}`, data);
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/informacions/${id}`);
  }
}
