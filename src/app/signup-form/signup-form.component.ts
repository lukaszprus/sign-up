import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const contains = (c1: string, c2: string): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const control1: AbstractControl<string> = control.get(c1)!;
    const control2: AbstractControl<string> = control.get(c2)!;

    return control1.value && control2.value && control1.value.toLowerCase().includes(control2.value.toLowerCase()) ? { contains: true } : null;
  };

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html'
})
export class SignupFormComponent {
  @Input() disabled?: boolean | undefined;
  @Output() valueChange = new EventEmitter<User>();

  firstName = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30)
  ]);
  lastName = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30)
  ]);
  email = new FormControl<string>('', [
    Validators.required,
    Validators.email
  ]);
  password = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/[a-z]/),
    Validators.pattern(/[A-Z]/)
  ]);

  signupForm = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password
  }, [contains('password', 'firstName'), contains('password', 'lastName')]);

  onSubmit() {
    this.valueChange.emit(this.signupForm.value as User);
  }
}
