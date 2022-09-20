import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";
import { AnyARecord } from "dns";
import { NumberLiteralType } from "typescript";

export interface IChannelView extends Document {
  _id: Types.ObjectId;
  channel_id: Types.ObjectId;
  viewCountArray: any[];
}
export class ChannelView extends BaseModel {
  channel_id?: Types.ObjectId;
  viewCountArray?: any[];
}
const ChannelViewSchema: Schema = new Schema(
  {
    channel_id: {
      type: Types.ObjectId,
    },
    viewCountArray: {
      type: Array,
    },
  },
  { timestamps: true }
);


export const channelViewmodel = model<ChannelView>(
  "channelviewhost",
  ChannelViewSchema
);