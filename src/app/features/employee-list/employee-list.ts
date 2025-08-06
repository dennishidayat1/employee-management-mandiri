import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../shared/toast/toast';

@Component({
  selector: 'EmployeeList',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialog, FormsModule, ToastComponent],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeList {
  employee: Employee | undefined;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees = signal<Employee[]>([]);

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  searchTerm = '';
  searchGroup = '';

  sortKey: keyof Employee = 'firstName';
  sortAsc: boolean = true;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService,
  ) { }

  ngOnInit() {
    console.log('employeeService', this.employeeService);
    console.log('getAll', this.employeeService.getAll);
    this.employees = this.employeeService.getAll();
    this.applyFilters();
    this.changeItemsPerPage(this.pageSize);
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase();
    const group = this.searchGroup.toLowerCase();

    this.filteredEmployees = this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(term) &&
      emp.group.toLowerCase().includes(group)
    );

    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.updatePaginatedEmployees();
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  async deleteEmployee(emp: Employee) {
    console.log('deleteEmployee', emp);

    const confirmed = await this.confirmDialog.confirm(
      `Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`
    );

    if (confirmed) {
      this.employees = this.employees.filter(e => e.username !== emp.username);
      this.filteredEmployees = this.filteredEmployees.filter(e => e.username !== emp.username);
      this.updatePaginatedEmployees();

      this.toastService.show(`Deleted employee: ${emp.firstName} ${emp.lastName}`, {
        classname: 'bg-danger text-light',
      });
    }
  }

  save() {
    if (this.employee) {
      this.employeeService.update(this.employee.username, this.employee);
    }
  }

  goBack() {
    this.router.navigate(['/employees']);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedEmployees();
  }

  changeItemsPerPage(count: number) {
    console.log('changeItemsPerPage', count);

    this.pageSize = Number(count);
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.updatePaginatedEmployees();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEmployees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEmployees();
    }
  }

  updatePaginatedEmployees() {
    // console.log('updatePaginatedEmployees');
    // console.log('currentPage', this.currentPage);
    // console.log('pageSize', this.pageSize);

    const start: number = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    // console.log('start', start);
    // console.log('end', end);
    // console.log('filteredEmployees', this.filteredEmployees);
    this.paginatedEmployees.set(this.filteredEmployees.slice(start, end));
    // console.log('paginatedEmployees', this.paginatedEmployees);
  }

  editEmployee(emp: Employee) {
    this.router.navigate(['/employee', emp.username]);
  }

  sortBy(key: keyof Employee) {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }

    this.filteredEmployees.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortAsc ? valA - valB : valB - valA;
      }

      return 0;
    });

    this.updatePaginatedEmployees();
  }

  updateFilteredEmployees() {
    this.applyFilters();
  }

  trackByUsername(index: number, item: Employee): string {
    return item.username;
  }

  addNewEmployee() {
    this.router.navigate(['/employee/new']);
  }
}
