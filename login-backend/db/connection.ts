import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "login_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  // Don't exit process, just log the error
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connection test successful:", result.rows[0]);
    return true;
  } catch (error: any) {
    console.error("Database connection test failed");
    
    // Handle AggregateError (multiple connection attempts failed)
    if (error.name === "AggregateError" && error.errors && error.errors.length > 0) {
      const firstError = error.errors[0];
      console.error("Connection error:", {
        code: firstError.code || (error as any).code,
        message: firstError.message || firstError.toString(),
      });
      
      // Extract error code from AggregateError
      (error as any).code = firstError.code || (error as any).code;
      (error as any).message = firstError.message || error.message || "Connection refused";
    } else {
      const err = error as any;
      console.error("Error details:", {
        message: err.message || error.message,
        code: err.code,
      });
    }
    
    // Re-throw so the caller can handle it
    throw error;
  }
};

export default pool;

