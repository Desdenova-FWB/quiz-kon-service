import express from "express";
import controller from "../controllers/UserResult";

const router = express.Router();

router.post("/create", controller.createUserResult);

router.get("/get/:userResultId", controller.getUserResult);

router.get("/get", controller.getUserResults);

router.post("/getSortedUserResults", controller.getSortedUserResults);

router.post("/update", controller.updateUserResult);

router.delete("/delete/:userResultId", controller.deleteUserResult);

export default router;
