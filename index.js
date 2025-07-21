import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import travelStoryRoutes from "./routes/travelStory.route.js"
import { fileURLToPath } from "url"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// Enable CORS for frontend (Replace with your frontend URL)

// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL,
//       'http://localhost:5173/'
//     ], //frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allow CRUD operations
//     credentials: true, // Allow cookies & authorization headers
//   })
// )


// app.use(
//   cors({
//     origin: true, // Reflect request origin
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// )



const allowedOrigins = [
  'http://localhost:5173',
  'https://travel-diary-gilt.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(cookieParser())

// for allowing json object in req body
app.use(express.json())

app.get('/',(req,res) => {
  return res.send("api is working!")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/travel-story", travelStoryRoutes)

// server static files from the uploads and assets directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
