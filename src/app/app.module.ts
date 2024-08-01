import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './componentes/login/login.component';
import { VentaComponent,VentaFormularioComponent } from './componentes/venta/venta.component';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { InventarioComponent,InventarioFormularioComponent  } from './componentes/inventario/inventario.component';
import { UsuarioComponent, UsuarioFormularioComponent } from './componentes/usuario/usuario.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { MainLayoutComponent } from './componentes/main-layout/main-layout.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, MatEndDate } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CustomPaginator } from './utils/custom-paginator-intl';
import { ConfirmaciondialogComponent } from './componentes/confirmaciondialog/confirmaciondialog.component';
import { InformacionComponent } from './componentes/informacion/informacion.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VentaComponent,
    InventarioComponent,
    UsuarioComponent,
    MenuComponent,
    MainLayoutComponent,
    UsuarioFormularioComponent,
    InventarioFormularioComponent,
    ConfirmaciondialogComponent,
    VentaFormularioComponent,
    InformacionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
   
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
    

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
