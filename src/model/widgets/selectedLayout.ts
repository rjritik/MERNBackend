import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";
import { AnyARecord } from "dns";

export interface IselectedLayout extends Document {
  _id: Types.ObjectId;
  selectedLayout: string;
  name: string;
  propertyData:any[];
  checked: boolean;
  userID: Types.ObjectId;
  audio : any[];
  audioSet : any[];
  audioId : string;
}

export class selectedLayout extends BaseModel {
  // _id?: Types.ObjectId;
  selectedLayout?: string;
  name?: string;
  propertyData?:any[];
  checked?: boolean;
  userID?: Types.ObjectId;
  audio?: any[];
  audioSet?: any[];
  audioId?: string;
}

const selectedLayoutSchema: Schema = new Schema(
  {
    selectedLayout: {
      type: String,
    },
    name: {
      type: String,
    },
    propertyData: {
      type: Array,
    },
    checked: {
      type: Boolean,
    },
    userID: {
      type: Types.ObjectId,
    },
    audio: {
      type: Array,
    },
    audioSet: {
      type: Array,
    },
    audioId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const selectedLayoutmodel = model<selectedLayout>("selectedLayout", selectedLayoutSchema);
