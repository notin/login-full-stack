import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { protectedRoutes } from "./routes/protected";
import { authenticateToken } from "./middleware/auth";
import { initializeDatabase } from "./db/init";

dotenv.config();

const app = express();
const port = 2323;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase().catch((error) => {
  console.error("\n⚠️  Failed to initialize database");
  console.error("Server will not start without a database connection.\n");
  console.error("Please fix the database connection and restart the server.\n");
  process.exit(1);
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello from login-backend");
});

app.use("/api/auth", authRoutes);
app.use("/api/protected", authenticateToken, protectedRoutes);

app.listen(port, () => {
  console.log(`login-backend listening at http://localhost:${port}`);
});
