import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors({
    origin: "https://study-forge-puce.vercel.app",
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
}));
  
  app.use(express.json({ limit: "20kb" }));
  app.use(express.urlencoded({ extended: true, limit: "20kb" }));
  app.use(express.static("public"));
  app.use(cookieParser());
// Sample route for user login

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/about', (req, res) => {
    res.send('About Us');
});

import userRoutes from './routes/user.routes.js';
app.use("/api/user", userRoutes);

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

export {app};

