import express from "express";
import { config } from "dotenv";
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();


// Dotenv Configuration
config({
  path: "./config/.env"
})

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};


connectDb();


// Middlewares

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.get("/check-env", (req, res) => {
  res.send(process.env.FRONTEND_URL);
});


// Routes
import Users from "./router/userRouter.js";
import DownloadBrochure from "./router/downloadBrochureRoute.js";
import CallBack from "./router/callBackRoute.js";
import Broucher from "./router/broucherRoute.js";


app.use("/api/v1/user", Users);
app.use("/api/v1/download", DownloadBrochure);
app.use("/api/v1/broucher", Broucher);
app.use("/api/v1/callback", CallBack);


export default app;