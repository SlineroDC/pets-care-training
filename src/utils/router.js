// SPA Router for handling client-side navigation
import { LandingView } from '../views/landing.view.js';
import { LoginView } from '../views/login.view.js';
import { RegisterView } from '../views/register.view.js';
import { DashboardView } from '../views/dashboard.view.js';
import { NotFoundView } from '../views/404.view.js';
import { AuthService } from '../services/auth.service.js';

export class Router {
    constructor() {
        this.routes = {
            '/': LandingView,
            '/login': LoginView,
            '/register': RegisterView,
            '/dashboard': DashboardView,
            '/404': NotFoundView
        };
        
        this.authService = new AuthService();
        this.currentView = null;
    }

    init() {
        // Handle initial route on page load
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const ViewClass = this.routes[path] || this.routes['/404'];
        
        // Check authentication requirements
        if (this.requiresAuth(path) && !this.authService.isAuthenticated()) {
            this.navigate('/login');
            return;
        }

        // Redirect authenticated users from login/register to dashboard
        if (this.authService.isAuthenticated() && (path === '/login' || path === '/register')) {
            this.navigate('/dashboard');
            return;
        }

        // Render the appropriate view
        this.renderView(ViewClass);
    }

    requiresAuth(path) {
        // Routes that require authentication
        const protectedRoutes = ['/dashboard'];
        return protectedRoutes.includes(path);
    }

    navigate(path) {
        // Update browser history and handle route
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    renderView(ViewClass) {
        // Clean up current view if exists
        if (this.currentView && this.currentView.destroy) {
            this.currentView.destroy();
        }

        // Create and render new view
        this.currentView = new ViewClass();
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = this.currentView.render();
        
        // Initialize view-specific functionality
        if (this.currentView.init) {
            this.currentView.init();
        }
    }
}