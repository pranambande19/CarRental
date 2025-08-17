# Car Rental System

A full-stack car rental system built with Angular 19 and Node.js.

## Features

- User authentication (register/login)
- Browse available cars
- View car details
- Book cars for specific dates
- Responsive design with Bootstrap

## Tech Stack

**Frontend:**
- Angular 19
- Bootstrap 5
- TypeScript

**Backend:**
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (Latest LTS)
- MySQL Server
- Angular CLI

### Database Setup
1. Create MySQL database: `car_rental_db`
2. Run the SQL scripts in `/database` folder

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev# CarRental
