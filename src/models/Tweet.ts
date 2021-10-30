import { Document as MongoDocument, ObjectId } from "mongodb";

export interface Tweet extends MongoDocument {
    _id: ObjectId;
    owner: string;
    message: string;
    parent: string;
}

export interface TweetRequest {
    owner: string;
    message: string;
    parent: string;
}