import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { EMPLOYEES } from '../data/mock-employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private currentId = 1;

  constructor() { }

  private employees: Employee[] = EMPLOYEES.map(emp => new Employee(emp));

  getAll(): Employee[] {
    return this.employees;
  }

  getEmployees(): Employee[] {
    return this.employees;
  }

  getByUsername(username: string): Employee | undefined {
    return this.employees.find(emp => emp.username === username);
  }

  add(employee: Employee): void {
    const exists = this.employees.some(emp => emp.username === employee.username);
    if (exists) {
      throw new Error('Username already exists');
    }
    this.employees.push(new Employee(employee));
  }

  delete(username: string): void {
    const index = this.employees.findIndex(emp => emp.username === username);
    if (index !== -1) {
      this.employees.splice(index, 1);
    }
  }

  update(username: string, updatedEmployee: Employee): void {
    const index = this.employees.findIndex(emp => emp.username === username);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    updatedEmployee.username = username;
    this.employees[index] = new Employee(updatedEmployee);
  }

  search(keyword: string): Employee[] {
    keyword = keyword.toLowerCase();
    return this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(keyword) ||
      emp.lastName.toLowerCase().includes(keyword) ||
      emp.email.toLowerCase().includes(keyword) ||
      emp.group.toLowerCase().includes(keyword)
    );
  }
}
