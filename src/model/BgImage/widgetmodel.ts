import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";
import { AnyARecord } from "dns";

export interface IBgImage extends Document {
  _id: Types.ObjectId;
  layout_id: Types.ObjectId;
  BgImage: string;
}

export class BgImage extends BaseModel {
  // _id?: Types.ObjectId;
  layout_id?: Types.ObjectId;
  BgImage?: string;
}

const BgImageSchema: Schema = new Schema(
  {
    layout_id : {
      type: Types.ObjectId,
    },
    BgImage: {
      type: String,
    }
  },
  { timestamps: true }
);

export const BgImagemodel = model<BgImage>("BgImage", BgImageSchema);
