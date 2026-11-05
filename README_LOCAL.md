# Global Digi Pulse - Portable Local Package

This package contains the updated localhost application with:

- Animated landing page and floating hero platform tiles
- Five-step signup, login, courses, payment, and unlocked-course demo
- DOM-driven fake cursor walkthrough with responsive target positioning
- UPI checkout and animated QR payment-success confirmation
- Scroll-triggered loading animations
- Express server with a local JSON fallback when MongoDB is unavailable

## Requirements

- Node.js 18 or newer
- npm 9 or newer

MongoDB, Razorpay, and email credentials are optional for local visual testing.
When MongoDB is unavailable, the server uses `server/data/users.json`.

## Run on Windows

Double-click:

```text
START_LOCAL_WINDOWS.bat
```

Or run:

```powershell
npm ci
npm start
```

Open `http://localhost:3000`.

## Run on macOS/Linux

```bash
chmod +x START_LOCAL_UNIX.sh
./START_LOCAL_UNIX.sh
```

Open `http://localhost:3000`.

## Main Demo

The animated walkthrough is in the Optimization section:

```text
http://localhost:3000/#optimization
```

The cursor starts only when most of the demo stage is visible and centered in
the viewport. Manual user interaction pauses the automated walkthrough.
