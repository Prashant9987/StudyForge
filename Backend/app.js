import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();


app.use(cors({
    origin: [
        'http://127.0.0.1:5500',
        'http://127.0.0.1:5501',
        'http://localhost:5500',
        'http://localhost:5501'
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
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
import studyGroupRoutes from './routes/studyGroup.routes.js';

app.use("/api/user", userRoutes);
app.use("/api/study-groups", studyGroupRoutes);

export {app};

