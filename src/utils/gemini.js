import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function enhanceWithAI(text, brandName) {
	try {
		const prompt = `Rewrite the following website description for ${brandName}. Make it clear, professional, and engaging in **one version only**. Do not include quotes, options, bullet points, or multiple variations. Just return the final enhanced description in 1–2 sentences:\n\n${text}`;
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
		});
		// console.log(response.text);
		const enhancedText = response.text.trim();
		if(enhancedText && enhancedText !== text) {
			return { enhancedText, isEnhanced: true };
		} else {
			return { enhancedText: text, isEnhanced: false };
		}
	} catch (error) {
		console.error("Error enhancing with AI:", error);
		return { enhancedText: text, isEnhanced: false }; // Fallback to original text on error
	}
}

export default enhanceWithAI;
