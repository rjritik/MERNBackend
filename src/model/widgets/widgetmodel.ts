import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";
import { AnyARecord } from "dns";

export interface IWidget extends Document {
  _id: Types.ObjectId;
  layout_id: Types.ObjectId;
  type: string;
  color: string;
  fcolor: string;
  bcolor: string;
  width: string;
  timeFormat: string;
  fontFamily: string;
  fontSizeType: string;
  fontsize: string;
  fontsizeSub: string;
  content: any[];
  listshow: boolean;
}

export class Widget extends BaseModel {
  layout_id?: Types.ObjectId;
  type?: string;
  color?: string;
  bcolor?: string;
  fcolor?: string;
  width?: string;
  timeFormat?: string;
  fontFamily?: string;
  fontSizeType?: string;
  fontsize?: string;
  fontsizeSub?: string;
  content?: any[];
  listshow?: boolean;
}

const WidgetSchema: Schema = new Schema(
  {
    layout_id : {
      type: Types.ObjectId,
    },
    type: {
      type: String,
    },
    color: {
      type: String,
    },
    fcolor: {
      type: String,
    },
    bcolor: {
      type: String,
    },
    width: {
      type: String,
    },
    timeFormat: {
      type: String,
    },
    fontFamily: {
      type: String,
    },
    fontSizeType: {
      type: String,
    },
    fontsize: {
      type: String,
    },
    fontsizeSub: {
      type: String,
    },
    content: {
      type: Array,
    },
    listshow: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

export const widgetmodel = model<Widget>("widgethost", WidgetSchema);
