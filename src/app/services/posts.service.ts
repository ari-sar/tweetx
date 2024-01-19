import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  API_END_POINT: string;

  constructor(private httpClient: HttpClient) {
    this.API_END_POINT = 'http://localhost:3000';
  }

  getPosts(data: any) {
    let params = new HttpParams();
    if (data.following)
      params = params.append('following', data.following);
    params = params.append('userId', data.userId);
    return this.httpClient
      .get(`${this.API_END_POINT}/posts`, { params })
      .pipe(
        map((res: any) => res),
        catchError((err: any) => {
          return throwError(err.error);
        })
      );
  }

  ceratePost(body: any) {
    return this.httpClient
      .post(`${this.API_END_POINT}/posts`,
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
