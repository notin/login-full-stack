import express, { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";

const router = express.Router();

// Protected route example
router.get("/profile", (req: AuthRequest, res: Response) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
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

