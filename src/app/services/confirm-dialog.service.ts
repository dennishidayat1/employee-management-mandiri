import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmDialogData {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private _dialog = new BehaviorSubject<ConfirmDialogData | null>(null);
  dialog$ = this._dialog.asObservable();

  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this._dialog.next({
        message,
        onConfirm: () => {
          resolve(true);
          this._dialog.next(null);
        },
        onCancel: () => {
          resolve(false);
          this._dialog.next(null);
        },
      });
    });
  }
}
