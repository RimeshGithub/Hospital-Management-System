-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Users table (authentication table)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  patient_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  gender VARCHAR(50),
  contact_info VARCHAR(255),
  dob DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  doctor_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  specialization VARCHAR(255),
  doctor_fees DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  appointment_id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_date (appointment_date)
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  prescription_id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  diagnosis_info TEXT,
  advice_medicine TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
  INDEX idx_appointment (appointment_id),
  INDEX idx_patient (patient_id)
);

-- Insert pre-registered admin user with email as 'admin@hospital.com' and password as '123456'
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@hospital.com', 
'$2a$10$LdPz8AcWk1nyC6GQbhC6oOo.kpAq7DDKc1V63YRhCaSWLBbU4LASu', 
'admin');

-- Insert admin record using SELECT
INSERT INTO admin (user_id)
SELECT id FROM users 
WHERE email = 'admin@hospital.com'
LIMIT 1;

