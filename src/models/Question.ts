import { object } from "joi";
import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
    questionText: string;
}

export interface IQuestionModel extends IQuestion, Document {}

const QuestinSchema: Schema = new Schema(
    {
        questionText: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IQuestionModel>("Question", QuestinSchema);
