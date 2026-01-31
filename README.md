# Themenbrett – Frontend

This repository contains the frontend of the **Themenbrett** application.  
The app allows users to browse and manage topic areas and thesis topics through a simple web interface.

The frontend is built with React and communicates with a separate backend API.

## Features

- View topic areas
- View and manage topics
- Create new topics
- User login and logout
- Admin functionality for managing content

## Tech Stack

- React
- TypeScript
- React Router
- Bootstrap / React Bootstrap
- Vite
- GitHub Pages for deployment

## Local Development

### Install dependencies

First, install all required dependencies:

```bash
npm install
```

### Start development server

To start the application locally in development mode, run:

```bash
npm run dev
```

This command launches a local development server. The application automatically reloads in the browser whenever source files change, making development easier.

After starting the server, the application is usually available at:

```
http://localhost:5173
```

Open this address in your browser to use the application locally.

## Build for Production

To create a production-ready build, run:

```bash
npm run build
```

This generates optimized static files inside the `dist/` folder, which can then be deployed to a web server or GitHub Pages.

## Deployment

The frontend is automatically deployed to **GitHub Pages** using GitHub Actions whenever changes are pushed to the main branch.

## Configuration

The application expects the following environment variables during build:

| Variable | Description |
|-----------|------------|
| VITE_API_SERVER_URL | Backend API URL |
| VITE_REAL_FETCH | Enables real API requests |
| VITE_BASE_PATH | Base path used for GitHub Pages |

Example configuration:

```
VITE_API_SERVER_URL=https://backend.example.com
VITE_REAL_FETCH=true
VITE_BASE_PATH=/themenbrett-frontend/
```

## Notes

Authentication is handled by the backend using secure cookies. The frontend automatically includes them in requests.

---

This project was created as part of a university course project.