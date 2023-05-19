import express from "express";
import controller from "../controllers/Question";

const router = express.Router();

router.post("/create", controller.createQuestion);

router.get("/get/:questionId", controller.getQuestion);

router.get("/get", controller.getQuestions);

router.post("/getRandomQuestions/", controller.getRandomQuestions);

router.post("/createQuestionWithAnswers/", controller.createQuestionWithAnswers);

router.patch("/update/:questionId", controller.updateQestion);

router.delete("/delete/:questionId", controller.deleteQestion);

router.delete("/deleteAllSudo", controller.deleteAllSudo);

export default router;
