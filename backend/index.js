import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/database.config.js';
import routes from './routes/url.routes.js';
import statsRoutes from './routes/stats.routes.js';
import cors from 'cors';
import { redirectToOriginalUrl } from './controllers/url.controllers.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 5000;

app.use('/api',routes);
app.use('/api',statsRoutes);
app.get('/:shortCode', redirectToOriginalUrl);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

startServer();