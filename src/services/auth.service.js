// Authentication service for user management
import { ApiService } from './api.service.js';
import Swal from 'sweetalert2';

export class AuthService {
    constructor() {
        this.apiService = new ApiService();
        this.currentUserKey = 'currentUser';
    }

    // Check if user is currently authenticated
    isAuthenticated() {
        return localStorage.getItem(this.currentUserKey) !== null;
    }

    // Get current user from localStorage
    getCurrentUser() {
        const userData = localStorage.getItem(this.currentUserKey);
        return userData ? JSON.parse(userData) : null;
    }

    // Login with email/identity and password
    async login(emailOrIdentity, password) {
        try {
            // Search for user by email or identity
            const users = await this.apiService.get('/users');
            const user = users.find(u => 
                (u.email === emailOrIdentity || u.identidad === emailOrIdentity) && 
                u.contrasena === password
            );

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Get user role information
            const role = await this.apiService.get(`/roles/${user.rolId}`);
            const userWithRole = { ...user, role: role.name };

            // Store user session
            localStorage.setItem(this.currentUserKey, JSON.stringify(userWithRole));

            await Swal.fire({
                title: 'Welcome!',
                text: `Hello ${user.nombre}`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            return userWithRole;
        } catch (error) {
            await Swal.fire({
                title: 'Login Failed',
                text: error.message,
                icon: 'error'
            });
            throw error;
        }
    }

    // Register new customer
    async register(userData) {
        try {
            // Validate required fields
            const requiredFields = ['nombre', 'identidad', 'telefono', 'direccion', 'email', 'contrasena'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            // Check if email or identity already exists
            const users = await this.apiService.get('/users');
            const existingUser = users.find(u => 
                u.email === userData.email || u.identidad === userData.identidad
            );

            if (existingUser) {
                throw new Error('Email or identity already exists');
            }

            // Create new user with customer role
            const newUser = {
                ...userData,
                rolId: 2 // Customer role
            };

            const createdUser = await this.apiService.post('/users', newUser);

            await Swal.fire({
                title: 'Registration Successful!',
                text: 'You can now login with your credentials',
                icon: 'success'
            });

            return createdUser;
        } catch (error) {
            await Swal.fire({
                title: 'Registration Failed',
                text: error.message,
                icon: 'error'
            });
            throw error;
        }
    }

    // Logout current user
    logout() {
        localStorage.removeItem(this.currentUserKey);
        
        Swal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
        });
    }

    // Check if current user has specific role
    hasRole(roleName) {
        const user = this.getCurrentUser();
        return user && user.role === roleName;
    }
}