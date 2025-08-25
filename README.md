# 📊 Lead Management System

A full-stack Lead Management System built with **React (frontend)**, **Express (backend)**, and **MongoDB**.  
The system supports secure JWT authentication with httpOnly cookies, CRUD operations for leads, server-side pagination, filtering, and is fully deployed for testing.


## 🔑 Test User Credentials
Use these credentials to log in and test the app:  
- **Email:** `testuser@example.com`  
- **Password:** `Test@1234`  

✅ Leads are pre-seeded for this user and will be visible immediately after login.


## ✨ Features
- **Authentication**
  - Register, Login, Logout
  - JWT-based auth with httpOnly cookies
  - Password hashing (bcrypt)
- **Leads Management (CRUD)**
  - Create, Read, Update, Delete leads
  - Proper status codes for each API
- **Server-Side Pagination & Filtering**
  - Pagination with `page` and `limit` params
  - Filtering with multiple operators:
    - String: equals, contains
    - Enum: equals, in
    - Numbers: equals, gt, lt, between
    - Dates: on, before, after, between
    - Boolean: equals
- **Frontend**
  - ReactJS with a grid/table for leads
  - Server-driven pagination & filters
  - Lead Create/Edit form


## 📂 Tech Stack
- **Frontend:** ReactJS, ViteJS, Tailwind CSS, AG Grid  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB 
- **Authentication:** JWT + httpOnly Cookies, bcrypt  
- **Deployment:** Vercel (frontend), Render (backend)


## 🛠️ Local Development Setup

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/lead-management-system.git
cd lead-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder.

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, then:

```bash
cd frontend
npm install
```

If needed, update the API base URL in your `.env` or config file.

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal). Make sure the backend is running for full functionality.