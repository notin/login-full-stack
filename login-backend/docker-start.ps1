# PowerShell script to start PostgreSQL with Docker

Write-Host "Starting PostgreSQL with Docker..." -ForegroundColor Green

# Check if Docker is running
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start PostgreSQL
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database Details:" -ForegroundColor Cyan
    Write-Host "  Host: localhost"
    Write-Host "  Port: 5432"
    Write-Host "  Database: login_db"
    Write-Host "  User: postgres"
    Write-Host "  Password: postgres"
    Write-Host ""
    Write-Host "Now create your .env file with these credentials." -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to start PostgreSQL" -ForegroundColor Red
}

