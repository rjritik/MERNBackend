import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";
import { AnyARecord } from "dns";
import { NumberLiteralType } from "typescript";

export interface IChannelInfo extends Document {
  _id: Types.ObjectId;
  // Name: String;
  // Address1:String;
  // Address2:String;
  // Country:String;
  // State:String;
  // City:String;
  // Zip:String;
  // PhoneNumber:String;
  // Email:String;
  // ContactName:String;

  channelName: String;
  channel_category: String;
  channel_language: String;
  channelDescription: String;
  programIcon: String;
  UserId: String;
  videoSource: any[];
  program: any[];
  PropertyType:any[];

  ChannelRulesId: String;
  ChannelRulesName: String;
  // RuleType: any[];
  viewCount: Number;
}
export class ChannelInfo extends BaseModel {
  // _id?: Types.ObjectId;

  // Name?: String;
  // Address1?:String;
  // Address2?:String;
  // Country?:String;
  // State?:String;
  // City?:String;
  // Zip?:String;
  // PhoneNumber?:String;
  // Email?:String;
  // ContactName?:String;

  channelName?: String;
  channel_category?: String;
  channel_language?: String;
  channelDescription?: String;
  programIcon?: String;
  UserId?: String;
  videoSource?: any[];
  program?: any[];
  PropertyType?: any[];

  ChannelRulesId?: String;
  ChannelRulesName?: String;
  viewCount?: Number;
  // RuleType?: any[];
}
const ChannelInfoSchema: Schema = new Schema(
  {
    channelName: {
      type: String,
    },
    channel_category: {
      type: String,
    },
    channel_language: {
      type: String,
    },
    channelDescription: {
      type: String,
    },
    program: {
      type: Array,
    },
    UserId: {
      type: String,
    },
  
    programIcon: {
      type: String,
    },
    videoSource: {
      type: Array,
    },

    PropertyType: {
      type: Array,
    },
  

    ChannelRulesId: {
      type: String,
    },
    ChannelRulesName: {
      type: String,
    },
    viewCount: {
      type: Number,
    },
    // view: [{
    //   type: Types.ObjectId,
    //   ref: "viewSchema"
    // }],
    // RuleType: {
    //   IpAddress: {
    //     type: String,
    //   },
    //   MacAddress: {
    //     type: String,
    //   },
    //   AccountNumber: {
    //     type: String,
    //   },
    //   Geo_Location: {
    //     type: String,
    //   },
    // },

    // Name: {
    //   type: String,   
    // },
    //   Address1: {
    //       type: String,
    //     },
    //   Address2:{
    //       type:String,
    //   },
    //   Country:{
    //     type:String,
    // },
    //   State:{
    //       type:String,
    //   },
    //   City:{
    //       type:String,
    //   },
    //   Zip:{
    //       type:String,
    //   },

    //   PhoneNumber:{
    //     type:String,
    // },
    // Email:{
    //     type:String,
    // },
    // ContactName:{
    //     type:String,
    // },
  },
  { timestamps: true }
);

// const viewSchema = new Schema({
//   viewCount: {
//     type: Number,
//   },
//   viewSch: {
//     type: Types.ObjectId,
//     ref: 'channelInfohost'
//   }
// },
// { timestamps: true })


// export const View = model('viewSchema', viewSchema);


export const channelInfomodel = model<ChannelInfo>(
  "channelInfohost",
  ChannelInfoSchema
);