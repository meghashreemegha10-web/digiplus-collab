@echo off
title Global Digi Pulse Server
echo Starting Global Digi Pulse Server...
cd /d "%~dp0"
node server/paymentServer.js
pause
