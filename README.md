
# 🌐 Web Analyzer API

The **Web Analyzer API** is a backend service that analyzes a given website URL, extracts metadata such as title and description, and optionally enhances the description using **Google Gemini AI** for better readability.
The service is secured with **Arcjet middleware** for **rate limiting and bot protection**.

## 🔗 Live API
**Base URL:** [https://web-analyzer-api.vercel.app/](https://web-analyzer-api.vercel.app/)

## 📑 Full API Documentation
Explore complete API usage, parameters, and responses here:  
👉 [View Postman Documentation](https://documenter.getpostman.com/view/32382436/2sB3BHm8xY)

## 🚀 Features

- **🔎 Website Metadata Extraction** – Extracts site title, description, and keywords from any given URL.
- **💾 Database Integration** – Stores analyzed websites in a Supabase PostgreSQL database using Prisma ORM.
- **✨ Optional AI Enhancement** – Uses **Gemini AI** to rewrite the descriptions for better readability and clarity (optional via query parameter `?enhanceWithAI=true`).
- **🛡 Rate Limiting & Bot Protection** - Integrated with **Arcjet middleware** to prevent abuse, spam, and bot traffic.
- **✅ Resilient AI Enhancement** - If Gemini API fails, the original description is returned with isEnhanced: false.
- **🧹Clean Codebase** – Structured for scalability and deployable on Vercel.

## 🛠 Tech Stack

**Backend Framework:**  
- [Node.js](https://nodejs.org/) – Runtime environment  
- [Express.js](https://expressjs.com/) – Web framework  

**Database & ORM:**  
- [Supabase](https://supabase.com/) – PostgreSQL database hosting  
- [Prisma](https://www.prisma.io/) – Type-safe ORM  

**AI Integration:**  
- [Gemini API](https://ai.google.dev/) – Readability enhancement (optional)  

**Security & Middleware:**  
- [Arcjet](https://arcjet.com/) – Rate limiting & bot protection  
- [Helmet](https://helmetjs.github.io/) – Secure HTTP headers  
- [Zod](https://zod.dev/) – Input validation  

**Web Scraping & Networking:**  
- [Got](https://github.com/sindresorhus/got) – Fetching HTML content  
- [Cheerio](https://cheerio.js.org/) – Parsing & scraping website metadata  

**Utilities:**  
- [dotenv](https://github.com/motdotla/dotenv) – Environment variable management  
- [CORS](https://expressjs.com/en/resources/middleware/cors.html) – Cross-origin resource sharing  

**Dev Tools:**  
- [Nodemon](https://nodemon.io/) – Development auto-reload  
- [Postman](https://www.postman.com/) – API testing  

## Project Structure

```bash
web-analyzer-api/
│── prisma/
│   └── schema.prisma        # Prisma schema for Supabase DB
│── src/
│   ├── prisma/
│   │   └── client.js        # Prisma client instance
│   ├── routes/
│   │   └── website.routes.js # Website Analyzer routes
│   ├── middlewares/
│   │   └── arcjet.middleware.js # Arcjet security middleware (rate-limiting, etc.)
│   ├── services/
│   │   └── website.service.js    # Website Analyzer Services    
│   ├── config/
│   │   ├── env.js             # Environment variable loader
│   │   └── arcjet.js          # Arcjet configuration
│   ├── utils/
│   │   ├── gemini.js          # Gemini AI helper
│   │   └── scraper.js         # Website scraper utility
│   ├── app.js                 # Express app & middlewares
│   └── index.js               # Server entrypoint
│── .env                       # Environment variables
│── .gitignore
│── package.json 
│── package-lock.json 
│── README.md  
```

## ⚙️ Setup Instructions 

Follow these steps to set up and run the **Web Analyzer API** locally.

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ashmit1795/web-analyzer-api.git
cd web-analyzer-api
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory and add the following:
```bash
# Supabase Database URL
DATABASE_URL="postgresql://<username>:<password>@<host>:5432/<dbname>?schema=public"

# Arcjet Key
ARCJET_KEY="your-arcjet-key"

# Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"

# Server Port
PORT=3000

# API URL
API_URL="https://your-api-url.app/"
```

#### 4️⃣ Setup Prisma

Run the following commands to initialize and generate Prisma client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 5️⃣ Run the Server

```bash
npm run dev
```

The server will start at:
`http://localhost:3000`

#### ✅ Verification

- Check if Prisma has connected to your **Supabase DB**.
- Ensure that **Arcjet middleware** is protecting routes (rate limiting, bot protection).
- Confirm that the **Gemini API** is working by testing the `?enhanceWithAI=true` query parameter.




## 🧪 Testing

Manual testing can be performed using Postman. Use the [API documentation](https://documenter.getpostman.com/view/32382436/2sB34ikes3) to test the following:

- Website Analysis Endpoint (`/api/v1/analyze`)
- Optional AI Enhancement using Gemini (`?enhanceWithAI=true`)
- Rate Limiting & Bot Protection (Arcjet Middleware)
- Database Persistence via Prisma + Supabase

> Automated test coverage will be added in upcoming versions.

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

- Fork the repository
- Create a new branch: `git checkout -b feature-name`
- Commit your changes: `git commit -m "Add feature"`
- Push to the branch: `git push origin feature-name`
- Submit a pull request 🚀
## 🧑‍💻 Author

Made with ❤️ by [Ashmit Patra](https://github.com/ashmit1795)