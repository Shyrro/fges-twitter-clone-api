import { Document as MongoDocument, ObjectId } from "mongodb";

export default interface Like extends MongoDocument {
    _id: ObjectId;
    tweetId: string;
    userId: string;
}