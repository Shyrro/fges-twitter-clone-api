import { Document as MongoDocument, ObjectId } from "mongodb";

export default interface Tweet extends MongoDocument {
    _id: ObjectId;
    owner: string;
    message: string;
    parent: string;
}