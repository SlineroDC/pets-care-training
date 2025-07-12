// Landing page view - main entry point for the application
import { AuthService } from '../services/auth.service.js';

export class LandingView {
    constructor() {
        this.authService = new AuthService();
    }

    render() {
        const currentUser = this.authService.getCurrentUser();
        
        return `
            <div class="view-container">
                <div class="card">
                    <h1>🐾 Pet Care Center</h1>
                    <p class="text-center mb-3">
                        Welcome to our professional pet care center! 
                        We provide loving care for your furry friends while you're away.
                    </p>
                    
                    ${currentUser ? this.renderAuthenticatedContent(currentUser) : this.renderGuestContent()}
                </div>
            </div>
        `;
    }

    renderAuthenticatedContent(user) {
        return `
            <div class="text-center">
                <h3>Welcome back, ${user.nombre}!</h3>
                <p class="text-muted mb-3">Role: ${user.role}</p>
                <button class="btn btn-primary btn-full" data-navigate="/dashboard">
                    Go to Dashboard
                </button>
                <div class="nav-links">
                    <button class="btn btn-secondary" onclick="this.handleLogout()">
                        Logout
                    </button>
                </div>
            </div>
        `;
    }

    renderGuestContent() {
        return `
            <div class="text-center">
                <h3>Get Started</h3>
                <p class="text-muted mb-3">Please login or register to access our services</p>
                <button class="btn btn-primary btn-full mb-2" data-navigate="/login">
                    Login
                </button>
                <button class="btn btn-secondary btn-full" data-navigate="/register">
                    Register as Customer
                </button>
            </div>
        `;
    }

    init() {
        // Set up event listeners for the landing page
        const logoutBtn = document.querySelector('[onclick="this.handleLogout()"]');
        if (logoutBtn) {
            logoutBtn.onclick = () => this.handleLogout();
        }
    }

    handleLogout() {
        this.authService.logout();
        // Reload the page to refresh the view
        window.location.reload();
    }
}