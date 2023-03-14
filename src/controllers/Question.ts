import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Logging from "../library/Logging";
import Answer, { IAnswer } from "../models/Answer";
import Question, { IQuestion, IQuestionModel } from "../models/Question";

const createQuestion = (req: Request, res: Response, next: NextFunction) => {
    const { questionText, answers } = req.body;
    const question = new Question({
        id: new mongoose.Types.ObjectId(),
        questionText,
        answers
    });

    return question
        .save()
        .then((question) => res.status(201).json({ question }))
        .catch((error) => res.status(500).json({ error }));
};

const createQuestionWithAnswers = (req: Request, res: Response, next: NextFunction) => {
    const { questionText, answers } = req.body;
    const question = new Question({
        id: new mongoose.Types.ObjectId(),
        questionText
    });

    return question
        .save()
        .then((question) => {
            answers.forEach((answer: IAnswer) => {
                const a = new Answer({ ...answer, id: new mongoose.Types.ObjectId(), questionId: question.id });
                a.save()
                    .then((answer) => {
                        Question.findById(question.id).then((q) => {
                            if (q) {
                                q.set({ ...q, answers: [...q.answers, answer] });
                                q.save();
                            }
                        });
                    })
                    .catch((error) => res.status(500).json({ error }));
            });
            res.status(201).json({ question });
        })
        .catch((error) => res.status(500).json({ error }));
};

const getQuestion = (req: Request, res: Response, next: NextFunction) => {
    const questionId = req.params.questionId;

    Question.findById(questionId)
        .populate("answers")
        .then((question) => (question ? res.status(200).json({ question }) : res.status(404).json({ message: `question with id: ${questionId} not found` })))
        .catch((error) => res.status(500).json({ error }));
};
const getQuestions = (req: Request, res: Response, next: NextFunction) => {
    Question.find()
        .then((questions) => res.status(200).json({ questions }))
        .catch((error) => res.status(500).json({ error }));
};

const getRandomQuestions = async (req: Request, res: Response, next: NextFunction) => {
    let { numberOfQuestions } = req.body;
    let questions = await Question.find().populate("answers");

    if (numberOfQuestions > questions.length) numberOfQuestions = questions.length;
    questions = questions.sort((a, b) => 0.5 - Math.random());
    questions = questions.slice(0, numberOfQuestions);
    questions.forEach((q) => {
        q.answers = q.answers.sort((a, b) => 0.5 - Math.random());
    });
    res.status(200).json({ questions });
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

export default { createQuestion, getQuestion, getQuestions, updateQestion, deleteQestion, getRandomQuestions, createQuestionWithAnswers };
