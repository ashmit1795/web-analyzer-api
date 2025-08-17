import express from "express";
import cors from "cors";
import helmet from "helmet";
import websiteRouter from "./routes/website.routes.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

export const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Arcjet middleware for security and rate limiting
app.use(arcjetMiddleware);


// Routes
app.use("/api/v1", websiteRouter);

// Health check route
app.get("/", (req, res) => {
	res.json({ message: "Web Analyzer API is running" });
});
