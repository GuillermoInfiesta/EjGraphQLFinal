import mongoose from "npm:mongoose@7.6.3"

const Schema = mongoose.Schema;

const petSchema = new Schema ({
    name: {type: String, required: true},
    breed: {type: String, required: true}
})

export type petModelType = {
    name: string,
    breed: string,
    _id: mongoose.Types.ObjectId;
}

export const petModel = mongoose.model<petModelType>(
    "Pets",
    petSchema
)