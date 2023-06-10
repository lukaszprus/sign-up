import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  saveInProgress = false;
  notification: { type: 'danger' | 'success'; message: string; } | undefined;

  constructor(private httpClient: HttpClient) {}

  onValueChange(value: unknown) {
    if (this.saveInProgress) {
      return;
    }

    this.saveInProgress = true;
    this.notification = undefined;

    this.httpClient.post('https://demo-api.now.sh/users', value)
      .subscribe({
        error: err => {
          this.saveInProgress = false;
          this.notification = {
            type: 'danger',
            message: 'Failed to add user user'
          };

          throw err;
        },
        complete: () => {
          this.saveInProgress = false;

          this.notification = {
            type: 'success',
            message: 'Successfully added user'
          };
        }
      });
  }
}
