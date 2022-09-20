import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";

export interface ItokenData extends Document {
  _id: Types.ObjectId;
  GoogleDriveClientId: String;
  GoogleDriveKey: Object;
  DropboxKey:String;
  weatherApiKey:String;
}

export class tokenData extends BaseModel {
 // _id?: Types.ObjectId;
 GoogleDriveClientId?: String;
 GoogleDriveKey?: Object;
 DropboxKey?:String;
 weatherApiKey?:String;
}

const tokenDataSchema:Schema=new Schema({
    GoogleDriveClientId: {
    type: String,
  },
  GoogleDriveKey: {
    type: String,
  },
  DropboxKey: {
    type: String,
  },
  weatherApiKey : {
    type: String,
  }
 
    
  },{ timestamps: true }
);

export const tokenDatamodel = model<tokenData>(
  "tokenDatahost",
  tokenDataSchema
);