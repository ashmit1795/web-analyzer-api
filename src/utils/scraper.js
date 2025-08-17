import got from "got";
import * as cheerio from "cheerio";
import { API_URL } from "../config/env.js";

// Very small SSRF protection: disallow localhost/private IP hostnames.
function isPrivateOrLocal(urlString) {
	try {
		const u = new URL(urlString);
		const host = u.hostname;

		// common local hostnames
		if (/^(localhost|0\.0\.0\.0|::1)$/.test(host)) return true;

		// IPv4 addresses
		if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
			const [a, b] = host.split(".").map((s) => Number(s));
			if (a === 10) return true;
			if (a === 127) return true; // loopback
			if (a === 192 && b === 168) return true;
			if (a === 172 && b >= 16 && b <= 31) return true;
		}

		// block simple internal hostnames (optional)
		if (host.endsWith(".local") || host.endsWith(".internal")) return true;

		return false;
	} catch (err) {
		// invalid url -> treat as unsafe
		return true;
	}
}

// Fetch HTML with got.
async function fetchHtml(url, opts = {}) {
	try {
		const response = await got(url, {
			timeout: { request: opts.timeoutMs ?? 10000 },
			headers: {
				"user-agent": opts.userAgent ?? `WebAnalyzerAPI/1.0 (+${API_URL})`,
				accept: "text/html,application/xhtml+xml",
			},
			followRedirect: true,
			retry: { limit: 0 }, // don't retry by default
        });

        // Console log to see the response
        // console.log("utils:scraper:fetchHTML - Response:", response);

		return { html: response.body, statusCode: response.statusCode };
	} catch (err) {
		// rethrow with normalized properties for the service to interpret
		const error = new Error(err.message);
		error.name = err.name;
		error.code = err.code;
		throw error;
	}
}

// Extract brandName & description from HTML using cheerio.
function extractBrandAndDescription(html) {
	const $ = cheerio.load(html || "");

	// Console log to see the response
	// console.log("utils:scraper:extractBrandAndDescription - $:", $);

	$("script, style, nav, footer, header, noscript, form, iframe, svg").remove();


	const ogSiteName = $('meta[property="og:site_name"]').attr("content");
	const appName = $('meta[name="application-name"]').attr("content");
	const appleTitle = $('meta[name="apple-mobile-web-app-title"]').attr("content");
	const twitterSite = $('meta[name="twitter:site"]').attr("content");
	const titleTag = $("title").text().trim();

	let brand = ogSiteName || appName || appleTitle || twitterSite || null;

	if (!brand && titleTag) {
		// Split on common separators. Choose last token (common site pattern: Page — Brand)
		const parts = titleTag
			.split(/[-–—|•:]/)
			.map((p) => p.trim())
			.filter(Boolean);
		brand = parts.length > 1 ? parts[parts.length - 1] : parts[0];
	}

	if (!brand) {
		const h1 = $("h1").first().text().trim();
		brand = h1 || null;
    }
    
	const metaDesc = $('meta[name="description"]').attr("content");
	const ogDesc = $('meta[property="og:description"]').attr("content");
	const twitterDesc = $('meta[name="twitter:description"]').attr("content");

	let description = metaDesc || ogDesc || twitterDesc || null;

	if (!description) {
		// pick the longest <p> with a minimum length
		let best = null;
		$("p").each((_, el) => {
			const txt = $(el).text().trim().replace(/\s+/g, " ");
			if (txt.length >= 50 && (!best || txt.length > best.length)) best = txt;
		});
		description = best || null;
	}

	if (!description) {
		const bodyText = $("body").text().replace(/\s+/g, " ").trim();
		if (bodyText) {
			description = bodyText.slice(0, 240) + (bodyText.length > 240 ? "..." : "");
		} else {
			description = null;
		}
	}

	// Final cleanup
	if (brand) brand = brand.replace(/\s+/g, " ").trim();
	if (description) description = description.replace(/\s+/g, " ").trim();

	return { brandName: brand || null, description: description || null };
}

export {
    isPrivateOrLocal,
    fetchHtml,
    extractBrandAndDescription
}

