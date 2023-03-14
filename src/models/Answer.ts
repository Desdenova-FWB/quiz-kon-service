import mongoose, { Document, Schema } from "mongoose";

export interface IAnswer {
    answerText: string;
    isCorrect: boolean;
}

export interface IAnswerModel extends IAnswer, Document {}

export const AnswerSchema: Schema = new Schema(
    {
        answerText: { type: String, required: true },
        isCorrect: { type: Boolean, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
export default mongoose.model<IAnswerModel>("Answer", AnswerSchema);
