// Register view - customer registration
import { AuthService } from '../services/auth.service.js';
import Swal from 'sweetalert2';

export class RegisterView {
    constructor() {
        this.authService = new AuthService();
    }

    render() {
        return `
            <div class="view-container">
                <div class="card">
                    <h2>📝 Register</h2>
                    <p class="text-center text-muted mb-3">
                        Create your customer account to start using our services
                    </p>
                    
                    <form id="registerForm">
                        <div class="form-group">
                            <label for="nombre">Full Name *</label>
                            <input 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                required 
                                placeholder="Enter your full name"
                                autocomplete="name"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="identidad">Identity Document *</label>
                            <input 
                                type="text" 
                                id="identidad" 
                                name="identidad" 
                                required 
                                placeholder="Enter your ID number"
                                autocomplete="off"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="telefono">Phone Number *</label>
                            <input 
                                type="tel" 
                                id="telefono" 
                                name="telefono" 
                                required 
                                placeholder="Enter your phone number"
                                autocomplete="tel"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="direccion">Address *</label>
                            <input 
                                type="text" 
                                id="direccion" 
                                name="direccion" 
                                required 
                                placeholder="Enter your address"
                                autocomplete="address-line1"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                placeholder="Enter your email"
                                autocomplete="email"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="contrasena">Password *</label>
                            <input 
                                type="password" 
                                id="contrasena" 
                                name="contrasena" 
                                required 
                                placeholder="Create a password"
                                autocomplete="new-password"
                                minlength="6"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password *</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                required 
                                placeholder="Confirm your password"
                                autocomplete="new-password"
                                minlength="6"
                            >
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-full">
                            Register
                        </button>
                    </form>
                    
                    <div class="nav-links">
                        <a href="#" data-navigate="/login">Already have an account? Login</a>
                        <a href="#" data-navigate="/">Back to Home</a>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        // Set up form submission handler
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // Set up password confirmation validation
        const passwordInput = document.getElementById('contrasena');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (passwordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.validatePasswordConfirmation();
            });
        }
    }

    validatePasswordConfirmation() {
        const password = document.getElementById('contrasena').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            nombre: formData.get('nombre'),
            identidad: formData.get('identidad'),
            telefono: formData.get('telefono'),
            direccion: formData.get('direccion'),
            email: formData.get('email'),
            contrasena: formData.get('contrasena')
        };
        
        const confirmPassword = formData.get('confirmPassword');
        
        // Validation
        if (!this.validateRegistrationData(userData, confirmPassword)) {
            return;
        }
        
        try {
            // Show loading state
            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;
            
            // Attempt registration
            await this.authService.register(userData);
            
            // Redirect to login page on success
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            
        } catch (error) {
            // Reset button state on error
            const submitBtn = event.target.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Register';
            submitBtn.disabled = false;
            
            console.error('Registration failed:', error);
        }
    }

    validateRegistrationData(userData, confirmPassword) {
        // Check required fields
        const requiredFields = ['nombre', 'identidad', 'telefono', 'direccion', 'email', 'contrasena'];
        for (const field of requiredFields) {
            if (!userData[field] || userData[field].trim() === '') {
                Swal.fire({
                    title: 'Validation Error',
                    text: `${field} is required`,
                    icon: 'warning'
                });
                return false;
            }
        }
        
        // Check password confirmation
        if (userData.contrasena !== confirmPassword) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Passwords do not match',
                icon: 'warning'
            });
            return false;
        }
        
        // Check password length
        if (userData.contrasena.length < 6) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Password must be at least 6 characters long',
                icon: 'warning'
            });
            return false;
        }
        
        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please enter a valid email address',
                icon: 'warning'
            });
            return false;
        }
        
        return true;
    }
}



//TEST // Register view - temporary placeholder
// export class RegisterView {
//     render() {
//         return `
//             <div class="view-container">
//                 <div class="card">
//                     <h2>Register</h2>
//                     <p class="text-center">Registration form coming soon...</p>
//                     <button class="btn btn-secondary btn-full" data-navigate="/">
//                         Back to Home
//                     </button>
//                 </div>
//             </div>
//         `;
//     }

//     init() {
//         // Will implement registration logic in next step
//     }
// }