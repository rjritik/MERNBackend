import { BaseModel } from "../basemodel";
import { Document, Schema, model, Types } from "mongoose";


export interface IloginData extends Document {
  _id: Types.ObjectId;
  customerId:String;
  accountNo:String;
  type: String;
  password:String;
  mobileNo:String;
  Default_password:String;
}

export class loginData extends BaseModel {
  // _id?: Types.ObjectId;
  customerId?:String;
  accountNo?:String;
  type?:String;
  password?:String;
  mobileNo?:String;
  Default_password?:String;
}

const loginDataSchema:Schema=new Schema({
    customerId: {
        type: String,
      },
      accountNo:{
        type:String,
    },
      type:{
        type:String,
    },
    password:{
        type:String,
    },
    mobileNo:{
        type:String,
    },
    Default_password:{
      type: String
    }
    
  },{ timestamps: true }
);

export const loginDataomodel= model<loginData>("loginDatahost", loginDataSchema);