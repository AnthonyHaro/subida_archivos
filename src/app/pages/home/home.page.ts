import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { supabase } from 'src/app/supabase.client';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  email = '';
  selectedFile: File | null = null;
  selectedFileName = '';

  constructor(private router: Router) {}

  async ngOnInit() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      this.router.navigate(['/auth']);
      return;
    }
    this.email = data.user.email || '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  async uploadFile() {
    if (!this.selectedFile) {
      alert('Por favor selecciona un archivo primero');
      return;
    }

    const file = this.selectedFile;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const safeEmail = this.email.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `${safeEmail}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file);

    if (error) {
      console.error('Error subiendo archivo:', error);
      alert('Error al subir el archivo: ' + error.message);
      return;
    }

    alert('Archivo subido con éxito!');
    this.selectedFile = null;
    this.selectedFileName = '';
  }
}
