import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  classname?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toasts = new BehaviorSubject<ToastMessage[]>([]);
  public readonly toasts$ = this._toasts.asObservable();

  show(text: string, options: Partial<ToastMessage> = {}) {
    const toast = { text, ...options };
    const current = this._toasts.getValue();
    this._toasts.next([...current, toast]);

    setTimeout(() => {
      const updated = this._toasts.getValue().filter((t) => t !== toast);
      this._toasts.next(updated);
    }, 3000);
  }
}
