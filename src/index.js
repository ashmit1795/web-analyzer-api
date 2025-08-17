import { app } from "./app.js";
import { PORT } from "./config/env.js";

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export the app for Vercel
export default app;