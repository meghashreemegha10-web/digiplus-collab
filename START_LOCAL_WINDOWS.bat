@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer is required.
  echo Download it from https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm ci
  if errorlevel 1 exit /b 1
)

echo Starting Global Digi Pulse at http://localhost:3000
call npm start
