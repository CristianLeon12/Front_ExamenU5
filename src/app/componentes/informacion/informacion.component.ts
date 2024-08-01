import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {
  usuario: any = {};
  imagenUrl: string | null = null;
  selectedFile: File | null = null;
  userInfoId: number | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    if (typeof localStorage !== 'undefined') {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.authService.getUserInfo(parseInt(userId)).subscribe(response => {
          if (response) {
            this.usuario = response.usuario || {}; 
            this.userInfoId = response.id;
            if (response.image_path) {
              const imagePath = response.image_path.replace('public/', '');
              this.imagenUrl = `http://127.0.0.1:8000/storage/${imagePath}`;
            } else {
              this.imagenUrl = 'assets/default-avatar.png'; 
            }
          }
        });
      }
    }
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('usuario_id', localStorage.getItem('userId')!);

      if (this.userInfoId) {
        this.authService.updateImage(formData, this.userInfoId).subscribe(response => {
          console.log('Imagen actualizada exitosamente:', response);
          const imagePath = response.data.image_path.replace('public/', '');
          this.imagenUrl = `http://127.0.0.1:8000/storage/${imagePath}`;
          this.loadUserInfo(); 
        });
      } else {
        this.authService.uploadImage(formData).subscribe(response => {
          console.log('Imagen subida exitosamente:', response);
          const imagePath = response.data.image_path.replace('public/', '');
          this.imagenUrl = `http://127.0.0.1:8000/storage/${imagePath}`;
          this.loadUserInfo(); 
        });
      }
    }
  }

  deleteImage() {
    if (this.userInfoId) {
      this.authService.deleteImage(this.userInfoId).subscribe(response => {
        console.log('Imagen eliminada exitosamente:', response);
        this.imagenUrl = 'assets/default-avatar.png';
        this.loadUserInfo();
      });
    }
  }
  
}
