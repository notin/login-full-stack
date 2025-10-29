import express, { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import pool from "../db/connection";
import { validateProfileImageUrl } from "../utils/validation";

const router = express.Router();

// Get user profile
router.get("/profile", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT id, email, name, bio, skills, profile_image_url, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    res.json({
      message: "Profile retrieved successfully",
      user: {
        userId: user.id.toString(),
        email: user.email,
        name: user.name,
        bio: user.bio,
        skills: user.skills || [],
        profile_image_url: user.profile_image_url,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, bio, skills, profile_image_url } = req.body;

    // Validate profile image URL if provided
    if (profile_image_url !== undefined) {
      const urlValidation = validateProfileImageUrl(profile_image_url);
      if (!urlValidation.isValid) {
        return res.status(400).json({ error: urlValidation.error || "Invalid profile image URL" });
      }
    }

    // Validate and process skills
    let skillsArray: string[] | null = null;
    if (skills !== undefined) {
      if (skills === null || skills === "") {
        skillsArray = null;
      } else if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string") {
        // Allow comma-separated string to be converted to array
        skillsArray = skills.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      } else {
        return res.status(400).json({ error: "Skills must be an array or comma-separated string" });
      }
    }

    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name || null);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramIndex++}`);
      values.push(bio || null);
    }
    if (skills !== undefined) {
      updates.push(`skills = $${paramIndex++}`);
      values.push(skillsArray);
    }
    if (profile_image_url !== undefined) {
      updates.push(`profile_image_url = $${paramIndex++}`);
      values.push(profile_image_url || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(userId);
    const query = `
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, email, name, bio, skills, profile_image_url, created_at
    `;

    const result = await pool.query(query, values);
    const updatedUser = result.rows[0];

    res.json({
      message: "Profile updated successfully",
      user: {
        userId: updatedUser.id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        bio: updatedUser.bio,
        skills: updatedUser.skills || [],
        profile_image_url: updatedUser.profile_image_url,
        created_at: updatedUser.created_at,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search users endpoint
router.get("/search", async (req: AuthRequest, res: Response) => {
  try {
    const { filter, query } = req.query;

    if (!filter || !query) {
      return res.status(400).json({ error: "Filter and query parameters are required" });
    }

    const searchFilter = filter as string;
    const searchQuery = query as string;

    if (searchQuery.trim().length < 2) {
      return res.status(400).json({ error: "Search query must be at least 2 characters" });
    }

    let searchSQL = "";
    let searchParams: any[] = [];

    switch (searchFilter) {
      case "name":
        searchSQL = "SELECT id, email, name, bio, skills, profile_image_url FROM users WHERE LOWER(name) LIKE LOWER($1) LIMIT 50";
        searchParams = [`%${searchQuery}%`];
        break;
      case "email":
        searchSQL = "SELECT id, email, name, bio, skills, profile_image_url FROM users WHERE LOWER(email) LIKE LOWER($1) LIMIT 50";
        searchParams = [`%${searchQuery}%`];
        break;
      case "id":
        // Search by exact ID or starts with
        searchSQL = "SELECT id, email, name, bio, skills, profile_image_url FROM users WHERE CAST(id AS TEXT) LIKE $1 LIMIT 50";
        searchParams = [`%${searchQuery}%`];
        break;
      case "skills":
        // Search in skills array
        searchSQL = `SELECT id, email, name, bio, skills, profile_image_url 
                     FROM users 
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(skills) AS skill 
                       WHERE LOWER(skill::TEXT) LIKE LOWER($1)
                     ) LIMIT 50`;
        searchParams = [`%${searchQuery}%`];
        break;
      default:
        return res.status(400).json({ error: "Invalid filter. Must be: name, email, id, or skills" });
    }

    const result = await pool.query(searchSQL, searchParams);
    const users = result.rows.map((row) => ({
      id: row.id.toString(),
      userId: row.id.toString(),
      email: row.email,
      name: row.name,
      bio: row.bio,
      skills: row.skills || [],
      profile_image_url: row.profile_image_url,
    }));

    res.json({
      message: "Search completed",
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Another protected route
router.get("/data", (req: AuthRequest, res: Response) => {
  res.json({
    message: "Protected data endpoint",
    data: {
      userId: req.user?.userId,
      email: req.user?.email,
      timestamp: new Date().toISOString(),
    },
  });
});

export { router as protectedRoutes };

