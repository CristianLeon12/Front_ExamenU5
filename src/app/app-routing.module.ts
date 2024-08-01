import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { VentaComponent } from './componentes/venta/venta.component';
import { MainLayoutComponent } from './componentes/main-layout/main-layout.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { InventarioComponent } from './componentes/inventario/inventario.component';
import { InformacionComponent } from './componentes/informacion/informacion.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'usuarios', component: UsuarioComponent },
      { path: 'ventas', component: VentaComponent },
      { path: 'inventario', component: InventarioComponent },
      {path: 'informacion', component:  InformacionComponent}
    ],
  },
  { path: '**', redirectTo: '' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
