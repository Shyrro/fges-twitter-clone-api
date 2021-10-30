import { Document as MongoDocument, ObjectId } from "mongodb";

export default interface User extends MongoDocument {
    _id: ObjectId;
    name: string;
    profilePicture: string;    
}