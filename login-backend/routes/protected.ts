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

