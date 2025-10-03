import express, { application } from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/db.connect.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job portal backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/application", applicationsRoutes);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on Port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Server is not running...", error.message);
    process.exit(1);
  }
};
