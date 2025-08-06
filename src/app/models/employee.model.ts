export class Employee {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: string;
  group: string;
  description: string;


  constructor(init?: Partial<Employee>) {
    this.username = init?.username ?? '';
    this.firstName = init?.firstName ?? '';
    this.lastName = init?.lastName ?? '';
    this.email = init?.email ?? '';
    this.birthDate = init?.birthDate ?? new Date();
    this.basicSalary = init?.basicSalary ?? 0;
    this.status = init?.status ?? '';
    this.group = init?.group ?? '';
    this.description = init?.description ?? '';
  }
}