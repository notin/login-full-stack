# Quick Start Guide - PostgreSQL Setup

## Option 1: Install PostgreSQL (Recommended for Production)

### Windows Installation:
1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Or use winget: `winget install PostgreSQL.PostgreSQL`
   - Download and run the installer

2. **During Installation:**
   - Note the password you set for the `postgres` superuser
   - Default port is 5432 (keep this)
   - Installation directory is usually `C:\Program Files\PostgreSQL\XX\` (XX = version)

3. **After Installation:**
   - PostgreSQL service should start automatically
   - Verify with: Open Services app → Look for `postgresql-x64-XX`

4. **Create Database:**
   ```powershell
   # Open PowerShell as Administrator
   cd "C:\Program Files\PostgreSQL\16\bin"
   .\psql.exe -U postgres
   # Enter your password when prompted
   # Then in psql:
   CREATE DATABASE login_db;
   \q
   ```

5. **Create .env file in login-backend directory:**
   ```
   JWT_SECRET=your-secret-key-change-in-production
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=login_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   ```

## Option 2: Use Docker (Easiest for Development)

1. **Install Docker Desktop:** https://www.docker.com/products/docker-desktop/

2. **Run PostgreSQL in Docker:**
   ```powershell
   docker run --name login-postgres `
     -e POSTGRES_PASSWORD=postgres `
     -e POSTGRES_DB=login_db `
     -p 5432:5432 `
     -d postgres:16
   ```

3. **Create .env file:**
   ```
   JWT_SECRET=your-secret-key-change-in-production
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=login_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

## Option 3: Use SQLite (Simplest, No Setup Required)

If you want to avoid PostgreSQL setup entirely, I can convert the backend to use SQLite instead. Just let me know!

## Verify Installation

After setup, test your connection:
```powershell
# If PostgreSQL is installed
psql -U postgres -h localhost -d login_db

# If using Docker
docker exec -it login-postgres psql -U postgres -d login_db
```

If you can connect, you're ready! Start your backend:
```powershell
cd login-backend
npm start
```

