import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
