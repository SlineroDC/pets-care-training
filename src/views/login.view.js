// Login view - user authentication
import { AuthService } from '../services/auth.service.js';
import Swal from 'sweetalert2';

export class LoginView {
    constructor() {
        this.authService = new AuthService();
    }

    render() {
        return `
            <div class="view-container">
                <div class="card">
                    <h2>Login</h2>
                    <p class="text-center text-muted mb-3">
                        Enter your credentials to access your account
                    </p>
                    
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="emailOrIdentity">Email or Identity</label>
                            <input 
                                type="text" 
                                id="emailOrIdentity" 
                                name="emailOrIdentity" 
                                required 
                                placeholder="Enter your email or identity"
                                autocomplete="username"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                required 
                                placeholder="Enter your password"
                                autocomplete="current-password"
                            >
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-full">
                            Login
                        </button>
                    </form>
                    
                    <div class="nav-links">
                        <a href="#" data-navigate="/register">Don't have an account? Register</a>
                        <a href="#" data-navigate="/">Back to Home</a>
                    </div>
                    
                    <!-- Demo credentials info -->
                    <div class="mt-3 text-center">
                        <small class="text-muted">
                            <strong>Demo Credentials:</strong><br>
                            Worker: john@petcare.com / worker123<br>
                            Customer: maria@email.com / customer123
                        </small>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        // Set up form submission handler
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const emailOrIdentity = formData.get('emailOrIdentity');
        const password = formData.get('password');
        
        // Basic validation
        if (!emailOrIdentity || !password) {
            await Swal.fire({
                title: 'Validation Error',
                text: 'Please fill in all fields',
                icon: 'warning'
            });
            return;
        }
        
        try {
            // Show loading state
            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            
            // Attempt login
            await this.authService.login(emailOrIdentity, password);
            
            // Redirect to dashboard on success
            // The router will handle the redirect automatically
            window.location.href = '/dashboard';
            
        } catch (error) {
            // Reset button state on error
            const submitBtn = event.target.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
            
            console.error('Login failed:', error);
        }
    }
}







//TEST // Login view - temporary placeholder
// export class LoginView {
//     render() {
//         return `
//             <div class="view-container">
//                 <div class="card">
//                     <h2>Login</h2>
//                     <p class="text-center">Login form coming soon...</p>
//                     <button class="btn btn-secondary btn-full" data-navigate="/">
//                         Back to Home
//                     </button>
//                 </div>
//             </div>
//         `;
//     }

//     init() {
//         // Will implement login logic in next step
//     }
// }