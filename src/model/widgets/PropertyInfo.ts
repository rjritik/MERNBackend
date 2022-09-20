import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";
import { AnyARecord } from "dns";

export interface IPropertyInfo extends Document {
  _id: Types.ObjectId;
  Name: String;
  Address1:String;
  Address2:String;
  Country:String;
  State:String;
  City:String;
  Zip:String;
  PhoneNumber:String;
  Email:String;
  ContactName:String;
  UserId:String;
}
export class PropertyInfo extends BaseModel {
  // _id?: Types.ObjectId;

  Name?: String;
  Address1?:String;
  Address2?:String;
  Country?:String;
  State?:String;
  City?:String;
  Zip?:String;
  PhoneNumber?:String;
  Email?:String;
  ContactName?:String;
  UserId?:String;
}
const PropertyInfoSchema:Schema=new Schema({
     Name: {
        type: String,
      },
      Address1: {
            type: String,
          },
      Address2:{
            type:String,
        },
      Country:{
          type:String,
      },
      State:{
            type:String,
        },
      City:{
            type:String,
        },
      Zip:{
            type:String,
        },
        
      PhoneNumber:{
          type:String,
      },
      Email:{
          type:String,
      },
      ContactName:{
          type:String,
      },
      UserId:{
        type:String,
    },

  },{ timestamps: true }
);

export const PropertyInfomodel= model<PropertyInfo>("PropertyInfohost", PropertyInfoSchema);