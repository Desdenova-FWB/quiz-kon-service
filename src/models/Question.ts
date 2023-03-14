import { object } from "joi";
import mongoose, { Document, Schema } from "mongoose";
import { AnswerSchema, IAnswer } from "./Answer";

export interface IQuestion {
    questionText: string;
    answers: IAnswer[];
}

export interface IQuestionModel extends IQuestion, Document {}

const QuestinSchema: Schema = new Schema(
    {
        questionText: { type: String, required: true },

        answers: [AnswerSchema]
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IQuestionModel>("Question", QuestinSchema);
