import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Answer from "../models/Answer";
import Question from "../models/Question";

const createAnswer = (req: Request, res: Response, next: NextFunction) => {
    const { answerText, isCorrect, questionId } = req.body;
    const answer = new Answer({
        id: new mongoose.Types.ObjectId(),
        answerText,
        isCorrect,
        questionId
    });

    answer
        .save()
        .then((answer) => {
            Question.findById(questionId).then((q) => {
                if (q) {
                    q.set({ ...q, answers: [...q.answers, answer] });
                    q.save();
                }
            });
            res.status(201).json({ answer });
        })
        .catch((error) => res.status(500).json({ error }));
};

const getAnswer = (req: Request, res: Response, next: NextFunction) => {
    const answerId = req.params.answerId;

    Answer.findById(answerId)
        .populate("questionId")
        .then((answer) => (answer ? res.status(200).json({ answer }) : res.status(404).json({ message: `answer with id: ${answerId} not found` })))
        .catch((error) => res.status(500).json({ error }));
};

const getAnswers = (req: Request, res: Response, next: NextFunction) => {
    Answer.find()
        .then((answer) => res.status(200).json({ answer }))
        .catch((error) => res.status(500).json({ error }));
};
const updateAnswer = (req: Request, res: Response, next: NextFunction) => {
    const answerId = req.params.answerId;

    Answer.findById(answerId)
        .then((answer) => {
            if (answer) {
                answer.set(req.body);
                return answer
                    .save()
                    .then((answer) => {
                        res.status(200).json({ answer });
                    })
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: `answer with id: ${answerId} not found` });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteAnswer = (req: Request, res: Response, next: NextFunction) => {
    const answerId = req.params.answerId;
    Answer.findByIdAndDelete(answerId)
        .then((answer) => (answer ? res.status(200).json({ message: `deleted answer with ID ${answerId}` }) : res.status(404).json({ message: `answer with id: ${answerId} not found` })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createAnswer, getAnswer, getAnswers, updateAnswer, deleteAnswer };
