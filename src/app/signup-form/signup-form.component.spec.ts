import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { SignupFormComponent } from './signup-form.component';

const setValue = (debugElement: DebugElement, value: string) => {
  const nativeElement = debugElement.nativeElement;

  nativeElement.value = value;
  nativeElement.dispatchEvent(new Event('input'));
  nativeElement.dispatchEvent(new Event('blur'));
};

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;
  let firstName: DebugElement,
    lastName: DebugElement,
    email: DebugElement,
    password: DebugElement,
    firstNameInput: DebugElement,
    lastNameInput: DebugElement,
    emailInput: DebugElement,
    passwordInput: DebugElement,
    submitButton: DebugElement;

  const errors = (debugElement: DebugElement) => debugElement.queryAll(By.css('.invalid-feedback'));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignupFormComponent]
    });

    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const testElement = (name: string) => fixture.debugElement.query(By.css(`[data-test-${name}]`));
    const input = (debugElement: DebugElement) => debugElement.query(By.css('input'));

    firstName = testElement('firstName');
    lastName = testElement('lastName');
    email = testElement('email');
    password = testElement('password');

    firstNameInput = input(firstName);
    lastNameInput = input(lastName);
    emailInput = input(email);
    passwordInput = input(password);

    submitButton = fixture.debugElement.query(By.css(`[type="submit"]`));
  });

  describe('when not filled out', () => {
    describe('shows field validation errors and erroneous state', () => {
      it('when field interacted with', () => {
        expect(errors(firstName).length).toBe(0);
        expect(errors(lastName).length).toBe(0);
        expect(errors(email).length).toBe(0);
        expect(errors(passwordInput).length).toBe(0);

        expect('is-valid' in firstNameInput.classes).toBe(false);
        expect('is-invalid' in firstNameInput.classes).toBe(false);

        expect('is-valid' in lastNameInput.classes).toBe(false);
        expect('is-invalid' in lastNameInput.classes).toBe(false);

        expect('is-valid' in emailInput.classes).toBe(false);
        expect('is-invalid' in emailInput.classes).toBe(false);

        expect('is-valid' in passwordInput.classes).toBe(false);
        expect('is-invalid' in passwordInput.classes).toBe(false);

        expect(fixture.debugElement.query(By.css(`[data-test-notification]`))).toBeNull();

        passwordInput.nativeElement.dispatchEvent(new Event('blur'));
        emailInput.nativeElement.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(errors(firstName).length).toBe(0);
        expect(errors(lastName).length).toBe(0);
        expect(errors(email).length).toBeGreaterThan(0);
        expect(errors(password).length).toBeGreaterThan(0);

        expect('is-valid' in firstNameInput.classes).toBe(false);
        expect('is-invalid' in firstNameInput.classes).toBe(false);

        expect('is-valid' in lastNameInput.classes).toBe(false);
        expect('is-invalid' in lastNameInput.classes).toBe(false);

        expect('is-valid' in emailInput.classes).toBe(false);
        expect('is-invalid' in emailInput.classes).toBe(true);

        expect('is-valid' in passwordInput.classes).toBe(false);
        expect('is-invalid' in passwordInput.classes).toBe(true);

        expect(fixture.debugElement.query(By.css(`[data-test-notification]`))).toBeNull();
      });

      it('when submitted', () => {
        submitButton.nativeElement.click();

        fixture.detectChanges();

        expect(errors(firstName).length).toBeGreaterThan(0);
        expect(errors(lastName).length).toBeGreaterThan(0);
        expect(errors(email).length).toBeGreaterThan(0);
        expect(errors(password).length).toBeGreaterThan(0);

        expect('is-valid' in firstNameInput.classes).toBe(false);
        expect('is-invalid' in firstNameInput.classes).toBe(true);

        expect('is-valid' in lastNameInput.classes).toBe(false);
        expect('is-invalid' in lastNameInput.classes).toBe(true);

        expect('is-valid' in emailInput.classes).toBe(false);
        expect('is-invalid' in emailInput.classes).toBe(true);

        expect('is-valid' in passwordInput.classes).toBe(false);
        expect('is-invalid' in passwordInput.classes).toBe(true);

        expect(fixture.debugElement.query(By.css(`[data-test-notification]`))).toBeNull();
      });
    });

    it('does not emit when submitted', () => {
      const spy = spyOn(component.valueChange, 'emit').and.callThrough();

      submitButton.nativeElement.click();

      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('when filled out correctly', () => {
    beforeEach(() => {
      setValue(firstNameInput, 'Lukasz');
      setValue(lastNameInput, 'Prus');
      setValue(emailInput, 'lukasz.prus@example.com');
      setValue(passwordInput, 'paSSword');

      fixture.detectChanges();
    });

    it('shows no field validation errors nor erroneous state', () => {
      expect(errors(firstName).length).toBe(0);
      expect(errors(lastName).length).toBe(0);
      expect(errors(email).length).toBe(0);
      expect(errors(passwordInput).length).toBe(0);

      expect('is-valid' in firstNameInput.classes).toBe(true);
      expect('is-invalid' in firstNameInput.classes).toBe(false);

      expect('is-valid' in lastNameInput.classes).toBe(true);
      expect('is-invalid' in lastNameInput.classes).toBe(false);

      expect('is-valid' in emailInput.classes).toBe(true);
      expect('is-invalid' in emailInput.classes).toBe(false);

      expect('is-valid' in passwordInput.classes).toBe(true);
      expect('is-invalid' in passwordInput.classes).toBe(false);

      expect(fixture.debugElement.query(By.css(`[data-test-notification]`))).toBeNull();
    });

    it('emits value when submitted', () => {
      const spy = spyOn(component.valueChange, 'emit').and.callThrough();

      submitButton.nativeElement.click();

      fixture.detectChanges();

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.first().args).toEqual([{
        firstName: 'Lukasz',
        lastName: 'Prus',
        email: 'lukasz.prus@example.com',
        password: 'paSSword'
      }]);
    });

    describe('and disabled', () => {
      beforeEach(() => {
        component.disabled = true;

        fixture.detectChanges();
      });

      it('does not emit when submitted', () => {
        const spy = spyOn(component.valueChange, 'emit').and.callThrough();

        submitButton.nativeElement.click();

        fixture.detectChanges();

        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('when filled out incorrectly', () => {
    beforeEach(() => {
      setValue(firstNameInput, 'Lukasz');
      setValue(emailInput, 'lukasz.prusexample.com');
      setValue(passwordInput, 'passlukaszword');

      fixture.detectChanges();
    });

    it('shows correct field validation errors and erroneous state', () => {
      expect(errors(firstName).length).toBe(0);
      expect(errors(lastName).length).toBe(0);
      expect(errors(email).length).toBe(1);
      expect(errors(password).length).toBe(1);

      expect(email.nativeElement.textContent).toContain('Invalid email');
      expect(password.nativeElement.textContent).toContain('Uppercase and lowercase letter required');

      expect('is-valid' in firstNameInput.classes).toBe(true);
      expect('is-invalid' in firstNameInput.classes).toBe(false);

      expect('is-valid' in lastNameInput.classes).toBe(false);
      expect('is-invalid' in lastNameInput.classes).toBe(false);

      expect('is-valid' in emailInput.classes).toBe(false);
      expect('is-invalid' in emailInput.classes).toBe(true);

      expect('is-valid' in passwordInput.classes).toBe(false);
      expect('is-invalid' in passwordInput.classes).toBe(true);

      expect('is-invalid' in passwordInput.classes).toBe(true);

      const notifocation = fixture.debugElement.query(By.css(`[data-test-notification]`));

      expect(notifocation.nativeElement.textContent).toContain('Password cannot contain first name or last name');
    });

    it('does not emit when submitted', () => {
      const spy = spyOn(component.valueChange, 'emit').and.callThrough();

      submitButton.nativeElement.click();

      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
