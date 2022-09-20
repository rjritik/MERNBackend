import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";
import { AnyARecord } from "dns";

export interface ILocation extends Document {
  _id: Types.ObjectId;
  layout_id: Types.ObjectId;
  layout: any[];
}

export class Location extends BaseModel {
  layout_id?: Types.ObjectId;
  layout?: any[];
}

const LocationSchema: Schema = new Schema(
  {
    layout_id : {
      type: Types.ObjectId,
    },
    layout: {
      type: Array,
    }
  },
  { timestamps: true }
);

export const Locationmodel = model<Location>("Location", LocationSchema);
