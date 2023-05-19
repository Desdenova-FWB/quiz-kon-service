import express from "express";
import controller from "../controllers/Answer";

const router = express.Router();

router.post("/create", controller.createAnswer);

router.get("/get/:answerId", controller.getAnswer);

router.get("/get", controller.getAnswers);

router.patch("/update/:answerId", controller.updateAnswer);

router.delete("/delete/:answerId", controller.deleteAnswer);

router.delete("/deleteAllSudo", controller.deleteAllSudo);

export default router;
