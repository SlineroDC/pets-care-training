// Dashboard view with role-based interfaces
import { ApiService } from '../services/api.service.js';
import { AuthService } from '../services/auth.service.js';
import Swal from 'sweetalert2';

export class DashboardView {
    constructor() {
        this.apiService = new ApiService();
        this.authService = new AuthService();
        this.currentUser = this.authService.getCurrentUser();
    }

    render() {
        if (!this.currentUser) {
            return `
                <div class="view-container">
                    <div class="card">
                        <h2>Access Denied</h2>
                        <p>Please login to access the dashboard</p>
                        <button class="btn btn-primary" data-navigate="/login">Login</button>
                    </div>
                </div>
            `;
        }

        const headerHtml = `
            <div class="dashboard-header">
                <h1>Welcome, ${this.currentUser.nombre}</h1>
                <p>Role: ${this.currentUser.role}</p>
                <button class="btn btn-secondary" id="logout-btn">Logout</button>
            </div>
        `;

        if (this.currentUser.role === 'customer') {
            return `
                <div class="view-container">
                    ${headerHtml}
                    ${this.renderCustomerDashboard()}
                </div>
            `;
        } else if (this.currentUser.role === 'worker') {
            return `
                <div class="view-container">
                    ${headerHtml}
                    ${this.renderWorkerDashboard()}
                </div>
            `;
        }
    }

    renderCustomerDashboard() {
        return `
            <div class="dashboard-content">
                <div class="dashboard-actions">
                    <button class="btn btn-primary" id="add-pet-btn">Add New Pet</button>
                    <button class="btn btn-secondary" id="edit-profile-btn">Edit Profile</button>
                </div>
                
                <div class="dashboard-section">
                    <h2>My Pets</h2>
                    <div id="pets-list">
                        <div class="loading">Loading pets...</div>
                    </div>
                </div>
            </div>

            <!-- Add Pet Modal -->
            <div id="add-pet-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Add New Pet</h3>
                    <form id="add-pet-form">
                        <input type="text" id="pet-name" placeholder="Pet Name" required>
                        <input type="number" id="pet-weight" placeholder="Weight (kg)" step="0.1" required>
                        <input type="number" id="pet-age" placeholder="Age" required>
                        <input type="text" id="pet-breed" placeholder="Breed" required>
                        <textarea id="pet-notes" placeholder="Notes (optional)"></textarea>
                        <select id="pet-temperament" required>
                            <option value="">Select Temperament</option>
                            <option value="Calm">Calm</option>
                            <option value="Active">Active</option>
                            <option value="Aggressive">Aggressive</option>
                            <option value="Shy">Shy</option>
                            <option value="Friendly">Friendly</option>
                        </select>
                        <button type="submit" class="btn btn-primary">Add Pet</button>
                    </form>
                </div>
            </div>

            <!-- Edit Pet Modal -->
            <div id="edit-pet-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Edit Pet</h3>
                    <form id="edit-pet-form">
                        <input type="hidden" id="edit-pet-id">
                        <input type="text" id="edit-pet-name" placeholder="Pet Name" required>
                        <input type="number" id="edit-pet-weight" placeholder="Weight (kg)" step="0.1" required>
                        <input type="number" id="edit-pet-age" placeholder="Age" required>
                        <input type="text" id="edit-pet-breed" placeholder="Breed" required>
                        <textarea id="edit-pet-notes" placeholder="Notes (optional)"></textarea>
                        <select id="edit-pet-temperament" required>
                            <option value="Calm">Calm</option>
                            <option value="Active">Active</option>
                            <option value="Aggressive">Aggressive</option>
                            <option value="Shy">Shy</option>
                            <option value="Friendly">Friendly</option>
                        </select>
                        <button type="submit" class="btn btn-primary">Update Pet</button>
                    </form>
                </div>
            </div>

            <!-- Edit Profile Modal -->
            <div id="edit-profile-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Edit Profile</h3>
                    <form id="edit-profile-form">
                        <input type="text" id="profile-nombre" placeholder="Full Name" required>
                        <input type="text" id="profile-identidad" placeholder="Identity Document" required>
                        <input type="tel" id="profile-telefono" placeholder="Phone Number" required>
                        <input type="text" id="profile-direccion" placeholder="Address" required>
                        <input type="email" id="profile-email" placeholder="Email" required>
                        <input type="password" id="profile-contrasena" placeholder="New Password (leave empty to keep current)">
                        <button type="submit" class="btn btn-primary">Update Profile</button>
                    </form>
                </div>
            </div>
        `;
    }

