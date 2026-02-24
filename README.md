# StudyForge

> **A Collaborative Learning Platform**

StudyForge is a full‑stack web application designed to help students form and manage study groups. The **backend** is built with Node.js, Express and MongoDB while the **frontend** consists of static HTML, CSS and vanilla JavaScript. This repository contains all source code for both sides of the project.

---

## 🚀 Features

- User authentication with JWT (signup & login)
- Create, list and join study groups
- Group metadata: name, subject, description, meeting time, status
- Secure password hashing with bcrypt
- RESTful API endpoints for all operations
- Simple static frontend for demonstration

## 🧱 Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Backend        | Node.js, Express, Mongoose |
| Database       | MongoDB                    |
| Authentication | JSON Web Tokens, bcryptjs  |
| Frontend       | HTML, CSS, JavaScript      |
| Environment    | dotenv                     |
| Utilities      | CORS, cookie-parser        |

## 📁 Project Structure

```
/Backend
  ├── app.js                # Express application setup
  ├── constants.js          # Shared constants (e.g. DB_NAME)
  ├── db/                   # database connection logic
  ├── models/               # Mongoose schemas (User, StudyGroup)
  ├── routes/               # API route definitions
  ├── controllers/          # Request handlers and business logic
  └── utils/                # Custom error/response helpers
/Frontend
  ├── *.html                # Static pages (login, dashboard, etc.)
  ├── css/                  # Stylesheets
  └── images/               # Assets used in pages
README.md                   # This documentation
```

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- MongoDB instance (local or cloud)
- Optional: Live Server extension to view frontend

### Backend

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your‑username>/studyforge.git
   cd StudyForge/Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file** (`.env`) in `Backend` directory with the following variables:

   ```env
   PORT=8000
   DATABASE_URI=mongodb://localhost:27017      # or your cloud URI
   DB_NAME=CSP                               # database name used in constants.js
   ACCESS_TOKEN_SECRET=<your-secret-key>
   REFRESH_TOKEN_SECRET=<your-refresh-secret>
   ACCESS_TOKEN_EXPIRY=15m                   # or desired value
   REFRESH_TOKEN_EXPIRY=7d                   # or desired value
   ```

4. **Run the server**

   ```bash
   npm run dev     # uses nodemon with dotenv
   # or
   node index.js
   ```

   The server will start at `http://localhost:8000` and expose the following endpoints:
   - `POST /api/user/signUp` – register a new user
   - `POST /api/user/login` – login and receive tokens
   - `POST /api/study-groups/create` – create a group
   - `GET /api/study-groups/all` – list groups
   - `POST /api/study-groups/join/:groupId` – join by ID
   - `GET /api/study-groups/:groupId` – fetch group details

   (All study‑group routes assume JWT authentication middleware will attach `req.user` – this is stubbed in the current code.)

### Frontend

The frontend is purely static; open any of the `.html` files directly in your browser or host them using a simple HTTP server (e.g. VS Code Live Server). The pages demonstrate UI for login, dashboard and group interaction. Adjust API URLs in the JavaScript if the backend is hosted elsewhere.

## 🛠 Development Workflow

1. Work on backend logic inside `controllers/` and add routes in `routes/`.
2. Use `models/` to define or update MongoDB schemas.
3. Restart server automatically with `npm run dev` during development.
4. Frontend changes are in the `Frontend` folder; refresh browser to see updates.

## 📦 Deployment Notes

- Build and deploy the backend on any Node‑compatible host (Heroku, DigitalOcean, etc.).
- Ensure environment variables are set in the production environment.
- Use a managed MongoDB service (Atlas) for production data.
- Serve frontend as static files via a CDN or web server.

## 🧾 Additional Information

- **Error handling** is implemented via `Apierrors.js` and `Apiresponses.js`.
- **Authentication** tokens are stored in secure HTTP-only cookies by default.
- The `models/user.js` includes helper methods for hashing and token generation.

---

Feel free to contribute improvements or adapt StudyForge for your own educational needs!

---

_Last updated: February 24, 2026_
