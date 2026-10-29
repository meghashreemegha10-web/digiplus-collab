@echo off
title Global Digi Pulse Server
echo Starting Global Digi Pulse Server...
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\node;%ProgramFiles%\nodejs;%PATH%"
node server/paymentServer.js
pause
