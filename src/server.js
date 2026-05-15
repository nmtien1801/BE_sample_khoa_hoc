require("dotenv").config();
import express from "express";
import configCORS from "./config/cors";
import cookieParser from "cookie-parser";
const path = require("path");

// Routers
import authApi from "./router/authApi";
// import ApiUPload from "./router/fileApi";
import SampleApi from "./router/sampleApi";
// const corsMiddleware = require("./config/cors");

const app = express();

configCORS(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// Dòng này cho phép truy cập: http://localhost:8080/upload/images/abc.png
app.use("/api/upload", express.static(path.join(__dirname, "..", "upload")));
// connectDB();

authApi(app);
// ApiUPload(app);
SampleApi(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
