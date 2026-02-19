# Hospital Management System - Setup Guide

## Overview
This is a comprehensive hospital management system built with Next.js, MySQL, and TypeScript. It supports three user roles: Admin, Doctor, and Patient.

## Prerequisites
- Node.js 18+ and npm/pnpm
- MySQL 8.0+ or XAMPP
- A code editor (VS Code recommended)

## Installation Steps

### 1. Clone/Extract the Project
```bash
cd to-project-directory
```

### 2. Install Dependencies
```bash
npx pnpm install
# or
npm install
```

### 3. Database Setup

#### A. MySQL Connection
For XAMPP:
- Open XAMPP
- Start Apache and MySQL
- Goto http://localhost/phpmyadmin/ in browser
- Create new Database: `hms`
- Inside that Database click `Import` button
- Choose the file to import: select the file named `setup-db.sql` under `scripts` folder
- Click `Import` button

#### B. Create Environment Variables
Create a file named `.env.local` and include the following:
```bash
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=hms
JWT_SECRET=supersecretkey123
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

### Admin Account
- **Email:** `admin@hospital.com`
- **Password:** `123456`

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
