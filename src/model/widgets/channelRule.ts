import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";

export interface IChannelRule extends Document {
  _id: Types.ObjectId;
  ChannelRulesName: String;
  RuleType: Object;
  UserId:String;
  IpAddressMin:String;
  IpAddressMax:String;
  TableIp:String;

}

export class ChannelRule extends BaseModel {
 // _id?: Types.ObjectId;
 ChannelRulesName?: String;
 RuleType?: Object;
UserId?:String;
IpAddressMin?:String;
IpAddressMax?:String;
TableIp?:String;
}

const ChannelRuleSchema:Schema=new Schema({
  ChannelRulesName: {
    type: String,
  },
  RuleType: { type:Object,},
  UserId:{
    type:String,
  },
  IpAddressMin:{
    type:String,
  },
  IpAddressMax:{
    type:String,
  },
  TableIp:{
    type:String,
  },
  },{ timestamps: true }
);

export const channelRulemodel= model<ChannelRule>("channelRulehost", ChannelRuleSchema);