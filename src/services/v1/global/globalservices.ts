import { exec } from "child_process";
import { widgetmodel } from "../../../model/widgets/widgetmodel";
import { channelRulemodel } from "../../../model/widgets/channelRule";
import { channelInfomodel } from "../../../model/widgets/channelInfo";
import { Locationmodel } from "../../../model/widgets/layoutmodel";
import { loginData, loginDataomodel } from "../../../model/widgets/loginData";
import _ from "underscore";
import app from "../../../app";
import { json } from "body-parser";
import { secretUtil } from "../../../utils/secretutil";
import { BgImagemodel } from "../../../model/BgImage/widgetmodel";
import {
  selectedLayout,
  selectedLayoutmodel,
} from "../../../model/widgets/selectedLayout";
import { Response } from "express";
import { tokenDatamodel } from "../../../model/widgets/tokenData";
import { PropertyInfomodel } from "../../../model/widgets/PropertyInfo";
import { channelViewmodel } from "../../../model/widgets/channelviewcount";
var backendVersion = require("../../../../package.json");

const bcrypt = require("bcrypt");
class GlobalServices {
  public addwidgetApi = async (req: any) => {
    try {
      let type: any = req?.body.type;
      let content: any = req?.body.content;
      let layout_id: any = req?.body.layout_id;
      let timeFormat: any = req?.body.timeFormat;
      let fontFamily: any = req?.body.fontFamily;
      let fontSizeType: any = req?.body.fontSizeType;
      let fontsize: any = req?.body.fontsize;
      let listshow: any = req?.body.listshow;
      let fontsizeSub: any = req?.body.fontsizeSub;

      let model = new widgetmodel();
      model.type = type;
      model.content = content;
      model.layout_id = layout_id;
      model.color = "#000"
      model.fcolor = "#000"
      model.bcolor = "#fff"
      model.width = "2"
      model.timeFormat = timeFormat?timeFormat:""
      model.fontFamily = fontFamily?fontFamily:""
      model.fontSizeType = fontSizeType?fontSizeType:""
      model.fontsize = fontsize?fontsize:"small"
      model.fontsizeSub = fontsizeSub?fontsizeSub:"small"
      model.listshow = listshow?listshow:false
      await model.save();
      return {
        id: model._id,
        data: model,
        ack: "1",
        message: "Successful",

      };
    } catch (error) {
      return {
        id:"",
        model: {},
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public removeslideAPI = async (req: any) => {
    try {
      let data = req?.body.content;
      let id = req?.body.id;
      let blob = {
        $set: {
          content: data,
        },
      };
      if (data.length == 0) {
        await widgetmodel.deleteOne({ _id: id });
      } else {
        await widgetmodel.updateOne({ _id: id }, blob);
      }
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public removewidgetApi = async (req: any) => {
    try {
      let id = req?.body.id;
      await widgetmodel.deleteOne({ _id: id });
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public removelayoutAPI = async (req: any) => {
    try {
      let layout_id = req?.body.layout_id;
      await widgetmodel.deleteMany({ layout_id: layout_id });
      await BgImagemodel.deleteMany({ layout_id: layout_id });
      await selectedLayoutmodel.deleteMany({ _id: layout_id });
      await Locationmodel.deleteMany({ layout_id: layout_id });
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public savewidgetlocationAPI = async (req: any) => {
    try {
      let data = req?.body.location;
      let layout_id = req?.body.layout_id;
      let dbData = await Locationmodel.find({ layout_id: layout_id });
      // let dataLayout = dbData[0];

      let blob = {
        $set: {
          layout: data,
        },
      };
      if (dbData.length != 0) {
        await Locationmodel.updateMany({ layout_id: layout_id }, blob);
      } else {
        let model = new Locationmodel();
        model.layout = data;
        model.layout_id = layout_id;
        await model.save();
      }
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public addslidetoslideshowApi = async (req: any) => {
    try {
      let id = req?.body.id;
      let dataContent = req?.body.content;
      let type = req?.body.type;

      let blob = {
        $set: {
            type: type,
          content: dataContent,
        },
      };
      await widgetmodel.updateOne({ _id: id }, blob);
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public updateWidgetApi = async (req: any) => {
    try {
      let id = req?.body.id;
      let type = req?.body.type;
      let dataContent = req?.body.content;
      let color = req?.body.color;
      let bcolor = req?.body.bcolor;
      let fcolor = req?.body.fcolor;
      let width = req?.body.width;
      let timeFormat = req?.body.timeFormat;
      let fontFamily = req?.body.fontFamily;
      let fontSizeType = req?.body.fontSizeType;
      let fontsize = req?.body.fontsize;
      let fontsizeSub = req?.body.fontsizeSub;
      let listshow = req?.body.listshow ? req?.body.listshow : false;
      let blob = {
        $set: {
            type: type,
          content: dataContent,
          color: color,
          fcolor: fcolor,
          bcolor: bcolor,
          width: width,
          timeFormat: timeFormat,
          fontFamily: fontFamily,
          fontSizeType: fontSizeType,
          fontsize: fontsize,
          fontsizeSub: fontsizeSub,
          listshow: listshow
        },
      };
      await widgetmodel.updateOne({ _id: id }, blob);
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public savebgpictureApi = async (req: any) => {
    try {
      let dataContent = req?.body.content;
      let layout_id = req?.body.layout_id;
      let blob = {
        $set: {
          BgImage: dataContent,
        },
      };
      await BgImagemodel.deleteMany({layout_id: layout_id});
      const model = new BgImagemodel();
      model.BgImage = dataContent;
      model.layout_id = layout_id;
      await model.save();
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public saveSelectedLayout = async (req: any) => {
    try {
      let dataContent = req?.body.selectedLayout;
      let name = req?.body.name;
      let propertyData = req?.body.propertyData;
      let UserID = req?.body.userID;

      if (dataContent == "3") {
        const model = new selectedLayoutmodel();
        model.selectedLayout = dataContent;
        model.name = name;
        model.propertyData = propertyData;
        model.checked = false;
        model.userID = UserID;
        await model.save();
      } else if (dataContent == "2") {
        let layout_id;
        let locationData: any = [];
        const model = new selectedLayoutmodel();
        model.selectedLayout = dataContent;
        model.name = name;
        model.propertyData = propertyData;
        model.checked = false;
        model.userID = UserID;

        await model.save();
        layout_id = model._id;
        for (let i = 0; i < 7; i++) {
          let modelWidget = new widgetmodel();
          if (i == 0) {
            modelWidget.content = ["Logo"];
            modelWidget.type = "initialPicture";
          } else if (i == 1) {
            modelWidget.content = ["Text"];
            modelWidget.type = "initialCongratulation";
          } else if (i == 2) {
              
            modelWidget.content = ["Weather"];
            modelWidget.type = "initialWeather";
          } else if (i == 3) {
            modelWidget.content = ["Main Slideshare"];
            modelWidget.type = "initialSlideshare";
          } else if (i == 4) {
            modelWidget.content = ["Events Slideshare OR List"];
            modelWidget.type = "initialSlideshare";
          } else if (i == 5) {
              
            modelWidget.content = ["Announcement"];
            modelWidget.type = "initialAnnouncement";
          } else if (i == 6) {
            modelWidget.content = ["Date/Time"];
            modelWidget.type = "initialDate";
          }
          modelWidget.color = "#000"
          modelWidget.fcolor = "#000"
          modelWidget.bcolor = "#fff"
          modelWidget.width = "2"
          modelWidget.layout_id = layout_id;
          await modelWidget.save();
          let widgetID = modelWidget._id;

          if (i == 0) {
            locationData.push({
              w: 2,
              h: 3,
              x: 0,
              y: 0,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 1) {
            locationData.push({
              w: 3,
              h: 3,
              x: 2,
              y: 0,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 2) {
            locationData.push({
              w: 7,
              h: 3,
              x: 5,
              y: 0,
              // i: widgetID,minW: 2, minH: 3,
              i: widgetID,
              moved: false,
              static: false,
            });
          } else if (i == 3) {
            locationData.push({
              w: 7,
              h: 12,
              x: 0,
              y: 3,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 4) {
            locationData.push({
              w: 5,
              h: 12,
              x: 7,
              y: 3,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 5) {
            locationData.push({
              w: 8,
              h: 3,
              x: 0,
              y: 15,
              // i: widgetID,minW: 2, minH: 3,
              i: widgetID,
              moved: false,
              static: false,
            });
          } else if (i == 6) {
            locationData.push({
              w: 4,
              h: 3,
              x: 8,
              y: 15,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          }
        }
        let modelLocation = new Locationmodel();
        modelLocation.layout = locationData;
        modelLocation.layout_id = layout_id;
        await modelLocation.save();
      
      } else if (dataContent == "1") {
        let layout_id;
        let locationData: any = [];
        const model = new selectedLayoutmodel();
        model.selectedLayout = dataContent;
        model.name = name;
        model.propertyData = propertyData;
        model.checked = false;
        model.userID = UserID;

        await model.save();
        layout_id = model._id;
        for (let i = 0; i < 7; i++) {
          let modelWidget = new widgetmodel();
          if (i == 0) {
            modelWidget.content = ["Logo"];
            modelWidget.type = "initialPicture";
          } else if (i == 1) {
            modelWidget.content = ["Transparent Text"];
            modelWidget.type = "initialCongratulation";
          } else if (i == 2) {
            modelWidget.content = ["Announcement Message"];
            modelWidget.type = "initialAnnouncement";
          } else if (i == 3) {
            modelWidget.content = ["Main Slideshare"];
            modelWidget.type = "initialSlideshare";
          } else if (i == 4) {
            modelWidget.content = ["Events Slideshare OR List"];
            modelWidget.type = "initialSlideshare";
          } else if (i == 5) {
            modelWidget.content = ["Weather"];
            modelWidget.type = "initialWeather";
          } else if (i == 6) {
            modelWidget.content = ["Date/Time"];
            modelWidget.type = "initialDate";
          }
          modelWidget.color = "#000"
          modelWidget.fcolor = "#000"
          modelWidget.bcolor = "#fff"
          modelWidget.width = "2"
          modelWidget.layout_id = layout_id;
          await modelWidget.save();
          let widgetID = modelWidget._id;

          if (i == 0) {
            locationData.push({
              w: 2,
              h: 3,
              x: 0,
              y: 0,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 1) {
            locationData.push({
              w: 3,
              h: 3,
              x: 2,
              y: 0,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 2) {
            locationData.push({
              w: 7,
              h: 3,
              x: 5,
              y: 0,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 3) {
            locationData.push({
              w: 7,
              h: 12,
              x: 0,
              y: 3,
              i: widgetID,
              // i: widgetID,minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 4) {
            locationData.push({
              w: 5,
              h: 12,
              x: 7,
              y: 3,
              i: widgetID,
              // minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 5) {
            locationData.push({
              w: 8,
              h: 3,
              x: 0,
              y: 15,
              i: widgetID,
              // minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          } else if (i == 6) {
            locationData.push({
              w: 4,
              h: 3,
              x: 8,
              y: 15,
              i: widgetID,
              // minW: 2, minH: 3,
              moved: false,
              static: false,
            });
          }
        }
        let modelLocation = new Locationmodel();
        modelLocation.layout = locationData;
        modelLocation.layout_id = layout_id;
        await modelLocation.save();
      }
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public updateSelectedLayout = async (req: any) => {
    try {
      let {id,checked} = req?.body;
      let blob = {
        $set: {
          checked: checked,
          
        },
      };
      await selectedLayoutmodel.updateOne({ _id: id }, blob);

      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public updateSelectedLayoutName = async (req: any) => {
    try {
      let {id, name} = req?.body;
      let blob = {
        $set: {
          name:name
        },
      };
      await selectedLayoutmodel.updateOne({ _id: id }, blob);

      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };

  public updateWidgetSettings = async (req: any) => {
    try {
      let {id, color, width} = req?.body;
      let blob = {
        $set: {
          color: color,
          width: width
        },
      };
      await widgetmodel.updateOne({ _id: id }, blob);

      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public addaudioLayout = async (req: any) => {
    try {
      let layout_id = req?.body.layout_id;
      let audio = req?.body.content;
      let volume = req?.body.volume;
      let muted = req?.body.muted;
      let selectedAudioId = req?.body.selectedAudioId
      let blob = {
        $set: {
          audio : audio,
          audioSet : [volume, muted],
          audioId: selectedAudioId
        },
      };
      await selectedLayoutmodel.updateOne({ _id: layout_id }, blob);

      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public getSelectedLayout = async (req: any) => {
    try {
      let UserID = req?.body.userID;
      let data = await selectedLayoutmodel.find({userID : UserID});
      let returnData = {
        data: data,
        ack: "1",
        message: "Successful",
      }; 
      return returnData;
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public getSelectedLayoutById = async (req: any) => {
    try {
      let id = req?.body.id;
      let data = await selectedLayoutmodel.find({_id : id});
      let returnData = {
        data: data,
        ack: "1",
        message: "Successful",
      }; 
      return returnData;
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public getwidgetsApi = async (req: any) => {
    try {
      let layout_id = req?.body.layout_id;
      let data = await widgetmodel.find({ layout_id: layout_id });
      let returnData = {
        data: data,
        ack: "1",
        message: "Successful",
      };
      return returnData;
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public getSelectedLayoutData = async (req: any) => {
    try {
      let layout_id = req?.body.layout_id;
      let data = await selectedLayoutmodel.find({ _id: layout_id });
      let returnData = {
        data: data,
        ack: "1",
        message: "Successful",
      };
      return returnData;
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public getwidgetlocationAPI = async (req: any) => {
    try {
      let layout_id = req?.body.layout_id;
      let data = await Locationmodel.find({ layout_id: layout_id });
      let returnData = {
        data: data[0].layout,
        ack: "1",
        message: "Successful",
      };
      return returnData;
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  // public getalllayoutAPI = async (req: any) => {
  //     try{
  //     let data = await selectedLayout.find();
  //     let returnData = {
  //         data: data,
  //         ack: "1",
  //         message: "Successful"
  //     }
  //     return returnData;
  //     }
  //     catch(error){
  //         return {
  //             ack: "0",
  //             message: "Something went wrong"
  //         }
  //     }
  // }

  public getbgpictureApi = async (req: any) => {
    try {
      let layout_id = req?.body.layout_id;
      let data = await BgImagemodel.find({ layout_id: layout_id });
      let returned: any = "";
      if (data.length != 0) {
        returned = data[0].BgImage;
      }
      let returnData = {
        data: returned,
        ack: "1",
        message: "Successful",
      };
      return returnData;
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };

  public getruleapi = async (req: any) => {
    try {
      const { ChannelRulesName,RuleType, UserId} = req.body.user;
      const id = req.body.user._id;
      let IpAddressMin='';
      let IpAddressMax='';
      if(req.body.user.RuleType.IpAddress){
        let IP= req.body.user.RuleType.IpAddress;
        if(IP.SingleIpAddress){
         IpAddressMin=IP.SingleIpAddress;
         IpAddressMax=IP.SingleIpAddress;
        }else if(IP.IpAddressRange){
         let data1 =IP.IpAddressRange.split("-");
         IpAddressMin=data1[0].trim();
         IpAddressMax=data1[1].trim();
        }else if(IP.IpAddressAndSubnet){
         let data1 =IP.IpAddressAndSubnet.split("/");
         IpAddressMin=data1[0].trim();
         let replace=IpAddressMin.split(".");
         let add=parseInt(data1[1].trim()) + parseInt(replace[3].trim());
         let replacee=add.toString();
         replace[3]=replacee;
         IpAddressMax= `${replace[0].trim()}.${replace[1].trim()}.${replace[2].trim()}.${replace[3].trim()}`;
        }
      }else {
        IpAddressMin:"";
        IpAddressMax:"";
      }
      let blob = {
        $set: {
          ChannelRulesName :ChannelRulesName,
          RuleType:RuleType,
          IpAddressMin:IpAddressMin,
        IpAddressMax:IpAddressMax,
        },
      };
      let blob1= {
        $set: {
          ChannelRulesName :ChannelRulesName,
          IpAddressMin:IpAddressMin,
          IpAddressMax:IpAddressMax,
        },
      };
      let dataAvailable = await channelRulemodel.find({UserId : UserId, ChannelRulesName : ChannelRulesName});
      let dataRule = await channelRulemodel.findOne({_id : id});
      if(dataRule?.ChannelRulesName == ChannelRulesName){
        await channelRulemodel.updateOne({ _id: id }, blob);
          return {
            ack: "1",
            message: "Channel rule updated",
          };
      }else{
        // if(dataAvailable.length == 0){
          await channelRulemodel.updateOne({ _id: id }, blob);
          // await channelInfomodel.updateOne({ ChannelRulesId: id }, blob1);
          let dataFindChannel = await channelInfomodel.aggregate([
            {$unwind: "$PropertyType"},
            {$match: {"PropertyType.ChannelRulesId" : id }}
          ]);
    
          if(dataFindChannel.length>0){
          
           for(let i = 0 ; i < dataFindChannel.length; i++){
            let propertyTypeArr = dataFindChannel[i].PropertyType;
              if( dataFindChannel[i].PropertyType ){
                propertyTypeArr.ChannelRulesId = id;
                propertyTypeArr.ChannelRulesName = ChannelRulesName;
                
              }
              await channelInfomodel.updateOne({_id: dataFindChannel[i]._id},{$set:{PropertyType : propertyTypeArr}});
            }
            
         }
         

          return {
            ack: "1",
            message: "Channel rule updated",
          };
        // }else{
        //   return {
        //     ack: "1",
        //     message: "Channel rule name already exists",
        //   };
        // }
      }
      
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public SaveChannelRule = async (req: any,res: Response<any, Record<string, any>>) => {
    try{
      const {ChannelRulesName,RuleType} = req.body.user;
      let UserId = req.body.userId;
      let IP= req.body.user.RuleType.IpAddress;
     let IpAddressMin='';
     let IpAddressMax='';
     let TableIp='';
    if(IP){ 
      if(IP.SingleIpAddress){
      IpAddressMin=IP.SingleIpAddress;
      IpAddressMax=IP.SingleIpAddress;
      TableIp=IP.SingleIpAddress;
     }else if(IP.IpAddressRange){
      let data1 =IP.IpAddressRange.split("-");
      IpAddressMin=data1[0];
      IpAddressMax=data1[1];
      TableIp=IP.IpAddressRange;
     }else if(IP.IpAddressAndSubnet){
      let data1 =IP.IpAddressAndSubnet.split("/");
      IpAddressMin=data1[0];
      let replace=IpAddressMin.split(".");
      let add=parseInt(data1[1]) + parseInt(replace[3]);
      let replacee=add.toString();
      replace[3]=replacee;
      IpAddressMax= ` ${replace[0]}.${replace[1]}.${replace[2]}.${replace[3]}`;
      TableIp=IP.IpAddressAndSubnet;
     }
    }

      let dataAvailable = await channelRulemodel.find({UserId : UserId, ChannelRulesName : ChannelRulesName});
      // if(dataAvailable.length == 0){
        let model = new channelRulemodel();
        model.ChannelRulesName=ChannelRulesName,
        model.RuleType=RuleType,
        model.UserId=UserId,
        model.IpAddressMin=IpAddressMin,
        model.IpAddressMax=IpAddressMax,
        model.TableIp=TableIp;
        model.save();
        return {
          ack: "1",
          message: "Channel rule updated",
        };
      // }else{
      //   return {
      //     ack: "1",
      //     message: "Channel rule name already exists",
      //   };
      // }
       
    }
    catch(error){
        return {
            ack: "0",
            message: "Something went wrong"
        }
    }
  }



  public SaveProperty = async (req: any,res: Response<any, Record<string, any>>) => {
    try{
        const {Name, Address1,Address2,Country,State,City,Zip,PhoneNumber,Email,ContactName} = req.body.user;
        let UserId = req.body.userId;
        let model = new PropertyInfomodel();
        model.Name=Name;
        model.Address1 = Address1;
        model.Address2 = Address2;
        model.Country = Country;
        model.State= State;  
        model.City= City;  
        model.Zip = Zip;
        model.PhoneNumber = PhoneNumber;
        model.Email= Email;  
        model.ContactName= ContactName;  
        model.UserId=UserId;
  
  
        model.save();
        return {
          ack: "1",
          message: "Successful",
        };
    }
    catch(error){
        return {
            ack: "0",
            message: "Something went wrong"
        }
    }
  }

public UpdateProperty = async (req: any) => {
  try {
    const { Name, Address1,Address2,Country,State,City,Zip,PhoneNumber,Email,ContactName} = req.body.user;
    const id = req.body.id;
    
    let blob = {
      $set: {
        Name:Name,
        Address1 : Address1,
        Address2 : Address2,
        Country : Country,
        State: State,  
        City: City,  
        Zip : Zip,
        PhoneNumber : PhoneNumber,
        Email: Email,  
        ContactName: ContactName,          },
    };
    await PropertyInfomodel.updateOne({ _id: id }, blob);
    return {
      ack: "1",
      message: "Successful",
    };

  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};
public UpdateChannelRuleforChannel = async (req: any, res: any) => {
  try {
    const { id, ruleid, ChannelRulesName, UserId,ruleForProperty,ruleDelete} = req.body;
    let blob = {
      $set: {
        ChannelRulesId : ruleid,
        ChannelRulesName: ChannelRulesName
      },
    };
   

  if(ruleDelete){   
    let dataAvailable = await channelInfomodel.find({_id : id });

    if(dataAvailable){
    
      if(dataAvailable[0].PropertyType && dataAvailable[0].PropertyType.length){
        let propertyTypeArr = dataAvailable[0].PropertyType;
        for(let i = 0 ; i < propertyTypeArr.length; i++){
          if(ruleForProperty === propertyTypeArr[i].PropertyId ){
            propertyTypeArr[i]["ChannelRulesId"] = "";
            propertyTypeArr[i]["ChannelRulesName"] ="";
            break;
          }
        }
        await channelInfomodel.updateOne({_id: id},{$set:{PropertyType : propertyTypeArr}});
      }
      
   }
}
else { 
      let dataAvailable:any = await channelInfomodel.findOne({_id: id});
      if(dataAvailable.PropertyType && dataAvailable.PropertyType.length)
      {
        let propertyTypeArr = dataAvailable.PropertyType;
        for(let i = 0 ; i < propertyTypeArr.length; i++)
        {
          if(ruleForProperty === propertyTypeArr[i].PropertyId )
          {
            propertyTypeArr[i]["ChannelRulesId"] = ruleid;
            propertyTypeArr[i]["ChannelRulesName"] = ChannelRulesName;
            break;
          }
        }
        await channelInfomodel.updateOne({_id: id},{$set:{PropertyType : propertyTypeArr}});
      }
   }
   
    return {
      ack: "1",
      message: "Successful",
    };
  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};
public UpdateSelectedLayoutProp = async (req: any, res: any) => {
  try {
    const { name, propertyData, id} = req.body;
    let blob = {
      $set: {
        name : name,
        propertyData: propertyData,
      },
    };
    await selectedLayoutmodel.updateOne({ _id: id }, blob);
    return {
      ack: "1",
      message: "Layout updated Successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};
public getviewData = async (req: any, res: any) => {
  try {
    const {id} = req.body;
    let returned = await channelViewmodel.find({
      channel_id : id,
      createdAt: {
        $gte: new Date(new Date().getTime() - 43200000),
        $lte: new Date()
      }
    })
    return {
      data: returned,
      ack: "1",
      message: "Layout updated Successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};


  public getloginapi = async (req: any, res: any) => {
    try {
      const { customerId, AccountNo, MobileNo, password } = req.body;
      let user = await loginDataomodel.findOne({ customerId: customerId });
      if (user) {
        if(customerId == "Admin" || user?.type == "admin"){
            let defaultPassword = user.Default_password ? user.Default_password : undefined;
            if(defaultPassword){
              if(password == defaultPassword)
              {
                res.send({ message: "login seccessfull", data: user, dataFirst: true });
                return;
              }
            }
            const doesPasswordMatch = bcrypt.compareSync(password, user.password);
            if (doesPasswordMatch) {
              if(password == "$uper@dmin@123"){
              res.send({ message: "login seccessfull", data: user, dataFirst: true });
              }else{
              res.send({ message: "login seccessfull", data: user, dataFirst: false });
              }
            } else res.send({ message: "password not matched" });
        }else{
          if (AccountNo == user.accountNo && MobileNo == user.mobileNo) {
            const doesPasswordMatch = bcrypt.compareSync(password, user.password);
            if (doesPasswordMatch) {
              res.send({ message: "login seccessfull", data: user });
            } else res.send({ message: "password not matched" });
          } else res.send({ message: "Invalid details" });
        }
      } else {
        res.send({ message: "user not registered" });
      }
      
      // let model = new loginDataomodel();
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };

  public getalldataapi = async (req: any, res: any) => {
    try { 
      let UserId =req?.body.UserId;
      let channelInfodata:any = await channelInfomodel.find({UserId: UserId});
      let channelRuledata:any = await channelRulemodel.find({UserId: UserId});
      let allProperties:any = await PropertyInfomodel.find({});
      let myAllPropData = {};
      for(let i = 0 ; i< allProperties.length;i++){
        let arr:any = [];
        for(let j = 0 ;j < channelInfodata.length; j++){
          if(channelInfodata[j].PropertyName==allProperties[i].Name){
            arr.push(channelInfodata[j].PropertyName);
          }
        }
        myAllPropData[allProperties[i].Name] = arr;
      }

      const data = {
        channelInfodata:channelInfodata,
        channelRuledata:channelRuledata,
          propertyData : myAllPropData
        };
      res.send(data);
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public DeleteRule = async (req: any) => {
    try {
      let id1 = req?.body.id1;
      let dataFindChannel = await channelInfomodel.aggregate([
        {$unwind: "$PropertyType"},
        {$match: {"PropertyType.ChannelRulesId" : id1 }}
      ]);

      if(dataFindChannel.length>0){
      
       for(let i = 0 ; i < dataFindChannel.length; i++){
        let propertyTypeArr = dataFindChannel[i].PropertyType;
          if( dataFindChannel[i].PropertyType ){
            propertyTypeArr.ChannelRulesId = "";
            propertyTypeArr.ChannelRulesName = "";
            
          }
          await channelInfomodel.updateOne({_id: dataFindChannel[i]._id},{$set:{PropertyType : propertyTypeArr}});
        }
        
     }
     await channelRulemodel.deleteOne({ _id: id1 });

      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public getallProperty = async (req: any, res: any) => {
    try { 
      let UserId = JSON.parse(req?.body.UserId);
      let Property = await PropertyInfomodel.find({UserId: UserId});
      const data = Property;
      res.send(data);
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
  public getallAdminData = async (req: any, res: any) => {
    try { 
      let Property = await PropertyInfomodel.find({});
      let channels = await channelInfomodel.find({});
      let users = await loginDataomodel.find({});
      let layouts = await selectedLayoutmodel.find({});
      let ruleData=await channelRulemodel.find({});
      let u = users.map(value => {
        let count = 0
        for(let i = 0; i< ruleData.length; i++) {
          if(ruleData[i].UserId == String(value._id)) count++;
        }
        return Object.assign({}, value.toObject(), {count:count});
      })
      const data = {
        property: Property,
        channels: channels,
        users: u,
        layouts: layouts,
        ruleData:ruleData
      };
      res.send(data);
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };
public getusersLength = async (req: any, res: any) => {
  try { 
    let users = await loginDataomodel.find({});
    let withoutAdmin = users.filter(u => {
      if(u.type == "Admin" || u.customerId == "Admin") return false;
      else return true;
    })
    const data = {
      users: withoutAdmin.length,
    };
    res.send(data);
  } catch (error) {
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};

  public DeleteProperty = async (req: any) => {
    try {
      let id1 = req?.body.id1;
      await PropertyInfomodel.deleteOne({ _id: id1 });
      await channelInfomodel.updateMany({PropertyType:{$elemMatch: {PropertyId: id1}}}, {$pull:{PropertyType:{PropertyId:id1}}});
      await selectedLayoutmodel.updateMany({propertyData:{$elemMatch: {PropertyId: id1}}}, {$pull:{propertyData:{PropertyId:id1}}});
      await channelInfomodel.deleteMany({PropertyType : {$exists:true, $size:0}});
      // await channelInfomodel.deleteMany({ PropertyId: id1});
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };

  public getalluserdataapi = async (req: any, res: any) => {
    try { 
      let channelInfodata = await channelInfomodel.find();
      const data = channelInfodata;
      res.send(data);
    } catch (error) {
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };


  public DeleteChannelRow = async (req: any) => {
    try {
      let id1 = req?.body.id1;
      let propertyId =  req?.body.propertyId;

      let channelData:any = await channelInfomodel.findOne({_id : id1});
      let propertyArray : any = channelData.PropertyType ?  channelData.PropertyType : [];
      if(propertyArray.length  > 1){
        propertyArray.map((e, i)=>{
          if(e.PropertyId == propertyId){
            propertyArray.splice(i, 1);
          }
        })
        let blob1= {
          $set: {
            PropertyType : propertyArray
          },
        };
        await channelInfomodel.updateMany({_id:id1},blob1);
      }else{
        await channelInfomodel.deleteOne({ _id: id1 });
      }
      // await channelInfomodel.deleteOne({ _id: id1 });
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
  };

  public UpdateChannelRow = async (req: any) => {
    try {
      let program = req?.body.program;
      let id1 = req?.body.program._id;
   
      // let data1=program.videoSource[1].trim().split('  ').filter(word=>word!=='');
      // program.videoSource[1]=data1.join(' ');
      let blob1 = {
        $set: {
        channelName:program.channelName,
      channelDescription : program.channelDescription,
      channel_category:program.channel_category,
      channel_language: program.channel_language,
      programIcon: program.programIcon,
      videoSource:program.videoSource,
      program:program.program,
      PropertyType:program.PropertyType,
        }
      };
      if(id1)
     { await channelInfomodel.updateOne({ _id: id1 }, blob1);}
      return {
        ack: "1",
        message: "Successful",
      };
    } catch (error) {
      console.log(error);
      return {
        ack: "0",
        message: "Something went wrong",
      };
    }
}
public getInfoapi = async (req: any,res: Response<any, Record<string, any>>) => {
  try{
    const {channelName,channelDescription ,channel_category,channel_language,programIcon,program,videoSource,PropertyType} = req.body.data;  
    let UserId = req.body.UserId;
      let model = new channelInfomodel();
      model.channelName=channelName,
      model.channelDescription = channelDescription,
      model.channel_category=channel_category,
      model.channel_language= channel_language,
      model.programIcon= programIcon,
      model.videoSource=videoSource,
      model.program=program,  
      model.UserId=UserId;
      model.PropertyType=PropertyType;

      model.save();
      return {
        ack: "1",
        message: "Successful",
      };
  }
  catch(error){
      return {
          ack: "0",
          message: "Something went wrong"
      }
  }
}
public DeleteUser = async (req: any) => {
  try {
    let id = req?.body.id;
    await loginDataomodel.deleteOne({ _id: id });
    return {
      ack: "1",
      message: "Successful",
    };
  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};
public getbackendversion = async (req: any) => {
  try {
    let bversion = backendVersion.version;
    return bversion;

  } catch (error) {
      return null;
  }
};
public SaveUpdateUser = async (req: any) => {
  try {
    let id = req?.body.id;
    let UserName = req?.body.UserName;
    let Password = req?.body.Password;
    let Phone = req?.body.Phone;
    let account = req?.body.account;
    let ActionType = req?.body.ActionType;
    let type = req?.body.type;
    let userOld = await loginDataomodel.findOne({ customerId: UserName });
    
    if(ActionType == "Add"){
      if(userOld){
        return {
          ack: "0",
          message: "User already exist, Please enter different username",
        };
      }
      let model = new loginDataomodel();
      model.customerId= UserName;
      model.accountNo = account;
      model.mobileNo = Phone;
      model.type = type;
      const salt = await bcrypt.genSalt(10);
      model.password = await bcrypt.hash(Password, salt);
      model.save();
    }else{
      let blob = {};
      if(Password != ""){
        const salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(Password, salt);
         blob = {
          $set: {
            customerId:UserName,
            accountNo : account,
            mobileNo : Phone,
            password : hashedPassword,
            type: type
          },
        };
      }else{
         blob = {
          $set: {
            customerId:UserName,
            accountNo : account,
            mobileNo : Phone,
            type: type         
          },
        };
      }
      
      await loginDataomodel.updateOne({_id: id}, blob);
    }
    return {
      ack: "1",
      message: "Successful",
    };
  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};
public changePassword = async (req: any) => {
  try {
    let id = req?.body.id;
    let UserName = req?.body.UserName;
    let Password = req?.body.Password;
    let oldpassword = req?.body.oldpassword;
    let Phone = req?.body.Phone;
    let account = req?.body.account;
    let type = req?.body.type;
    let userOld:any = await loginDataomodel.findOne({ customerId: UserName });
    
      let blob = {};
      if(oldpassword != ""){
        const doesPasswordMatch = bcrypt.compareSync(oldpassword, userOld.password);
        if(!doesPasswordMatch){
          return {
            ack: "0",
            message: "Password Incorrect",
          };
        }
      }
      if(Password != ""){
        const salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(Password, salt);
         blob = {
          $set: {
            customerId:UserName,
            accountNo : account,
            mobileNo : Phone,
            password : hashedPassword,
            type: type
          },
        };
      }else{
        return {
          ack: "0",
          message: "Please enter password",
        };
      }
      
      await loginDataomodel.updateOne({_id: id}, blob);
    
    return {
      ack: "1",
      message: "Successful",
    };
  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};
public updateClientIdForClient = async (req: any, res: any) => {
  try {
    const {GoogleDriveClientId,GoogleDriveKey ,DropboxKey, weatherApiKey} = req.body.data;  
    let ids=req.body.id;
    let blob = {
      $set: {
        GoogleDriveClientId : GoogleDriveClientId,
        GoogleDriveKey: GoogleDriveKey,
        DropboxKey:DropboxKey,
        weatherApiKey: weatherApiKey
      },
    };
    await tokenDatamodel.updateOne({ _id: ids }, blob);
    return {
      ack: "1",
      message: "Successful",
    };
  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};
public getClientIdData = async (req: any, res: any) => {
  try { 
    let Property = await tokenDatamodel.find({});
    const data = Property;
    res.send(data);
  } catch (error) {
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
};
public setClientIdApi = async (req: any,res: Response<any, Record<string, any>>) => {
  try{
    const {GoogleDriveClientId,GoogleDriveKey ,DropboxKey, weatherApiKey} = req.body.data;  
    await tokenDatamodel.deleteMany({});
      let model = new tokenDatamodel();
      model.GoogleDriveClientId=GoogleDriveClientId,
      model.GoogleDriveKey = GoogleDriveKey,
      model.DropboxKey=DropboxKey,
      model.weatherApiKey=weatherApiKey,
      model.save();
      return {
        ack: "1",
        message: "Successful",
      };
  }
  catch(error){
      return {
          ack: "0",
          message: "Something went wrong"
      }
  }
}
}

export const globalServicesV1 = new GlobalServices();
