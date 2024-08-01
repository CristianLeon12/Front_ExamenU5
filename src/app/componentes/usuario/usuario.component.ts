import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmaciondialogComponent } from '../confirmaciondialog/confirmaciondialog.component';

export interface Usuario {
  id: number;
  nombre_completo: string;
  correo_electronico: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nombre_completo', 'correo_electronico', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadUsuarios(): void {
    this.http.get<Usuario[]>('http://127.0.0.1:8000/api/usuarios')
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  agregarUsuario(): void {
    const dialogRef = this.dialog.open(UsuarioFormularioComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post<Usuario>('http://127.0.0.1:8000/api/usuarios', result)
          .subscribe(response => {
            this.loadUsuarios();  // Recargar los datos
          });
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioFormularioComponent, {
      width: '400px',
      data: { isEdit: true, usuario: usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put<Usuario>(`http://127.0.0.1:8000/api/usuarios/${usuario.id}`, result)
          .subscribe(response => {
            this.loadUsuarios();  // Recargar los datos
          });
      }
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmaciondialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://127.0.0.1:8000/api/usuarios/${usuario.id}`)
          .subscribe(() => {
            this.loadUsuarios();  // Recargar los datos
          });
      }
    });
  }
}

@Component({
  selector: 'app-usuario-formulario',
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
    <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>Nombre Completo</mat-label>
          <input matInput formControlName="nombre_completo">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Correo Electrónico</mat-label>
          <input matInput formControlName="correo_electronico">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Contraseña</mat-label>
          <input matInput formControlName="contrasena" type="password">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Confirmar Contraseña</mat-label>
          <input matInput formControlName="contrasena_confirmation" type="password">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-button type="submit" [disabled]="!usuarioForm.valid">
          {{ data.isEdit ? 'Guardar Cambios' : 'Agregar' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class UsuarioFormularioComponent {
  usuarioForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UsuarioFormularioComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; usuario: Usuario }
  ) {
    this.usuarioForm = this.fb.group({
      nombre_completo: [data.isEdit ? data.usuario.nombre_completo : '', Validators.required],
      correo_electronico: [data.isEdit ? data.usuario.correo_electronico : '', [Validators.required, Validators.email]],
      contrasena: ['', data.isEdit ? Validators.nullValidator : Validators.required],
      contrasena_confirmation: ['', data.isEdit ? Validators.nullValidator : Validators.required]
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.dialogRef.close(this.usuarioForm.value);
    }
  }
}
