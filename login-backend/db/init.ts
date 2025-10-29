import pool, { testConnection } from "./connection";

export const initializeDatabase = async () => {
  try {
    // First, test the connection
    console.log("Testing database connection...");
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error(
        "Cannot connect to PostgreSQL database. " +
        "Please ensure:\n" +
        "1. PostgreSQL is running\n" +
        "2. Database credentials in .env are correct\n" +
        "3. Database 'login_db' exists (or create it: CREATE DATABASE login_db;)"
      );
    }

    // Create users table
    console.log("Creating users table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        bio TEXT,
        skills TEXT[],
        profile_image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add new columns if they don't exist (for existing databases)
    console.log("Checking for schema updates...");
    try {
      // Check and add name column
      await pool.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='users' AND column_name='name') THEN
            ALTER TABLE users ADD COLUMN name VARCHAR(255);
          END IF;
        END $$;
      `);

      // Check and add bio column
      await pool.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='users' AND column_name='bio') THEN
            ALTER TABLE users ADD COLUMN bio TEXT;
          END IF;
        END $$;
      `);

      // Check and add skills column
      await pool.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='users' AND column_name='skills') THEN
            ALTER TABLE users ADD COLUMN skills TEXT[];
          END IF;
        END $$;
      `);

      // Check and add profile_image_url column
      await pool.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='users' AND column_name='profile_image_url') THEN
            ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(500);
          END IF;
        END $$;
      `);
    } catch (error) {
      console.warn("Schema update warnings (this is normal for new databases):", error);
    }

    // Create index on email for faster lookups
    console.log("Creating email index...");
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error initializing database:");
      console.error(error.message);
      
      // Check for specific error codes
      if ((error as any).code === "ECONNREFUSED" || (error as any).message?.includes("ECONNREFUSED")) {
        console.error("\n💡 Connection refused - PostgreSQL server is not running or not accessible");
        console.error("\n📋 Quick setup steps:");
        console.error("   1. Check if PostgreSQL is installed: https://www.postgresql.org/download/");
        console.error("   2. Start PostgreSQL service (Services app or: Start-Service postgresql*)");
        console.error("   3. Verify .env file exists with correct DB credentials");
        console.error("   4. Test connection with: psql -U postgres -h localhost");
      } else if ((error as any).code === "3D000") {
        console.error("\n💡 Database does not exist. Create it with: CREATE DATABASE login_db;");
        console.error("   Or run: psql -U postgres -c 'CREATE DATABASE login_db;'");
      } else if ((error as any).code === "28P01") {
        console.error("\n💡 Authentication failed - Check your DB_USER and DB_PASSWORD in .env");
      }
    } else {
      console.error("Error initializing database:", error);
    }
    throw error;
  }
};

