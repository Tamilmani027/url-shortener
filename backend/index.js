import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/database.config.js';
import routes from './routes/url.routes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 5000;

connectDB();

app.use('api/auth',routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});