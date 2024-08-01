import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmaciondialogComponent } from '../confirmaciondialog/confirmaciondialog.component';
import { formatDate } from '@angular/common';

export interface Venta {
  id: number;
  inventario_id: number;
  fecha: string;
  cantidad_productos: number;
  precio: number;
  tipo_pago: string;
  monto_total: number;
  inventario: { nombre: string };
}

export interface Inventario {
  id: number;
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'inventario', 'fecha', 'cantidad_productos', 'precio', 'tipo_pago', 'monto_total', 'acciones'];
  dataSource = new MatTableDataSource<Venta>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadVentas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadVentas(): void {
    this.http.get<Venta[]>('http://127.0.0.1:8000/api/ventas')
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  agregarVenta(): void {
    const dialogRef = this.dialog.open(VentaFormularioComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post<Venta>('http://127.0.0.1:8000/api/ventas', result)
          .subscribe(response => {
            this.loadVentas(); 
          }, error => {
            console.error('Error:', error);
            alert('Error al registrar la venta: ' + error.error.message);
          });
      }
    });
  }

  editarVenta(venta: Venta): void {
    const dialogRef = this.dialog.open(VentaFormularioComponent, {
      width: '400px',
      data: venta
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put<Venta>(`http://127.0.0.1:8000/api/ventas/${venta.id}`, result)
          .subscribe(response => {
            this.loadVentas(); 
          });
      }
    });
  }

  eliminarVenta(venta: Venta): void {
    const dialogRef = this.dialog.open(ConfirmaciondialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://127.0.0.1:8000/api/ventas/${venta.id}`)
          .subscribe(() => {
            this.loadVentas(); 
          });
      }
    });
  }
}

@Component({
  selector: 'app-venta-formulario',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Venta' : 'Nueva Venta' }}</h2>
    <form [formGroup]="ventaForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>Inventario</mat-label>
          <mat-select formControlName="inventario_id" (selectionChange)="onInventarioChange($event.value)">
            <mat-option *ngFor="let inventario of inventarios" [value]="inventario.id">
              {{ inventario.nombre }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="insufficientStock">{{ errorMessage }}</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Fecha</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="fecha">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Cantidad de Productos</mat-label>
          <input matInput type="number" formControlName="cantidad_productos" [max]="maxCantidadProductos" (input)="calcularMontoTotal()">
          <mat-error *ngIf="insufficientStock">{{ errorMessage }}</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="precio" (input)="calcularMontoTotal()">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Tipo de Pago</mat-label>
          <mat-select formControlName="tipo_pago">
            <mat-option value="credito">Crédito</mat-option>
            <mat-option value="contado">Contado</mat-option>
          </mat-select>
        </mat-form-field>
        <div style="margin-top: 20px;">
          <strong>Monto Total: {{ ventaForm.get('monto_total')?.value | currency }}</strong>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-button type="submit" [disabled]="!ventaForm.valid || insufficientStock">
          {{ data ? 'Actualizar' : 'Agregar' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class VentaFormularioComponent implements OnInit {
  ventaForm: FormGroup;
  inventarios: Inventario[] = [];
  insufficientStock = false;
  errorMessage = 'Cantidad insuficiente en inventario';
  maxCantidadProductos: number = 0;
  originalCantidad: number = 0; 

  constructor(
    public dialogRef: MatDialogRef<VentaFormularioComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ventaForm = this.fb.group({
      inventario_id: [data?.inventario_id || '', Validators.required],
      fecha: [data?.fecha || '', Validators.required],
      cantidad_productos: [data?.cantidad_productos || 0, [Validators.required, Validators.min(1)]],
      precio: [data?.precio || 0, [Validators.required, Validators.min(0)]],
      tipo_pago: [data?.tipo_pago || 'contado', Validators.required],
      monto_total: [{ value: data?.monto_total || 0, disabled: true }, Validators.required]
    });

    this.originalCantidad = data?.cantidad_productos || 0; 
  }

  ngOnInit(): void {
    this.http.get<Inventario[]>('http://127.0.0.1:8000/api/inventarios')
      .subscribe(data => {
        this.inventarios = data;
        this.onInventarioChange(this.ventaForm.get('inventario_id')?.value); 
      });

    this.calcularMontoTotal();
  }

  onInventarioChange(inventario_id: number): void {
    const inventario = this.inventarios.find(i => i.id === inventario_id);
    if (inventario) {
      const cantidadDisponible = inventario.cantidad + this.originalCantidad; 
      this.maxCantidadProductos = cantidadDisponible;
    } else {
      this.maxCantidadProductos = 0;
    }
    this.calcularMontoTotal();
  }

  calcularMontoTotal(): void {
    const cantidad = this.ventaForm.get('cantidad_productos')?.value || 0;
    const precio = this.ventaForm.get('precio')?.value || 0;
    this.ventaForm.get('monto_total')?.setValue(cantidad * precio);

    const inventario_id = this.ventaForm.get('inventario_id')?.value;
    if (inventario_id) {
      const inventario = this.inventarios.find(i => i.id === inventario_id);
      if (inventario && inventario.cantidad + this.originalCantidad < cantidad) {
        this.insufficientStock = true;
      } else {
        this.insufficientStock = false;
      }
    }
  }

  onSubmit(): void {
    if (this.ventaForm.valid && !this.insufficientStock) {
      const formData = this.ventaForm.getRawValue();
      formData.monto_total = this.ventaForm.get('monto_total')?.value;
      formData.fecha = formatDate(formData.fecha, 'yyyy-MM-dd', 'en-US'); 
      formData.originalCantidad = this.originalCantidad; 
      this.dialogRef.close(formData);
    }
  }
}
