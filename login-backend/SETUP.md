# PostgreSQL Setup Guide

## Prerequisites
1. PostgreSQL installed on your system
2. PostgreSQL service running

## Setup Steps

### 1. Install PostgreSQL (if not installed)
- Download from: https://www.postgresql.org/download/windows/
- Or use: `winget install PostgreSQL.PostgreSQL`
- During installation, note your postgres user password

### 2. Start PostgreSQL Service
- Open Services (Win + R, type `services.msc`)
- Find "postgresql-x64-XX" (where XX is your version)
- Right-click → Start (if not running)

Or via command line:
```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# Start PostgreSQL service (adjust service name as needed)
Start-Service -Name postgresql-x64-16
```

### 3. Create the Database
Open pgAdmin or psql and run:
```sql
CREATE DATABASE login_db;
```

Or via command line:
```powershell
# Default connection
psql -U postgres

# Then in psql:
CREATE DATABASE login_db;
\q
```

### 4. Create .env File
Create a `.env` file in the `login-backend` directory with:
```
JWT_SECRET=your-secret-key-change-in-production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=login_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
```

Replace `your_postgres_password_here` with your actual PostgreSQL password.

### 5. Test Connection
Start your backend server:
```powershell
cd login-backend
npm start
```

The server will automatically create the `users` table on first startup.

## Troubleshooting

### Connection Refused
- Verify PostgreSQL service is running
- Check DB_HOST and DB_PORT in .env match your PostgreSQL config
- Default PostgreSQL port is 5432

### Authentication Failed
- Verify DB_USER and DB_PASSWORD in .env are correct
- Check PostgreSQL user permissions

### Database Doesn't Exist
- Create the database: `CREATE DATABASE login_db;`
- Or change DB_NAME in .env to an existing database

