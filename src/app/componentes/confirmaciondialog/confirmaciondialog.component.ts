import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmaciondialog',
  templateUrl: './confirmaciondialog.component.html',
  styleUrl: './confirmaciondialog.component.css'
})
export class ConfirmaciondialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmaciondialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
