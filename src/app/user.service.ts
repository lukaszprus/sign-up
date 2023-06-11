import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  add(value: unknown) {
    return this.httpClient.post<unknown>('https://demo-api.now.sh/users', value);
  }
}
