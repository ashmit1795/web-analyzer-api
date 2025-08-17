import { analyzeAndStoreWebsite, getWebsites, getWebsiteById, updateWebsiteById, deleteWebsiteById } from "../services/website.service.js";
import { z } from "zod";

// Schema for analyzing a website
const analyzeBodySchema = z.object({
	url: z.string().url(),
	enhance: z.boolean().optional(),
});

// Controller for analyzing a website
const analyzeWebsite = async (req, res) => {
	try {
		const { url, enhance } = analyzeBodySchema.parse(req.body);

		const result = await analyzeAndStoreWebsite(url, { enhance: !!enhance });
        return res.status(201).json(result);
	} catch (err) {
		// Map known error codes to HTTP status
		if (err.code === "PRIVATE_URL") {
			return res.status(400).json({ error: { type: "private_url", message: err.message } });
		}
		if (err.code === "TIMEOUT") {
			return res.status(504).json({ error: { type: "timeout", message: err.message } });
		}
		if (err.code === "ENOTFOUND") {
			return res.status(502).json({ error: { type: "host_not_found", message: err.message } });
		}
		if (err.name === "ZodError" || (err instanceof Error && err.message.includes("Invalid url"))) {
			return res.status(400).json({ error: { type: "validation", message: err.message } });
        }
        if (err.code === "ERR_NON_2XX_3XX_RESPONSE") {
            return res.status(502).json({ error: { type: "bad_response", message: err.message } });
        }
		return res.status(500).json({ error: { type: "internal", message: "Internal server error" } });
	}
};

// Controller for getting all websites
const getAllWebsites = async (req, res) => {
	try {
		const { q, limit, offset } = req.query;
		const items = await getWebsites({ q, limit: limit ?? 50, offset: offset ?? 0 });
		res.json({ success: true, data: items });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: { message: err?.meta?.cause || "Failed to fetch websites" } });
	}
};

// Controller for getting a website by ID
const getWebsite = async (req, res) => {
	try {
		const item = await getWebsiteById(req.params.id);
		if (!item) return res.status(404).json({ error: { message: err?.meta?.cause || "Website not found" } });
		res.json({ success: true, data: item });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: { message: err?.meta?.cause || "Failed to fetch website" } });
	}
};

// Controller for updating a website by ID
const updateWebsite = async (req, res) => {
	try {
		const updated = await updateWebsiteById(req.params.id, req.body);
		res.json({ success: true, data: updated });
	} catch (err) {
		console.error(err.message);
		res.status(400).json({ error: { message: err?.meta?.cause || "Failed to update" } });
	}
};

// Controller for deleting a website by ID
const deleteWebsite = async (req, res) => {
	try {
		await deleteWebsiteById(req.params.id);
		res.json({ success: true, message: "Deleted" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: { message: "Failed to delete" } });
	}
};

// Export all controllers
export {
    analyzeWebsite,
    getAllWebsites,
    getWebsite,
    updateWebsite,
    deleteWebsite
}