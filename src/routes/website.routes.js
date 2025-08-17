import { Router } from "express";
import { analyzeWebsite, getAllWebsites, updateWebsite, deleteWebsite, getWebsite } from "../controllers/website.controller.js";

const websiteRouter = Router();

// Route for analyzing a website
websiteRouter.post("/analyze", analyzeWebsite);

// Routes for basic website CRUD operations
websiteRouter.get("/websites", getAllWebsites);
websiteRouter.get("/websites/:id", getWebsite);
websiteRouter.put("/websites/:id", updateWebsite);
websiteRouter.delete("/websites/:id", deleteWebsite);

// Export the router
export default websiteRouter;
