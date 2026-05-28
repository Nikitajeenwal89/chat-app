import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { initSocket } from "./Socket.js";

// create express app
const app = express();

// create http server
const server = http.createServer(app);

// initialize socket.io
initSocket(server);

// middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));







// routes
//pp.use("/", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connect database
await connectDB();

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

export default app;
