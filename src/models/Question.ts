import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
    quiestion: string;
}

export interface IQuestionModel extends IQuestion, Document {}

const QuestinSchema: Schema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IQuestionModel>("Question", QuestinSchema);
