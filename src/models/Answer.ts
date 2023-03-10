import mongoose, { Document, Schema } from "mongoose";

export interface IAnswer {
    answerText: string;
    isCorrect: boolean;
    questionId: string;
}

export interface IAnswerModel extends IAnswer, Document {}

const AnswerScheema: Schema = new Schema(
    {
        answerText: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        questionId: { type: Schema.Types.ObjectId, required: true, ref: "Question" }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
export default mongoose.model<IAnswerModel>("Answer", AnswerScheema);
