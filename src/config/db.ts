import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_NAME,
} = process.env;

if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME) {
  throw new Error("❌ Missing MongoDB environment variables. Check your .env file.");
}

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}