    renderWorkerDashboard() {
        return `
            <div class="dashboard-content">
                <div class="dashboard-tabs">
                    <button class="tab-btn active" data-tab="pets">All Pets</button>
                    <button class="tab-btn" data-tab="stays">Stays</button>
                    <button class="tab-btn" data-tab="users">Users</button>
                </div>

                <div id="pets-tab" class="tab-content active">
                    <h2>All Pets</h2>
                    <div id="all-pets-list">
                        <div class="loading">Loading pets...</div>
                    </div>
                </div>

                <div id="stays-tab" class="tab-content">
                    <h2>Pet Stays</h2>
                    <button class="btn btn-primary" id="add-stay-btn">Create New Stay</button>
                    <div id="stays-list">
                        <div class="loading">Loading stays...</div>
                    </div>
                </div>

                <div id="users-tab" class="tab-content">
                    <h2>All Users</h2>
                    <div id="users-list">
                        <div class="loading">Loading users...</div>
                    </div>
                </div>
            </div>

            <!-- Add Stay Modal -->
            <div id="add-stay-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Create New Stay</h3>
                    <form id="add-stay-form">
                        <select id="stay-pet" required>
                            <option value="">Select Pet</option>
                        </select>
                        <input type="date" id="stay-checkin" required>
                        <input type="date" id="stay-checkout" required>
                        <input type="number" id="stay-daily-rate" placeholder="Daily Rate" required>
                        <div class="services-section">
                            <h4>Additional Services</h4>
                            <label><input type="checkbox" value="Bath"> Bath</label>
                            <label><input type="checkbox" value="Grooming"> Grooming</label>
                            <label><input type="checkbox" value="Training"> Training</label>
                            <label><input type="checkbox" value="Veterinary"> Veterinary</label>
                        </div>
                        <div id="stay-total-preview">
                            <strong>Total Cost: $0</strong>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Stay</button>
                    </form>
                </div>
            </div>
        `;
    }

