import express from "express";
import { createCallBack, deleteCallBack, getAllCallBack, updateCallBack } from "../controller/callBackController.js";
import { isAuthenticated } from "../middlewares/isAuth.js";

const router = express.Router();


// Login User ----------------------> Public
router.route("/create").post(  createCallBack);
router.route("/all").get(isAuthenticated , getAllCallBack);
router.route("/del/:id").delete(isAuthenticated , deleteCallBack);
router.route("/update/:id").patch(isAuthenticated , updateCallBack);


export default router;