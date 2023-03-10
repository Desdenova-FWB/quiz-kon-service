import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Question from "../models/Question";

const createQuestion = (req: Request, res: Response, next: NextFunction) => {
    const { questionText } = req.body;
    const question = new Question({
        id: new mongoose.Types.ObjectId(),
        questionText
    });
    return question
        .save()
        .then((question) => res.status(201).json({ question }))
        .catch((error) => res.status(500).json({ error }));
};

const getQuestion = (req: Request, res: Response, next: NextFunction) => {
    const questionId = req.params.questionId;

    Question.findById(questionId)
        .then((question) => (question ? res.status(200).json({ question }) : res.status(404).json({ message: `question with id: ${questionId} not found` })))
        .catch((error) => res.status(500).json({ error }));
};
const getQuestions = (req: Request, res: Response, next: NextFunction) => {
    Question.find()
        .then((questions) => res.status(200).json({ questions }))
        .catch((error) => res.status(500).json({ error }));
};
const updateQestion = (req: Request, res: Response, next: NextFunction) => {
    const questionId = req.params.questionId;

    Question.findById(questionId)
        .then((question) => {
            if (question) {
                question.set(req.body);
                return question
                    .save()
                    .then((question) => {
                        res.status(200).json({ question });
                    })
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: `question with id: ${questionId} not found` });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteQestion = (req: Request, res: Response, next: NextFunction) => {
    const questionId = req.params.questionId;
    Question.findByIdAndDelete(questionId)
        .then((question) => (question ? res.status(200).json({ message: `deleted question with ID ${questionId}` }) : res.status(404).json({ message: `question with id: ${questionId} not found` })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createQuestion, getQuestion, getQuestions, updateQestion, deleteQestion };
