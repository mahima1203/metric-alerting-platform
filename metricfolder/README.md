# Metric Alerting Platform Setup Instructions

This project consists of two separate Next.js applications: a **Backend** (API & DB) and a **Frontend** (Dashboard).

## Prerequisites

- Node.js installed
- PostgreSQL installed and running locally

## 1. Database Setup

1.  Connect to your PostgreSQL instance.
2.  Create a database named `metric_db`:
    ```sql
    CREATE DATABASE metric_db;
    ```
3.  Run the initialization script located in `backend/scripts/init-db.sql` to create the necessary tables.

## 2. Backend Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  (Optional) Update the database connection string in `lib/db.ts` if your PostgreSQL credentials are different (default: `postgres://postgres:postgres@localhost:5432/metric_db`).
3.  Start the backend development server:
    ```bash
    npm run dev
    ```
    The backend will run on [http://localhost:3000](http://localhost:3000).

## 3. Frontend Setup

1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Start the frontend development server:
    ```bash
    npm run dev -- -p 3001
    ```
    The frontend will run on [http://localhost:3001](http://localhost:3001).

## 5. Troubleshooting (Database Connection)

If you see an **Internal Server Error (500)** or **Connection Error** on the dashboard:

1.  **Check if PostgreSQL is running**: 
    - Windows: Check "Services" app for `postgresql-x64-xx`.
    - Mac/Linux: `sudo service postgresql status` or `brew services list`.
2.  **Verify Database Exists**:
    ```bash
    psql -U postgres -c "CREATE DATABASE metric_db;"
    ```
3.  **Check Credentials**: Open `backend/lib/db.ts` and ensure the connection string matches your setup:
    - Default: `postgres://postgres:postgres@localhost:5432/metric_db`
    - Format: `postgres://[user]:[password]@[host]:[port]/[database]`
4.  **Run Tables Script**: Ensure tables are created:
    ```bash
    psql -U postgres -d metric_db -f backend/scripts/init-db.sql
    ```
