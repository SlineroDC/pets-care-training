// Main application entry point
import { Router } from './utils/router.js';
import { AuthService } from './services/auth.service.js';
import './styles/main.css';

// Initialize the application
class App {
    constructor() {
        this.router = new Router();
        this.authService = new AuthService();
        this.init();
    }

    async init() {
        // Check for existing session on app start
        const currentUser = this.authService.getCurrentUser();
        
        // Initialize router and handle initial route
        this.router.init();
        
        // Set up navigation event listeners
        this.setupNavigation();
        
        console.log('Pet Care SPA initialized');
        if (currentUser) {
            console.log('User session found:', currentUser.nombre);
        }
    }

    setupNavigation() {
        // Handle browser back/forward navigation
        window.addEventListener('popstate', () => {
            this.router.handleRoute();
        });

        // Handle navigation clicks (for future navigation links)
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-navigate]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-navigate');
                this.router.navigate(route);
            }
        });
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});