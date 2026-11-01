@echo off
title Swargatil Konkan Resort - Local Server Launcher
cd /D "%~dp0"

echo =======================================================
echo     Swargatil Konkan Resort - Starting Local Server
echo =======================================================
echo.

:: 1. Check and start XAMPP MySQL if installed
if exist "C:\xampp\mysql\bin\mysqld.exe" (
    echo [1/3] Checking MySQL database...
    "C:\xampp\mysql\bin\mysqladmin.exe" -u root ping >nul 2>&1
    if errorlevel 1 (
        echo       Starting MySQL service via XAMPP...
        start "" /B "C:\xampp\mysql_start.bat"
        timeout /t 3 /nobreak >nul
    ) else (
        echo       MySQL is already active.
    )
) else (
    echo [1/3] Note: Using existing MySQL service.
)

:: 2. Check node_modules
if not exist "node_modules" (
    echo [2/3] Installing dependencies...
    call npm install
) else (
    echo [2/3] Dependencies verified.
)

:: 3. Launch Node.js Server & Open Browser
echo [3/3] Starting Express Web Server...
echo.
echo =======================================================
echo  Server URL:      http://localhost:3000
echo  Website Home:    http://localhost:3000/html/web.html
echo  Admin Dashboard: http://localhost:3000/html/admin.html
echo  Admin Login:     admin / Admin@123
echo =======================================================
echo.
echo Opening browser in 2 seconds... (Press Ctrl+C to stop)
timeout /t 2 /nobreak >nul
start http://localhost:3000/html/web.html

node backend/server.js
pause
