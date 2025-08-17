import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        // console.log("Arcjet middleware activated");
		const decision = await aj.protect(req, { requested: 1 });

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				// Handle rate limit exceeded
				return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
			}

            if (decision.reason.isBot()) {
                // Handle bot traffic
				return res.status(403).json({ error: "Access denied. Bot traffic is not allowed." });
			}

            // Handle all other cases
			return res.status(403).json({ error: "Access denied." });
		}

		next();
	} catch (error) {
		arcjetDebug("Arcjet middleware error:", error);
		next(error);
	}
};

export default arcjetMiddleware;