    async init() {
        if (!this.currentUser) return;

        this.setupEventListeners();
        await this.loadDashboardData();
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.authService.logout();
            window.router.href('/');
          
        });

        if (this.currentUser.role === 'customer') {
            this.setupCustomerEvents();
        } else if (this.currentUser.role === 'worker') {
            this.setupWorkerEvents();
        }
    }

    setupCustomerEvents() {
        // Add pet button
        document.getElementById('add-pet-btn')?.addEventListener('click', () => {
            document.getElementById('add-pet-modal').style.display = 'block';
        });

        // Edit profile button
        document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
            this.openEditProfileModal();
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Add pet form
        document.getElementById('add-pet-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPet();
        });

        // Edit pet form
        document.getElementById('edit-pet-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePet();
        });

        // Edit profile form
        document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });
    }

    setupWorkerEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Add stay button
        document.getElementById('add-stay-btn')?.addEventListener('click', () => {
            this.openAddStayModal();
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Add stay form
        document.getElementById('add-stay-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStay();
        });

        // Stay cost calculation
        const checkinInput = document.getElementById('stay-checkin');
        const checkoutInput = document.getElementById('stay-checkout');
        const dailyRateInput = document.getElementById('stay-daily-rate');

        if (checkinInput && checkoutInput && dailyRateInput) {
            [checkinInput, checkoutInput, dailyRateInput].forEach(input => {
                input.addEventListener('change', () => this.calculateStayTotal());
            });
        }
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Load data for the selected tab
        if (tabName === 'stays') {
            this.loadStays();
        } else if (tabName === 'users') {
            this.loadUsers();
        }
    }

    async loadDashboardData() {
        if (this.currentUser.role === 'customer') {
            await this.loadCustomerPets();
        } else if (this.currentUser.role === 'worker') {
            await this.loadAllPets();
        }
    }

    async loadCustomerPets() {
        try {
            const pets = await this.apiService.get(`/pets?userId=${this.currentUser.id}`);
            this.renderPetsList(pets, 'pets-list', true);
        } catch (error) {
            console.error('Error loading pets:', error);
        }
    }

    async loadAllPets() {
        try {
            const pets = await this.apiService.get('/pets');
            const users = await this.apiService.get('/users');
            
            // Add owner information to pets
            const petsWithOwners = pets.map(pet => ({
                ...pet,
                owner: users.find(user => user.id == pet.userId)
            }));

            this.renderPetsList(petsWithOwners, 'all-pets-list', false);
        } catch (error) {
            console.error('Error loading pets:', error);
        }
    }

    async loadStays() {
        try {
            const stays = await this.apiService.get('/stays');
            const pets = await this.apiService.get('/pets');
            
            const staysWithPets = stays.map(stay => ({
                ...stay,
                pet: pets.find(pet => pet.id == stay.petId)
            }));

            this.renderStaysList(staysWithPets);
        } catch (error) {
            console.error('Error loading stays:', error);
        }
    }

    async loadUsers() {
        try {
            const users = await this.apiService.get('/users');
            const roles = await this.apiService.get('/roles');
            
            const usersWithRoles = users.map(user => ({
                ...user,
                roleName: roles.find(role => role.id == user.rolId)?.name
            }));

            this.renderUsersList(usersWithRoles);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    renderPetsList(pets, containerId, isCustomer) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (pets.length === 0) {
            container.innerHTML = '<p>No pets found</p>';
            return;
        }

        const petsHtml = pets.map(pet => `
            <div class="pet-card">
                <h3>${pet.nombre}</h3>
                <p><strong>Breed:</strong> ${pet.raza}</p>
                <p><strong>Age:</strong> ${pet.edad} years</p>
                <p><strong>Weight:</strong> ${pet.peso} kg</p>
                <p><strong>Temperament:</strong> ${pet.temperamento}</p>
                ${pet.anotaciones ? `<p><strong>Notes:</strong> ${pet.anotaciones}</p>` : ''}
                ${!isCustomer ? `<p><strong>Owner:</strong> ${pet.owner?.nombre || 'Unknown'}</p>` : ''}
                
                ${isCustomer ? `
                    <div class="pet-actions">
                        <button class="btn btn-sm btn-primary" onclick="window.dashboard.editPet(${pet.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="window.dashboard.deletePet(${pet.id})">Delete</button>
                    </div>
                ` : ''}
            </div>
        `).join('');

        container.innerHTML = petsHtml;
    }

    renderStaysList(stays) {
        const container = document.getElementById('stays-list');
        if (!container) return;

        if (stays.length === 0) {
            container.innerHTML = '<p>No stays found</p>';
            return;
        }

        const staysHtml = stays.map(stay => {
            const totalCost = this.calculateStayCost(stay.ingreso, stay.salida, stay.valorDia);
            return `
                <div class="stay-card">
                    <h3>${stay.pet?.nombre || 'Unknown Pet'}</h3>
                    <p><strong>Check-in:</strong> ${stay.ingreso}</p>
                    <p><strong>Check-out:</strong> ${stay.salida}</p>
                    <p><strong>Daily Rate:</strong> $${stay.valorDia.toLocaleString()}</p>
                    <p><strong>Total Cost:</strong> $${totalCost.toLocaleString()}</p>
                    <p><strong>Status:</strong> ${stay.completada ? 'Completed' : 'Active'}</p>
                    ${stay.serviciosAdicionales?.length > 0 ? `
                        <p><strong>Additional Services:</strong> ${stay.serviciosAdicionales.join(', ')}</p>
                    ` : ''}
                    
                    <div class="stay-actions">
                        <button class="btn btn-sm btn-primary" onclick="window.dashboard.editStay(${stay.id})">Edit</button>
                        ${!stay.completada ? `
                            <button class="btn btn-sm btn-success" onclick="window.dashboard.completeStay(${stay.id})">Complete</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = staysHtml;
    }

    renderUsersList(users) {
        const container = document.getElementById('users-list');
        if (!container) return;

        const usersHtml = users.map(user => `
            <div class="user-card">
                <h3>${user.nombre}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.telefono}</p>
                <p><strong>Role:</strong> ${user.roleName}</p>
                <p><strong>Address:</strong> ${user.direccion}</p>
            </div>
        `).join('');

        container.innerHTML = usersHtml;
    }

    async addPet() {
        try {
            const petData = {
                nombre: document.getElementById('pet-name').value,
                peso: parseFloat(document.getElementById('pet-weight').value),
                edad: parseInt(document.getElementById('pet-age').value),
                raza: document.getElementById('pet-breed').value,
                anotaciones: document.getElementById('pet-notes').value,
                temperamento: document.getElementById('pet-temperament').value,
                userId: this.currentUser.id
            };

            await this.apiService.post('/pets', petData);
            
            Swal.fire('Success!', 'Pet added successfully', 'success');
            document.getElementById('add-pet-modal').style.display = 'none';
            document.getElementById('add-pet-form').reset();
            
            // Reload pets list to show the new pet with edit/delete buttons
            await this.loadCustomerPets();
        } catch (error) {
            Swal.fire('Error!', 'Failed to add pet', 'error');
        }
    }

    async openEditProfileModal() {
        // Fill the form with current user data
        document.getElementById('profile-nombre').value = this.currentUser.nombre;
        document.getElementById('profile-identidad').value = this.currentUser.identidad;
        document.getElementById('profile-telefono').value = this.currentUser.telefono;
        document.getElementById('profile-direccion').value = this.currentUser.direccion;
        document.getElementById('profile-email').value = this.currentUser.email;
        document.getElementById('profile-contrasena').value = ''; // Keep empty for security
        
        document.getElementById('edit-profile-modal').style.display = 'block';
    }

    async updateProfile() {
        try {
            const profileData = {
                nombre: document.getElementById('profile-nombre').value,
                identidad: document.getElementById('profile-identidad').value,
                telefono: document.getElementById('profile-telefono').value,
                direccion: document.getElementById('profile-direccion').value,
                email: document.getElementById('profile-email').value,
                rolId: this.currentUser.rolId
            };

            // Only update password if a new one is provided
            const newPassword = document.getElementById('profile-contrasena').value;
            if (newPassword) {
                profileData.contrasena = newPassword;
            } else {
                profileData.contrasena = this.currentUser.contrasena;
            }

            // Check if email or identity already exists (excluding current user)
            const users = await this.apiService.get('/users');
            const existingUser = users.find(u => 
                u.id != this.currentUser.id && 
                (u.email === profileData.email || u.identidad === profileData.identidad)
            );

            if (existingUser) {
                throw new Error('Email or identity already exists');
            }

            await this.apiService.patch(`/users/${this.currentUser.id}`, profileData);
            
            // Update current user in localStorage
            const updatedUser = { ...this.currentUser, ...profileData };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;
            
            // Update the header with new name
            const headerElement = document.querySelector('.dashboard-header h1');
            if (headerElement) {
                headerElement.textContent = `Welcome, ${updatedUser.nombre}`;
            }

            Swal.fire('Success!', 'Profile updated successfully', 'success');
            document.getElementById('edit-profile-modal').style.display = 'none';
            
        } catch (error) {
            Swal.fire('Error!', error.message || 'Failed to update profile', 'error');
        }
    }

    async editPet(petId) {
        try {
            const pet = await this.apiService.get(`/pets/${petId}`);
            
            // Fill the edit form
            document.getElementById('edit-pet-id').value = pet.id;
            document.getElementById('edit-pet-name').value = pet.nombre;
            document.getElementById('edit-pet-weight').value = pet.peso;
            document.getElementById('edit-pet-age').value = pet.edad;
            document.getElementById('edit-pet-breed').value = pet.raza;
            document.getElementById('edit-pet-notes').value = pet.anotaciones || '';
            document.getElementById('edit-pet-temperament').value = pet.temperamento;
            
            document.getElementById('edit-pet-modal').style.display = 'block';
        } catch (error) {
            Swal.fire('Error!', 'Failed to load pet data', 'error');
        }
    }

    async updatePet() {
        try {
            const petId = document.getElementById('edit-pet-id').value;
            const petData = {
                nombre: document.getElementById('edit-pet-name').value,
                peso: parseFloat(document.getElementById('edit-pet-weight').value),
                edad: parseInt(document.getElementById('edit-pet-age').value),
                raza: document.getElementById('edit-pet-breed').value,
                anotaciones: document.getElementById('edit-pet-notes').value,
                temperamento: document.getElementById('edit-pet-temperament').value,
                userId: this.currentUser.id
            };

            await this.apiService.patch(`/pets/${petId}`, petData);
            
            Swal.fire('Success!', 'Pet updated successfully', 'success');
            document.getElementById('edit-pet-modal').style.display = 'none';
            
            await this.loadCustomerPets();
        } catch (error) {
            Swal.fire('Error!', 'Failed to update pet', 'error');
        }
    }

    async deletePet(petId) {
        try {
            // Check if pet has stays
            const stays = await this.apiService.get(`/stays?petId=${petId}`);
            if (stays.length > 0) {
                Swal.fire('Cannot Delete', 'This pet has stays and cannot be deleted', 'warning');
                return;
            }

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await this.apiService.delete(`/pets/${petId}`);
                Swal.fire('Deleted!', 'Pet has been deleted', 'success');
                await this.loadCustomerPets();
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to delete pet', 'error');
        }
    }

    async openAddStayModal() {
        try {
            const pets = await this.apiService.get('/pets');
            const petSelect = document.getElementById('stay-pet');
            
            petSelect.innerHTML = '<option value="">Select Pet</option>';
            pets.forEach(pet => {
                petSelect.innerHTML += `<option value="${pet.id}">${pet.nombre}</option>`;
            });
            
            document.getElementById('add-stay-modal').style.display = 'block';
        } catch (error) {
            Swal.fire('Error!', 'Failed to load pets', 'error');
        }
    }

    calculateStayTotal() {
        const checkin = document.getElementById('stay-checkin').value;
        const checkout = document.getElementById('stay-checkout').value;
        const dailyRate = parseFloat(document.getElementById('stay-daily-rate').value) || 0;
        
        if (checkin && checkout && dailyRate) {
            const total = this.calculateStayCost(checkin, checkout, dailyRate);
            document.getElementById('stay-total-preview').innerHTML = `<strong>Total Cost: $${total.toLocaleString()}</strong>`;
        }
    }

    calculateStayCost(checkin, checkout, dailyRate) {
        const startDate = new Date(checkin);
        const endDate = new Date(checkout);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both days
        return daysDiff * dailyRate;
    }

    async addStay() {
        try {
            const petId = document.getElementById('stay-pet').value;
            const checkin = document.getElementById('stay-checkin').value;
            const checkout = document.getElementById('stay-checkout').value;
            const dailyRate = parseFloat(document.getElementById('stay-daily-rate').value);
            
            // Get additional services
            const serviceCheckboxes = document.querySelectorAll('#add-stay-form input[type="checkbox"]:checked');
            const additionalServices = Array.from(serviceCheckboxes).map(cb => cb.value);
            
            const stayData = {
                petId: parseInt(petId),
                ingreso: checkin,
                salida: checkout,
                valorDia: dailyRate,
                serviciosAdicionales: additionalServices,
                completada: false
            };

            await this.apiService.post('/stays', stayData);
            
            Swal.fire('Success!', 'Stay created successfully', 'success');
            document.getElementById('add-stay-modal').style.display = 'none';
            document.getElementById('add-stay-form').reset();
            
            await this.loadStays();
        } catch (error) {
            Swal.fire('Error!', 'Failed to create stay', 'error');
        }
    }

    async completeStay(stayId) {
        try {
            await this.apiService.patch(`/stays/${stayId}`, { completada: true });
            Swal.fire('Success!', 'Stay completed successfully', 'success');
            await this.loadStays();
        } catch (error) {
            Swal.fire('Error!', 'Failed to complete stay', 'error');
        }
    }
}

// Make dashboard instance globally available for event handlers
window.dashboard = new DashboardView();