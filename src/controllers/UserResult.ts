import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import UserResult from "../models/UserResult";

const createUserResult = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, tel, score, time } = req.body;
    const userResult = new UserResult({
        id: new mongoose.Types.ObjectId(),
        name,
        email,
        tel,
        score,
        time
    });
    return userResult
        .save()
        .then((userResult) => res.status(201).json({ userResult }))
        .catch((error) => res.status(500).json({ error }));
};

const getUserResult = (req: Request, res: Response, next: NextFunction) => {
    const userResultId = req.params.userResultId;

    UserResult.findById(userResultId)
        .then((userResult) => (userResult ? res.status(200).json({ userResult }) : res.status(404).json({ message: `userResult with id: ${userResultId} not found` })))
        .catch((error) => res.status(500).json({ error }));
};
const getUserResults = (req: Request, res: Response, next: NextFunction) => {
    UserResult.find()
        .then((userResults) => res.status(200).json({ userResults }))
        .catch((error) => res.status(500).json({ error }));
};
const updateUserResult = (req: Request, res: Response, next: NextFunction) => {
    const userResultId = req.params.userResultId;

    UserResult.findById(userResultId)
        .then((userResult) => {
            if (userResult) {
                userResult.set(req.body);
                return userResult
                    .save()
                    .then((userResult) => {
                        res.status(200).json({ userResult });
                    })
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: `userResult with id: ${userResultId} not found` });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteUserResult = (req: Request, res: Response, next: NextFunction) => {
    const userResultId = req.params.userResultId;
    UserResult.findByIdAndDelete(userResultId)
        .then((userResult) =>
            userResult ? res.status(200).json({ message: `deleted userResult with ID ${userResultId}` }) : res.status(404).json({ message: `userResult with id: ${userResultId} not found` })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default { createUserResult, getUserResult, getUserResults, updateUserResult, deleteUserResult };
