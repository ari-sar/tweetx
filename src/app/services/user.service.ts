import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_END_POINT: string;

  constructor(private httpClient: HttpClient) {
    this.API_END_POINT = 'http://localhost:3000';
  }

  getUsers() {
    return this.httpClient
      .get(`${this.API_END_POINT}/users`)
      .pipe(
        map((res: any) => res),
        catchError((err: any) => {
          return throwError(err.error);
        })
      );
  }

  getUserByEmail(email: string) {
    return this.httpClient
      .get(`${this.API_END_POINT}/users/${email}`)
      .pipe(
        map((res: any) => res),
        catchError((err: any) => {
          return throwError(err.error);
        })
      );
  }

  getUserDetails(ids: any) {
    let params = new HttpParams();
    params = params.append('ids', ids);
    return this.httpClient
      .get(`${this.API_END_POINT}/details`, { params })
      .pipe(
        map((res: any) => res),
        catchError((err: any) => {
          return throwError(err.error);
        })
      );
  }

  cerateUser(body: any) {
    return this.httpClient
      .post(`${this.API_END_POINT}/users`,
        body,
      )
      .pipe(
        map((res: any) => res),
        catchError((err: any) => {
          return throwError(err.error);
        })
      );
  }

  followUser(body: any) {
    return this.httpClient
      .post(`${this.API_END_POINT}/users/follow`,
        body,
      )
      .pipe(
        map((res: any) => res),
        catchError((err: any) => {
          return throwError(err.error);
        })
      );
  }
}
