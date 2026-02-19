# Hospital Management System - Setup Guide

## Overview
This is a comprehensive hospital management system built with Next.js, MySQL, and TypeScript. It supports three user roles: Admin, Doctor, and Patient.

## Prerequisites
- Node.js 18+ and npm/pnpm
- MySQL 8.0+
- A code editor (VS Code recommended)

## Installation Steps

### 1. Clone/Extract the Project
```bash
cd hospital-management-system
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Database Setup

#### A. MySQL Connection
Create a MySQL database and note your connection credentials:
- Host: `localhost` (or your MySQL server)
- User: `root` (or your MySQL user)
- Password: `your_password`
- Database: `hospital_management`

#### B. Create Environment Variables
Copy `.env.example` to `.env.local` and update with your MySQL credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=hospital_management
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### C. Initialize Database
Run the SQL setup script to create all tables and insert the admin user:

**Option 1: Using MySQL Command Line**
```bash
mysql -u root -p < scripts/setup-db.sql
```

**Option 2: Using MySQL Client/GUI**
Open MySQL Workbench or your preferred MySQL GUI tool and execute the contents of `scripts/setup-db.sql`

### 4. Run the Development Server
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

### Admin Account
- **Email:** `admin@hospital.com`
- **Password:** `admin123`

### Test Patient Account (Optional)
You can create a test patient account through the registration page at `/auth/register`

## System Features

### Admin Panel
- Add new doctors to the system
- View all registered doctors
- Manage doctor profiles
- Dashboard with system statistics

**Admin Access:** `/admin/dashboard`

### Doctor Features
- View scheduled appointments
- Add prescriptions for patients
- View prescription history
- Manage patient consultations

**Doctor Access:** `/doctor/dashboard`

### Patient Features
- Create account and login
- Book appointments with doctors
- View appointment history
- Track prescriptions and medical advice

**Patient Access:** `/patient/dashboard`

## Project Structure
```
/app
  /api - All API endpoints
    /auth - Authentication routes
    /admin - Admin-only endpoints
    /appointments - Appointment management
    /prescriptions - Prescription endpoints
    /doctors - Doctor listing
  /auth - Authentication pages (login, register)
  /admin - Admin dashboard pages
  /doctor - Doctor dashboard pages
  /patient - Patient dashboard pages

/components
  /auth - Authentication components
  /admin - Admin-specific components
  /appointment - Appointment management components
  /navigation - Navigation bars for different roles

/lib
  /db.ts - MySQL database connection
  /auth.ts - JWT token utilities
  /hash.ts - Password hashing utilities
  /validation.ts - Input validation functions

/types
  /index.ts - TypeScript interfaces
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Patient registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users/me` - Get current user info

### Admin
- `POST /api/admin/add-doctor` - Add new doctor
- `GET /api/admin/doctors` - List all doctors

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get user's appointments

### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions` - Get prescriptions

### Doctors
- `GET /api/doctors` - Get all doctors for booking

## Security Features
- Password hashing with bcryptjs
- JWT authentication with secure httpOnly cookies
- Role-based access control
- Input validation on all endpoints
- Parameterized SQL queries to prevent injection

## Database Schema

### Users Table
Central authentication table with roles: patient, doctor, admin

### Patients Table
Stores patient information linked to users

### Doctors Table
Stores doctor details (specialization, fees) linked to users

### Admin Table
Stores admin records linked to users

### Appointments Table
Links patients with doctors for appointments

### Prescriptions Table
Stores prescription details linked to appointments and patients

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD in .env.local
- Verify the database `hospital_management` exists

### JWT Error
- Make sure JWT_SECRET is set in .env.local
- Use a strong, unique secret in production

### Port Already in Use
Change the port by running:
```bash
pnpm dev -- -p 3001
```

### Dependencies Not Installing
Clear cache and reinstall:
```bash
pnpm install --force
# or
npm ci --legacy-peer-deps
```

## Deployment

### To Vercel
1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### To Other Platforms
Ensure the hosting platform supports:
- Node.js 18+
- MySQL database connection
- Environment variables configuration

## Future Enhancements
- Email notifications for appointments
- SMS reminders
- Appointment cancellation/rescheduling
- Patient medical history visualization
- Advanced reporting and analytics
- Payment integration
- Telemedicine consultation support

## Support
For issues or questions, refer to the code comments or contact the development team.

## License
This project is proprietary software for hospital management.
