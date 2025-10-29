import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../db/connection";
import { validateProfileImageUrl } from "../utils/validation";

const router = express.Router();

interface User {
  id: number;
  email: string;
  password: string;
}

// Register endpoint
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, bio, skills, profile_image_url } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Validate profile image URL if provided
    if (profile_image_url) {
      const urlValidation = validateProfileImageUrl(profile_image_url);
      if (!urlValidation.isValid) {
        return res.status(400).json({ error: urlValidation.error || "Invalid profile image URL" });
      }
    }

    // Validate skills - should be an array if provided
    let skillsArray: string[] = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string") {
        // Allow comma-separated string to be converted to array
        skillsArray = skills.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      } else {
        return res.status(400).json({ error: "Skills must be an array or comma-separated string" });
      }
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const result = await pool.query(
      `INSERT INTO users (email, password, name, bio, skills, profile_image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, name, bio, skills, profile_image_url`,
      [email, hashedPassword, name || null, bio || null, skillsArray.length > 0 ? skillsArray : null, profile_image_url || null]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    const token = jwt.sign(
      { userId: newUser.id.toString(), email: newUser.email },
      secret,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { 
        id: newUser.id.toString(), 
        email: newUser.email,
        name: newUser.name,
        bio: newUser.bio,
        skills: newUser.skills || [],
        profile_image_url: newUser.profile_image_url
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user in database
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user: User = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    const token = jwt.sign(
      { userId: user.id.toString(), email: user.email },
      secret,
      { expiresIn: "24h" }
    );

    // Fetch complete user profile
    const userProfile = await pool.query(
      "SELECT id, email, name, bio, skills, profile_image_url FROM users WHERE id = $1",
      [user.id]
    );

    const fullUser = userProfile.rows[0];

    res.json({
      message: "Login successful",
      token,
      user: { 
        id: fullUser.id.toString(), 
        email: fullUser.email,
        name: fullUser.name,
        bio: fullUser.bio,
        skills: fullUser.skills || [],
        profile_image_url: fullUser.profile_image_url
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as authRoutes };

