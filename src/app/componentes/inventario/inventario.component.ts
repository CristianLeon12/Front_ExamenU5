import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmaciondialogComponent } from '../confirmaciondialog/confirmaciondialog.component';

export interface Inventario {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  cantidad: number;
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'color', 'cantidad', 'acciones'];
  dataSource = new MatTableDataSource<Inventario>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadInventarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadInventarios(): void {
    this.http.get<Inventario[]>('http://127.0.0.1:8000/api/inventarios')
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  agregarInventario(): void {
    const dialogRef = this.dialog.open(InventarioFormularioComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post<Inventario>('http://127.0.0.1:8000/api/inventarios', result)
          .subscribe(response => {
            this.loadInventarios(); // Recargar los datos
          });
      }
    });
  }

  editarInventario(inventario: Inventario): void {
    const dialogRef = this.dialog.open(InventarioFormularioComponent, {
      width: '400px',
      data: inventario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put<Inventario>(`http://127.0.0.1:8000/api/inventarios/${inventario.id}`, result)
          .subscribe(response => {
            this.loadInventarios(); // Recargar los datos
          });
      }
    });
  }

  eliminarInventario(inventario: Inventario): void {
    const dialogRef = this.dialog.open(ConfirmaciondialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://127.0.0.1:8000/api/inventarios/${inventario.id}`)
          .subscribe(() => {
            this.loadInventarios(); // Recargar los datos
          });
      }
    });
  }
}

@Component({
  selector: 'app-inventario-formulario',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Inventario' : 'Nuevo Inventario' }}</h2>
    <form [formGroup]="inventarioForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Descripción</mat-label>
          <input matInput formControlName="descripcion">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Color</mat-label>
          <input matInput formControlName="color">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Cantidad</mat-label>
          <input matInput type="number" formControlName="cantidad">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-button type="submit" [disabled]="!inventarioForm.valid">
          {{ data ? 'Actualizar' : 'Agregar' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class InventarioFormularioComponent {
  inventarioForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<InventarioFormularioComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.inventarioForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      color: [data?.color || '', Validators.required],
      cantidad: [data?.cantidad || 0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.inventarioForm.valid) {
      this.dialogRef.close(this.inventarioForm.value);
    }
  }
}
