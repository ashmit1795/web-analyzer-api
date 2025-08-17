import { config } from "dotenv";

config({
	path: `.env`,
});

export const { PORT, DATABASE_URL, NODE_ENV, API_URL, OPENAI_API_KEY, ARCJET_KEY } = process.env;
