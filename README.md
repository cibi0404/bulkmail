# Bulk Mail

A tool to send bulk emails using a recipient list from an uploaded Excel/CSV file.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, Nodemailer

## Structure
- `/Frontend` - React app for uploading files and composing mail
- `/Backend` - Express server handling mail sending via Gmail SMTP

## Setup
1. `cd Backend && npm install`
2. Create a `.env` file with `GMAIL_USER` and `GMAIL_APP_PASS`
3. `node index.js`
4. `cd Frontend && npm install && npm run dev`
