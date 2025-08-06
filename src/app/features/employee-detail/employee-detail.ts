import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.scss'
})
export class EmployeeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  isEditMode = false;
  employee?: Employee;
  displaySalary: string = '';
  displaySalaryWithPrefix: string = '';
  _birthDate = '';

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');

    if (!username || username.toLowerCase() === 'new') {
      this.employee = new Employee();
      return;
    }

    const emp = this.employeeService.getByUsername(username);
    if (!emp) {
      this.toastService.show('⚠️ Employee not found.');
      this.router.navigate(['/employees']);
      return;
    }

    this.employee = new Employee(emp);
    this.isEditMode = true;
    this.formatSalary();
    this.formatBirthDate();
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  save(): void {
    console.log('save nih');
    if (!this.employee) return;
    const username = this.employee.username?.trim().toLowerCase();
    if (!username) {
      this.toastService.show('Username is required.', { classname: 'bg-danger text-light' });
      return;
    }

    if (username === 'new') {
      console.log('new nih');

      this.toastService.show('Username cannot be "new".', { classname: 'bg-danger text-light' });
      return;
    }

    if (!this.isEditMode && this.employeeService.getByUsername(username)) {
      this.toastService.show('Username already exists.', { classname: 'bg-danger text-light' });
      return;
    }

    try {
      if (this.isEditMode) {
        console.log('edit mode');
        this.employeeService.update(this.employee.username, this.employee);
        this.toastService.show('Employee updated successfully.', {
          classname: 'bg-success text-light',
        });
      } else {
        console.log('add nih');
        this.employeeService.add(this.employee);
        this.toastService.show('Employee added successfully.', {
          classname: 'bg-success text-light',
        });
      }

      console.log('balik ke list');
      this.router.navigate(['/employees']);
    } catch (error: any) {
      this.toastService.show(error.message || 'Something went wrong');
    }
  }

  formatBirthDate() {
    if (this.employee?.birthDate) {
      const date = new Date(this.employee.birthDate);
      this._birthDate = date.toISOString().split('T')[0];
    }
  }

  onBirthDateChange(value: string): void {
    this._birthDate = value;
    if (this.employee) {
      this.employee.birthDate = new Date(value);
    }
  }

  formatSalary(): void {
    const salary = this.employee?.basicSalary ?? 0;
    this.displaySalaryWithPrefix = 'Rp. ' + this.formatCurrency(salary) + ',00';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(value);
  }

  onSalaryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const prefix = 'Rp. ';
    const suffix = ',00';

    let value = input.value;

    if (value.startsWith(prefix)) {
      value = value.slice(prefix.length);
    }

    if (value.endsWith(suffix)) {
      value = value.slice(0, -suffix.length);
    }

    const numericValue = value.replace(/\D/g, '');
    const parsed = parseFloat(numericValue || '0');

    if (this.employee) {
      this.employee.basicSalary = parsed;
    }

    const formatted = this.formatCurrency(parsed);
    const finalValue = prefix + formatted + suffix;
    input.value = finalValue;
    this.displaySalaryWithPrefix = finalValue;

    setTimeout(() => {
      const caret = input.value.length - suffix.length;
      input.setSelectionRange(caret, caret);
    });
  }

  onSalaryFocus(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      const caret = input.value.length - 3;
      input.setSelectionRange(caret, caret);
    });
  }

  onSalaryKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const suffix = ',00';
    const suffixStart = input.value.length - suffix.length;
    const caretPos = input.selectionStart ?? 0;

    const prefixLength = 4;

    if (
      (event.key === 'ArrowLeft' && caretPos <= prefixLength) ||
      (event.key === 'Backspace' && caretPos <= prefixLength)
    ) {
      event.preventDefault();
    }

    if (
      (event.key === 'ArrowRight' && caretPos >= suffixStart) ||
      (caretPos >= suffixStart && ['ArrowRight', 'Delete'].includes(event.key))
    ) {
      event.preventDefault();
      setTimeout(() => {
        input.setSelectionRange(suffixStart, suffixStart);
      });
    }
  }
}
