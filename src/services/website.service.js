import { z } from "zod";
import prisma from "../prisma/client.js";
import { fetchHtml, extractBrandAndDescription, isPrivateOrLocal } from "../utils/scraper.js";
import enhanceWithAI from "../utils/gemini.js";

// URL validation schema
const urlSchema = z.string().url();

// Normalize URL (ensures protocol present and removes trailing slash)
function normalizeUrl(raw) {
	try {
		const u = new URL(raw);
		// remove trailing slash for consistent upsert
		if (u.pathname === "/") u.pathname = "";
		return u.toString();
	} catch {
		// let zod handle invalid URL
		return raw;
	}
}

// Function to analyze and store website data in the database
async function analyzeAndStoreWebsite(rawUrl, options = { enhance: false }) {

    // Validate URL
	urlSchema.parse(rawUrl); // throws if invalid
	const url = normalizeUrl(rawUrl);

	// Block private/local hosts
	if (isPrivateOrLocal(url)) {
		const err = new Error("Private or local addresses are not allowed");
		err.code = "PRIVATE_URL";
		throw err;
	}

	// Fetch HTML
	let html;
	try {
		const { html: body, statusCode } = await fetchHtml(url, { timeoutMs: 10000 });
		html = body;
	} catch (err) {
		// Normalize common network errors
		if (err.code === "ETIMEDOUT" || err.name === "TimeoutError") {
			const e = new Error("Timeout while fetching the URL");
			e.code = "TIMEOUT";
			throw e;
		}
		if (err.code === "ENOTFOUND") {
			const e = new Error("Host not found");
			e.code = "ENOTFOUND";
			throw e;
		}
		// rethrow otherwise
		throw err;
	}

	// Parse HTML for brand & description
	const { brandName, description } = extractBrandAndDescription(html);

	// Optional AI enhancement
    let finalDescription = description;
    let isEnhanced = false;
	if (options.enhance && description) {
		const aiResponse = await enhanceWithAI(description, brandName);
		finalDescription = aiResponse.enhancedText;
		isEnhanced = aiResponse.isEnhanced;
	}

	// Upsert into DB (unique by url)
	const website = await prisma.website.upsert({
		where: { url },
		update: {
			brandName,
			description: finalDescription,
			isEnhanced,
		},
		create: {
			url,
			brandName,
			description: finalDescription,
			isEnhanced,
		},
	});

	return {
		success: true,
		data: website,
	};
}

// Function to get a list of websites with optional search
async function getWebsites({ q, limit = 50, offset = 0 } = {}) {
	// basic search on url or brandName
	const where = q
		? {
				OR: [{ url: { contains: q, mode: "insensitive" } }, { brandName: { contains: q, mode: "insensitive" } }],
		}
		: {};
        
	const items = await prisma.website.findMany({
		where,
		orderBy: { createdAt: "desc" },
		take: Number(limit),
		skip: Number(offset),
	});

	return items;
}

// Function to get a website by ID
async function getWebsiteById(id) {
	return prisma.website.findUnique({ where: { id } });
}

// Function to update a website by ID
async function updateWebsiteById(id, updates = {}) {
	// allow editing brandName and description only (avoid accidental url changes)
	const allowed = {};
	if (typeof updates.brandName === "string") allowed.brandName = updates.brandName;
	if (typeof updates.description === "string") allowed.description = updates.description;

	if (Object.keys(allowed).length === 0) {
		throw new Error("Nothing to update (allowed: brandName, description)");
	}

	const updated = await prisma.website.update({
		where: { id },
		data: allowed,
	});

	return updated;
}

// Function to delete a website by ID
async function deleteWebsiteById(id) {
	await prisma.website.delete({ where: { id } });
	return { success: true };
}

export { analyzeAndStoreWebsite, getWebsites, getWebsiteById, updateWebsiteById, deleteWebsiteById };

