import mongoose, { Document, Schema } from "mongoose";

export interface IUserResult {
    name: string;
    email: string;
    tel: string;
    score: number;
    time: number;
}

export interface IUserResultModel extends IUserResult, Document {}

const UserResultScheema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        tel: { type: String, required: true },
        score: { type: Number, required: false },
        time: { type: Number, required: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
export default mongoose.model<IUserResultModel>("UserResult", UserResultScheema);
