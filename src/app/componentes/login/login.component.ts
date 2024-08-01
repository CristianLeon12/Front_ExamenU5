import { Component, OnInit, Renderer2, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from '../auth.service';  
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;
  validationErrors: any = {};
  errorMessage: string | null = null;

  constructor(
    private router: Router, 
    private renderer: Renderer2, 
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService  
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.anchoPagina();
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.anchoPagina();
    }
  }
  
  iniciarSesion() {
    if (isPlatformBrowser(this.platformId)) {
      const formularioRegister = this.renderer.selectRootElement('.formulario__register', true);
      const contenedorLoginRegister = this.renderer.selectRootElement('.contenedor__login-register', true);
      const formularioLogin = this.renderer.selectRootElement('.formulario__login', true);
      const cajaTraseraRegister = this.renderer.selectRootElement('.caja__trasera-register', true);
      const cajaTraseraLogin = this.renderer.selectRootElement('.caja__trasera-login', true);
  
      if (window.innerWidth > 850) {
        this.renderer.setStyle(formularioRegister, 'display', 'none');
        this.renderer.setStyle(contenedorLoginRegister, 'left', '10px');
        this.renderer.setStyle(formularioLogin, 'display', 'block');
        this.renderer.setStyle(cajaTraseraRegister, 'opacity', '1');
        this.renderer.setStyle(cajaTraseraLogin, 'opacity', '0');
      } else {
        this.renderer.setStyle(formularioRegister, 'display', 'none');
        this.renderer.setStyle(contenedorLoginRegister, 'left', '0px');
        this.renderer.setStyle(formularioLogin, 'display', 'block');
        this.renderer.setStyle(cajaTraseraRegister, 'display', 'block');
        this.renderer.setStyle(cajaTraseraLogin, 'display', 'none');
      }
    }
  }
  
  register() {
    if (isPlatformBrowser(this.platformId)) {
      const formularioRegister = this.renderer.selectRootElement('.formulario__register', true);
      const contenedorLoginRegister = this.renderer.selectRootElement('.contenedor__login-register', true);
      const formularioLogin = this.renderer.selectRootElement('.formulario__login', true);
      const cajaTraseraRegister = this.renderer.selectRootElement('.caja__trasera-register', true);
      const cajaTraseraLogin = this.renderer.selectRootElement('.caja__trasera-login', true);
  
      if (window.innerWidth > 850) {
        this.renderer.setStyle(formularioRegister, 'display', 'block');
        this.renderer.setStyle(contenedorLoginRegister, 'left', '410px');
        this.renderer.setStyle(formularioLogin, 'display', 'none');
        this.renderer.setStyle(cajaTraseraRegister, 'opacity', '0');
        this.renderer.setStyle(cajaTraseraLogin, 'opacity', '1');
      } else {
        this.renderer.setStyle(formularioRegister, 'display', 'block');
        this.renderer.setStyle(contenedorLoginRegister, 'left', '0px');
        this.renderer.setStyle(formularioLogin, 'display', 'none');
        this.renderer.setStyle(cajaTraseraRegister, 'display', 'none');
        this.renderer.setStyle(cajaTraseraLogin, 'display', 'block');
        this.renderer.setStyle(cajaTraseraLogin, 'opacity', '1');
      }
    }
  }
  
  anchoPagina() {
    if (isPlatformBrowser(this.platformId)) {
      const cajaTraseraLogin = this.renderer.selectRootElement('.caja__trasera-login', true);
      const cajaTraseraRegister = this.renderer.selectRootElement('.caja__trasera-register', true);
      const contenedorLoginRegister = this.renderer.selectRootElement('.contenedor__login-register', true);
      const formularioLogin = this.renderer.selectRootElement('.formulario__login', true);
      const formularioRegister = this.renderer.selectRootElement('.formulario__register', true);
  
      if (window.innerWidth > 850) {
        this.renderer.setStyle(cajaTraseraLogin, 'display', 'block');
        this.renderer.setStyle(cajaTraseraRegister, 'display', 'block');
      } else {
        this.renderer.setStyle(cajaTraseraRegister, 'display', 'block');
        this.renderer.setStyle(cajaTraseraRegister, 'opacity', '1');
        this.renderer.setStyle(cajaTraseraLogin, 'display', 'none');
        this.renderer.setStyle(formularioLogin, 'display', 'block');
        this.renderer.setStyle(formularioRegister, 'display', 'none');
        this.renderer.setStyle(contenedorLoginRegister, 'left', '0px');
      }
    }
  }
  
  onSubmitLogin(loginForm: NgForm) {
    if (loginForm.valid) {
      const credentials = {
        correo_electronico: loginForm.value.email,
        contrasena: loginForm.value.password
      };
  
      this.authService.login(credentials).subscribe(
        response => {
          console.log('Inicio de sesión exitoso', response);
          if (response.usuario && response.usuario.id) {
            localStorage.setItem('userId', response.usuario.id); 
            this.router.navigate(['/informacion']);
          } else {
            console.error('Error: La respuesta no contiene el usuario');
            this.errorMessage = 'Error al iniciar sesión';
          }
        },
        error => {
          console.error('Error al iniciar sesión', error);
          this.errorMessage = error.error.message || 'Error al iniciar sesión';
        }
      );
    }
  }
  
  onSubmitRegister(registerForm: NgForm) {
    if (registerForm.valid) {
      const user = {
        nombre_completo: registerForm.value.name,
        correo_electronico: registerForm.value.email,
        contrasena: registerForm.value.password,
        contrasena_confirmation: registerForm.value.password_confirmation
      };
  
      this.authService.register(user).subscribe(
        response => {
          console.log('Usuario creado exitosamente', response);
          if (response.id) { 
            localStorage.setItem('userId', response.id.toString()); 
            this.router.navigate(['/informacion']); 
          }
        },
        error => {
          console.error('Error al crear el usuario', error);
          if (error.status === 422) {
            this.validationErrors = error.error.errors;
          }
        }
      );
    }
  }
  
  
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  
  toggleShowPasswordConfirm() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }
}  