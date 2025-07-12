// 404 Not Found view for invalid routes
export class NotFoundView {
    render() {
        return `
            <div class="view-container">
                <div class="card text-center">
                    <h1>404</h1>
                    <h2>Page Not Found</h2>
                    <p class="text-muted mb-3">
                        The page you're looking for doesn't exist.
                    </p>
                    <button class="btn btn-primary" data-navigate="/">
                        Go Home
                    </button>
                </div>
            </div>
        `;
    }

    init() {
        // No specific initialization needed for 404 page
    }
}