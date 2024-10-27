import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})


export class RegisterPage {
  fullName: string = '';
  username: string = '';
  birthdate: string = ''; 
  contra: string = '';
  confirmPassword: string = '';
  tipo_usuario: string ="";
  usernameError: string = '';
  passwordError: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  /*async validateUsername() {
    if (!this.username) return;
    
    try {
      const exists = await this.authService.existingUser(this.username);
      if (exists) {
        this.usernameError = 'Este nombre de usuario ya está en uso';
      } else {
        this.usernameError = '';
      }
    } catch (error) {
      console.error('Error al validar username:', error);
    }
  }
*/
  // Validar contraseña
  validatePassword() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
    
    if (!this.contra) {
      this.passwordError = 'La contraseña es requerida';
    } else if (this.contra.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!passwordRegex.test(this.contra)) {
      this.passwordError = 'La contraseña debe contener al menos una mayúscula';
    } else {
      this.passwordError = '';
    }
  }


  async onSubmit() {
    if (this.contra !== this.confirmPassword) {
      await this.presentAlert('Las contraseñas no coinciden.');
      return;
    }

    const [firstName, lastName] = this.fullName.split(' ');

    const isRegistered = await this.authService.register(
      firstName || '',
      lastName || '',
      this.username,
      this.contra,
      this.birthdate,
      this.tipo_usuario
    );

    if (isRegistered) {
      this.router.navigate(['/home']);
    } else {
      await this.presentAlert('El nombre de usuario ya está en uso');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Registro',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  clearForm() {
    this.fullName = '';
    this.username = '';
    this.birthdate = '';
    this.contra = '';
    this.confirmPassword = '';
  }
  isDateTimeOpen = false;


}

