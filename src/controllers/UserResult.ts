import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Logging from "../library/Logging";
import UserResult from "../models/UserResult";

const createUserResult = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, tel } = req.body;

    const existingUser = await UserResult.find()
        .then((userResult) => {
            return userResult.find((ur) => ur.email === email.trim());
        })
        .catch((error) => res.status(500).json({ error }));
    if (existingUser) {
        res.status(201).json({ existingUser });
    }

    const userResult = new UserResult({
        id: new mongoose.Types.ObjectId(),
        name,
        email: email.trim(),
        tel,
        tryCounter: 0
    });
    return userResult
        .save()
        .then((userResult) => res.status(201).json({ userResult }))
        .catch((error) => {
            Logging.error(error);
            return res.status(500).json({ error });
        });
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
const getSortedUserResults = (req: Request, res: Response, next: NextFunction) => {
    let { topResults }: { topResults: number } = req.body;

    UserResult.find()
        .then((userResults) => {
            userResults = userResults.filter((result) => result.score > 0);
            userResults.sort(function (a, b) {
                if (a.score > b.score) {
                    return -1;
                } else if (a.score < b.score) {
                    return 1;
                } else {
                    if (a.time > b.time) return 1;
                    else if (a.time < b.time) return -1;
                    else return 0;
                }
            });
            if (topResults && userResults.length < topResults) topResults = userResults.length;
            const retval = userResults.splice(0, topResults ?? 10);
            return res.status(200).json({ userResults: retval });
        })
        .catch((error) => res.status(500).json({ error }));
};
const updateUserResult = (req: Request, res: Response, next: NextFunction) => {
    const userResultId = req.body._id;
    const persisningBody = req.body;
    UserResult.findById(userResultId)
        .then((userResult) => {
            if (userResult) {
                let newCounter = userResult.tryCounter++;
                if (newCounter > 1 && (userResult.score > persisningBody.score || (userResult.score == persisningBody.score && persisningBody.time < userResult.time))) {
                    persisningBody.score = userResult.score;
                    persisningBody.time = userResult.time;
                }
                persisningBody.tryCounter = newCounter;
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

export default { createUserResult, getUserResult, getUserResults, updateUserResult, deleteUserResult, getSortedUserResults };
