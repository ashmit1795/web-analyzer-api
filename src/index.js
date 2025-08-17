import { app } from "./app.js";
import { NODE_ENV, PORT } from "./config/env.js";


if (NODE_ENV === "development") {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

// Export the app for Vercel
export default app;