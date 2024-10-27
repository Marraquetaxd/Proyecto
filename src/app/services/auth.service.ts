import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor(private storageService: StorageService) {
    this.checkLoginStatus();
  }

  // Inicializa el estado de autenticación
  async checkLoginStatus() {
    const isLoggedIn = await this.storageService.get('isLoggedIn');
    this.loggedIn = isLoggedIn === 'true';
  }

  // Verifica si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    const isLoggedIn = await this.storageService.get('isLoggedIn');
    return isLoggedIn === 'true';
  }

  // Devuelve el estado actual de loggedIn
  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Intenta iniciar sesión con un nombre de usuario y contraseña
  async login(username: string, password: string): Promise<boolean> {
    console.log('Intentando iniciar sesión con:', username);

    const storedUsers: any[] = await this.storageService.get('users') || [];

    const user = storedUsers.find((user) => user.username === username && user.password === password);

    if (user) {
      this.loggedIn = true;
      await this.storageService.set('isLoggedIn', 'true');
      await this.storageService.set('currentUser', user);
      console.log('Inicio de sesión exitoso');
      return true;
    }

    console.log('Error de inicio de sesión: usuario no encontrado o contraseña incorrecta');
    return false;
  }

  // Cierra sesión del usuario actual
  async logout(): Promise<void> {
    this.loggedIn = false;
    await this.storageService.remove('isLoggedIn');
    await this.storageService.remove('currentUser');
    console.log('Usuario ha cerrado sesión');
  }

  // Obtiene el usuario actual
  async getCurrentUser(): Promise<any> {
    return await this.storageService.get('currentUser');
  }

  // Actualiza la imagen de perfil del usuario actual
  async updateProfileImage(imageUrl: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (currentUser) {
      currentUser.profileImage = imageUrl;
      await this.storageService.set('currentUser', currentUser);
      console.log('Imagen de perfil actualizada');
    }
  }

  // Obtiene la lista de todos los usuarios
  async getAllUsers(): Promise<any[]> {
    return await this.storageService.get('users') || [];
  }

  // Elimina un usuario basado en su nombre de usuario
  async deleteUser(username: string): Promise<void> {
    const users = await this.getAllUsers();
    const updatedUsers = users.filter((user) => user.username !== username);
    await this.storageService.set('users', updatedUsers);
    console.log(`Usuario ${username} eliminado`);
  }

  // Actualiza la información del usuario actual
  async updateUser(updatedUser: any): Promise<void> {
    const users = await this.getAllUsers();
    const currentUser = await this.getCurrentUser();

    const userIndex = users.findIndex((user) => user.username === currentUser.username);

    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      await this.storageService.set('users', users);
      await this.storageService.set('currentUser', updatedUser);
      console.log('Información del usuario actualizada');
    } else {
      console.error('Error al actualizar: usuario no encontrado');
    }
  }

  // Registra un nuevo usuario
  async register(firstName: string, lastName: string, username: string, password: string, birthdate: string, tipo_usuario:String ): Promise<boolean> {
    const storedUsers = await this.getAllUsers();

    // Verifica si el nombre de usuario ya existe
    const existingUser = storedUsers.find((user) => user.username === username);

    if (existingUser) {
      console.log('El nombre de usuario ya existe');
      return false;
    }

    // Crea un nuevo usuario
    const newUser = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      username,
      password,
      birthdate,
      tipo_usuario
    };

    // Añade el nuevo usuario a la lista y guarda en el almacenamiento
    storedUsers.push(newUser);
    await this.storageService.set('users', storedUsers);

    // Inicia sesión automáticamente tras el registro
    this.loggedIn = true;
    await this.storageService.set('isLoggedIn', 'true');
    await this.storageService.set('currentUser', newUser);

    console.log('Usuario registrado con éxito');
    return true;
  }
}
