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
import { licenseCheckModel } from "../../../model/licensemodel";
var jwt = require("jsonwebtoken");

class AppServices {
  public getauthenticationData = async (channelRuleIPData) => {
    let idArray :any = [];
    // let dataFindChannel = await channelInfomodel.find({ ChannelRulesId: { $in: channelRuleIPData } })
for( let i=0;i<channelRuleIPData.length;i++){
  let dataFindChannel = await channelInfomodel.aggregate([
    {$unwind: "$PropertyType"},
    {$match: {"PropertyType.ChannelRulesId" : channelRuleIPData[i] }}
  ]);
  dataFindChannel.map ((eid, indexId)=>{
    idArray.push(eid._id);
  })
}
   
    return idArray;
  }
  public getauthentication = async (req, res) => {
    try {
    let data = req.body;
    let secretKey = data.secretKey ? data.secretKey : "";
    let macaddress = data.macaddress ? data.macaddress : "";
    let latitude = data.latitude ? parseFloat(data.latitude) : 0;
    let longitude = data.longitude ? parseFloat(data.longitude) : 0;
    let IPaddress =(req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.connection.remoteAddress.split(':')[ req.connection.remoteAddress.split(':').length-1];
    // let IPaddress =(req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.body.IPaddress;

    // let IPaddress = data.ipaddress ? data.ipaddress : "";
    // let IPaddress = req.ip;
    let valid = data.isValid;
    

    var payload ;

    let result = {};
    if (valid === "0") {
      if (IPaddress == null || IPaddress == undefined || IPaddress == "") {
        result = {
          error: "IP not valid",
        };
      } else{
        // let detailIPdata = await channelRulemodel.find({RuleType: IPaddress});
        let detailIPdata = await channelRulemodel.aggregate([
          {$unwind: "$RuleType"},
          // {$match: {"RuleType.IpAddress" : IPaddress }}
          {$project: {
            _id: 1, 
            ChannelRulesName : 1,
            matches: { "$and":[
                  {$lte: [ "$IpAddressMin", IPaddress ]},
                {$gte: [ "$IpAddressMax", IPaddress ]},
              ]}
            }
          }, 
        ]);
        if (detailIPdata.length > 0) {
          let channelRuleIPData :any = [];
          let idArray :any = [];
          detailIPdata.map((elem, i)=>{
            if(elem.matches){
              channelRuleIPData.push(elem._id.toString());
            }
          })
          idArray = await this.getauthenticationData(channelRuleIPData);
          payload = {
            data : idArray 
          }
         if(payload.data.length>0)
        {const tokenData = jwt.sign(payload, secretUtil.ApppublicKey, { expiresIn: "24h" });
          result = {
            authToken: tokenData,
          };
        }
          else {
            result = {
              error: "IP not valid",
            };
          }
        } 
        // else {
        //   result = {
        //     error: "IP not valid",
        //   };
        // }
      }
      
    } else if(valid === "1") {
      // let tokens = await channelInfomodel.find({AccountNumber: secretKey});
      let tokens = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$match: {"RuleType.AccountNumber" : secretKey }}
      ]);
      if (tokens.length === 0) {
        result = {
          error: "Secret Key Not Found",
        };
      } else {
        let idArray :any = [];
        let channelRuleIPData :any = [];
        tokens.map((elem, i)=>{
          channelRuleIPData.push(elem._id.toString());
        })
        // channelRuleIPData.map(async (elem, i)=>{
        //   let dataFindChannel = await channelInfomodel.find({ChannelRulesId : elem})
        //   dataFindChannel.map ((eid, indexId)=>{
        //     idArray.push(eid);
        //   })
        // })
        
        idArray = await this.getauthenticationData(channelRuleIPData);
        payload = {
          data : idArray
        }
        const tokenData = jwt.sign(payload, secretUtil.ApppublicKey, { expiresIn: "24h" });
        result = {
          authToken: tokenData,
        };
      }
    }else if(valid === "2") {
      // let tokens = await channelInfomodel.find({MacAddress: macaddress});
      let tokens = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$match: {"RuleType.MacAddress" : macaddress }}
      ]);
      if (tokens.length === 0) {
        result = {
          error: "MAC Address Not Found",
        };
      } else {
        let idArray :any = [];
        let channelRuleIPData :any = [];
        tokens.map((elem, i)=>{
          channelRuleIPData.push(elem._id.toString());
        })
        // channelRuleIPData.map(async (elem, i)=>{
        //   let dataFindChannel = await channelInfomodel.find({ChannelRulesId : elem})
        //   dataFindChannel.map ((eid, indexId)=>{
        //     idArray.push(eid);
        //   })
        // })
        
        idArray = await this.getauthenticationData(channelRuleIPData);
        payload = {
          data : idArray
        }
        const tokenData = jwt.sign(payload, secretUtil.ApppublicKey, { expiresIn: "24h" });
        result = {
          authToken: tokenData,
        };
      }
    }else if(valid === "3") {
      // let tokens = await channelInfomodel.find({MacAddress: macaddress});
      let tokens = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$project: {
          _id: 1, 
          ChannelRulesName : 1,
          matches: { "$and":[
                {$lte: [ "$RuleType.Geo_Location_Original.longitude_Minm", longitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.longitude_Maxm", longitude ]},
                {$lte: [ "$RuleType.Geo_Location_Original.latitude_Minm", latitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.latitude_Maxm", latitude ]},
            ]}
       }
}, 
      ]);

      if (tokens.length === 0) {
        result = {
          error: "Geo_Location Not Found",
        };
      } else {
        let idArray :any = [];
        let channelRuleIPData :any = [];
        tokens.map((elem, i)=>{
          if(elem.matches){
            channelRuleIPData.push(elem._id.toString());
          }
        })
        // channelRuleIPData.map(async (elem, i)=>{
        //   let dataFindChannel = await channelInfomodel.find({ChannelRulesId : elem})
        //   dataFindChannel.map ((eid, indexId)=>{
        //     idArray.push(eid);
        //   })
        // })
        
        idArray = await this.getauthenticationData(channelRuleIPData);
        payload = {
          data : idArray
        }
        const tokenData = jwt.sign(payload, secretUtil.ApppublicKey, { expiresIn: "24h" });
        result = {
          authToken: tokenData,
        };
      }
    } else if(valid === "4") {
      // let tokens = await channelInfomodel.find({MacAddress: macaddress});
      // let tokens = await channelRulemodel.aggregate([
      //   {$unwind: "$RuleType"}, {$match: {"RuleType.MacAddress" : macaddress }}    {$and: [{'exam': 'halfyr_T'},{'std': '9'}
      // ]);
      let tokens = await channelRulemodel.aggregate([
          {$unwind: "$RuleType"}, {$match:{$and:[{"RuleType.MacAddress" : macaddress}, {"RuleType.IpAddress" : IPaddress}, 
          // {"RuleType.Geo_Location" : Geo_Location}
        ]}}   
        ]);

      if (tokens.length === 0) {
        result = {
          error: "Data Not Found",
        };
      } else {
        let idArray :any = [];
        let channelRuleIPData :any = [];
        tokens.map((elem, i)=>{
          channelRuleIPData.push(elem._id.toString());
        })
        // channelRuleIPData.map(async (elem, i)=>{
        //   let dataFindChannel = await channelInfomodel.find({ChannelRulesId : elem})
        //   dataFindChannel.map ((eid, indexId)=>{
        //     idArray.push(eid);
        //   })
        // })
        
        idArray = await this.getauthenticationData(channelRuleIPData);
        payload = {
          data : idArray
        }
        const tokenData = jwt.sign(payload, secretUtil.ApppublicKey, { expiresIn: "24h" });
        result = {
          authToken: tokenData,
        };
      }
    } else if(valid === "5") {
      let channelRuleIPData : any = [];
      let channelRuleMacData: any = [];
      let channelRuleGeoData: any = [];
      if (IPaddress == null || IPaddress == undefined || IPaddress == "") {
        result = {
          error: "IP not valid",
        };
      } else{
        let detailIPdata = await channelRulemodel.aggregate([
          {$unwind: "$RuleType"},
          {$project: {
            _id: 1, 
            ChannelRulesName : 1,
            matches: { "$and":[
                  {$lte: [ "$IpAddressMin", IPaddress ]},
                {$gte: [ "$IpAddressMax", IPaddress ]},
              ]}
            }
          }, 
        ]);
        if (detailIPdata.length > 0) {
          detailIPdata.map((elem, i)=>{
            if(elem.matches){
              channelRuleIPData.push(elem._id.toString());
            }
          })
        } else {
          result = {
            error: "IP not valid",
          };
          res.status(400).send(result);
        }
      }


      let tokensMac = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$match: {"RuleType.MacAddress" : macaddress }}
      ]);
      if (tokensMac.length === 0) {
        result = {
          error: "MAC Address Not Found",
        };
        res.status(400).send(result);
      } else {
        tokensMac.map((elem, i)=>{
          channelRuleMacData.push(elem._id.toString());
        })
      }


      let tokensGeo = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$project: {
          _id: 1, 
          ChannelRulesName : 1,
          matches: { "$and":[
                {$lte: [ "$RuleType.Geo_Location_Original.longitude_Minm", longitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.longitude_Maxm", longitude ]},
                {$lte: [ "$RuleType.Geo_Location_Original.latitude_Minm", latitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.latitude_Maxm", latitude ]},
            ]}
       }
}, 
      ]);

      if (tokensGeo.length === 0) {
        result = {
          error: "Geo_Location Not Found",
        };
        res.status(400).send(result);
      } else {
        tokensGeo.map((elem, i)=>{
          if(elem.matches){
            channelRuleGeoData.push(elem._id.toString());
          }
        })
      }
      let tokens:any = [];
      for(let i =0; i<channelRuleIPData.length; i++){
        if(channelRuleGeoData.includes(channelRuleIPData[i]) && channelRuleMacData.includes(channelRuleIPData[i])){
          tokens.push(channelRuleIPData[i]);
        }
      }

      if (tokens.length === 0) {
        result = {
          error: "Data Not Found",
        };
      } else {
        let idArray :any = [];
        idArray = await this.getauthenticationData(tokens);
        payload = {
          data : idArray
        }
        const tokenData = jwt.sign(payload, secretUtil.ApppublicKey, { expiresIn: "24h" });
        result = {
          authToken: tokenData,
        };
      }
    
    } else if(valid === "6") {
      let channelRuleIPData : any = [];
      let channelRuleGeoData: any = [];
      if (IPaddress == null || IPaddress == undefined || IPaddress == "") {
        result = {
          error: "IP not valid",
        };
      } else{
        let detailIPdata = await channelRulemodel.aggregate([
          {$unwind: "$RuleType"},
          {$project: {
            _id: 1, 
            ChannelRulesName : 1,
            matches: { "$and":[
                  {$lte: [ "$IpAddressMin", IPaddress ]},
                {$gte: [ "$IpAddressMax", IPaddress ]},
              ]}
            }
          }, 
        ]);
        if (detailIPdata.length > 0) {
          detailIPdata.map((elem, i)=>{
            if(elem.matches){
              channelRuleIPData.push(elem._id.toString());
            }
          })
        } else {
          result = {
            error: "IP not valid",
          };
          res.status(400).send(result);
        }
      }

      let tokensGeo = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$project: {
          _id: 1, 
          ChannelRulesName : 1,
          matches: { "$and":[
                {$lte: [ "$RuleType.Geo_Location_Original.longitude_Minm", longitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.longitude_Maxm", longitude ]},
                {$lte: [ "$RuleType.Geo_Location_Original.latitude_Minm", latitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.latitude_Maxm", latitude ]},
            ]}
       }
}, 
      ]);

      if (tokensGeo.length === 0) {
        result = {
          error: "Geo_Location Not Found",
        };
        res.status(400).send(result);
      } else {
        tokensGeo.map((elem, i)=>{
          if(elem.matches){
            channelRuleGeoData.push(elem._id.toString());
          }
        })
      }
      let tokens:any = [];
      for(let i =0; i<channelRuleIPData.length; i++){
        if(channelRuleGeoData.includes(channelRuleIPData[i])){
          tokens.push(channelRuleIPData[i]);
        }
      }

      if (tokens.length === 0) {
        result = {
          error: "Data Not Found",
        };
      } else {
        let idArray :any = [];
        idArray = await this.getauthenticationData(tokens);
        payload = {
          data : idArray
        }
        const tokenData = jwt.sign(payload, secretUtil.ApppublicKey, { expiresIn: "24h" });
        result = {
          authToken: tokenData,
        };
      }
    }
    res.status(200).send(result);

    } catch (error) {
      console.log(error);
      let resultData= {
        ack: "0",
        message: "Something went wrong",
      };
      res.status(400).send(resultData);
    }
}
  public verifycredentials = async (req: any, res: any) => {
    try {
      let data = req.body;
    let secretKey = data.secretKey ? data.secretKey : "";
    let macaddress = data.macaddress ? data.macaddress : "";
    let latitude = data.latitude ? parseFloat(data.latitude) : 0;
    let longitude = data.longitude ? parseFloat(data.longitude) : 0;
    // let IPaddress =(req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.body.IPaddress;
    let IPaddress =(req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.connection.remoteAddress.split(':')[ req.connection.remoteAddress.split(':').length-1];
    let valid = data.isValid;

    let result = {};
    if (valid === "0") {
      if (IPaddress == null || IPaddress == undefined || IPaddress=="") {
        result = {
          error: "IP not valid",
        };
      } else {
        let detailIPdata = await channelRulemodel.aggregate([
          {$unwind: "$RuleType"},
          {$project: {
            _id: 1, 
            ChannelRulesName : 1,
            matches: { "$and":[
                  {$lte: [ "$IpAddressMin", IPaddress ]},
                {$gte: [ "$IpAddressMax", IPaddress ]},
              ]}
            }
          }, 
        ]);
        let channelRuleIPData :any = [];
        if (detailIPdata.length > 0) {
          detailIPdata.map((elem, i)=>{
            if(elem.matches){
              channelRuleIPData.push(elem._id.toString());
            }
          })
        } else {
          result = {
            error: "IP not valid",
          };
        }

        if (channelRuleIPData.length > 0) {
          result = {
            success : "success"
          };
        }else{
          result = {
            error: "IP not valid",
          };
        }
      }
    } else if(valid === "1") {
      // let tokens = await channelInfomodel.find({AccountNumber: secretKey});
      let tokens = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$match: {"RuleType.AccountNumber" : secretKey }}
      ]);
      if(tokens.length === 0){
        result = {
          error: "Secret Key Not Found",
        };
      }else{
        result = {
          success : "success"
        };
      }
    } else if(valid === "2") {
      // let tokens = await channelInfomodel.find({MacAddress: macaddress});
      let tokens = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$match: {"RuleType.MacAddress" : macaddress }}
      ]);
      if(tokens.length === 0){
        result = {
          error: "MAC Address Not Found",
        };
      }else{
        result = {
          success : "success"
        };
      }
    } else if(valid === "3") {
      // let tokens = await channelInfomodel.find({MacAddress: macaddress});
      let tokens = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$project: {
          _id: 1, 
          ChannelRulesName : 1,
          matches: { "$and":[
                {$lte: [ "$RuleType.Geo_Location_Original.longitude_Minm", longitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.longitude_Maxm", longitude ]},
                {$lte: [ "$RuleType.Geo_Location_Original.latitude_Minm", latitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.latitude_Maxm", latitude ]},
            ]}
       }
}, 
      ]);
      
      let channelRuleIPData :any = [];
      if (tokens.length === 0) {
        result = {
          error: "Geo_Location Not Found",
        };
      } else {
        tokens.map((elem, i)=>{
          if(elem.matches){
            channelRuleIPData.push(elem._id.toString());
          }
        })
      }
      if(channelRuleIPData.length === 0){
        result = {
          error: "Geo-Location Not Found",
        };
      }else{
        result = {
          success : "success"
        };
      }
    }else if(valid === "5") {
      let channelRuleIPData : any = [];
      let channelRuleMacData: any = [];
      let channelRuleGeoData: any = [];
      if (IPaddress == null || IPaddress == undefined || IPaddress == "") {
        result = {
          error: "IP not valid",
        };
      } else{
        let detailIPdata = await channelRulemodel.aggregate([
          {$unwind: "$RuleType"},
          {$project: {
            _id: 1, 
            ChannelRulesName : 1,
            matches: { "$and":[
                  {$lte: [ "$IpAddressMin", IPaddress ]},
                {$gte: [ "$IpAddressMax", IPaddress ]},
              ]}
            }
          }, 
        ]);
        if (detailIPdata.length > 0) {
          detailIPdata.map((elem, i)=>{
            if(elem.matches){
              channelRuleIPData.push(elem._id.toString());
            }
          })
        } else {
          result = {
            error: "IP not valid",
          };
          res.status(400).send(result);
        }
      }


      let tokensMac = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$match: {"RuleType.MacAddress" : macaddress }}
      ]);
      if (tokensMac.length === 0) {
        result = {
          error: "MAC Address Not Found",
        };
        res.status(400).send(result);
      } else {
        tokensMac.map((elem, i)=>{
          channelRuleMacData.push(elem._id.toString());
        })
      }


      let tokensGeo = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$project: {
          _id: 1, 
          ChannelRulesName : 1,
          matches: { "$and":[
                {$lte: [ "$RuleType.Geo_Location_Original.longitude_Minm", longitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.longitude_Maxm", longitude ]},
                {$lte: [ "$RuleType.Geo_Location_Original.latitude_Minm", latitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.latitude_Maxm", latitude ]},
            ]}
       }
}, 
      ]);

      if (tokensGeo.length === 0) {
        result = {
          error: "Geo_Location Not Found",
        };
        res.status(400).send(result);
      } else {
        tokensGeo.map((elem, i)=>{
          if(elem.matches){
            channelRuleGeoData.push(elem._id.toString());
          }
        })
      }
      let tokens:any = [];
      for(let i =0; i<channelRuleIPData.length; i++){
        if(channelRuleGeoData.includes(channelRuleIPData[i]) && channelRuleMacData.includes(channelRuleIPData[i])){
          tokens.push(channelRuleIPData[i]);
        }
      }

      if(tokens.length === 0){
        result = {
          error: "Data Not Found",
        };
      }else{
        result = {
          success : "success"
        };
      }
    }else if(valid === "6") {
      let channelRuleIPData : any = [];
      let channelRuleGeoData: any = [];
      if (IPaddress == null || IPaddress == undefined || IPaddress == "") {
        result = {
          error: "IP not valid",
        };
      } else{
        let detailIPdata = await channelRulemodel.aggregate([
          {$unwind: "$RuleType"},
          {$project: {
            _id: 1, 
            ChannelRulesName : 1,
            matches: { "$and":[
                  {$lte: [ "$IpAddressMin", IPaddress ]},
                {$gte: [ "$IpAddressMax", IPaddress ]},
              ]}
            }
          }, 
        ]);
        if (detailIPdata.length > 0) {
          detailIPdata.map((elem, i)=>{
            if(elem.matches){
              channelRuleIPData.push(elem._id.toString());
            }
          })
        } else {
          result = {
            error: "IP not valid",
          };
          res.status(400).send(result);
        }
      }

      let tokensGeo = await channelRulemodel.aggregate([
        {$unwind: "$RuleType"},
        {$project: {
          _id: 1, 
          ChannelRulesName : 1,
          matches: { "$and":[
                {$lte: [ "$RuleType.Geo_Location_Original.longitude_Minm", longitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.longitude_Maxm", longitude ]},
                {$lte: [ "$RuleType.Geo_Location_Original.latitude_Minm", latitude ]},
              {$gte: [ "$RuleType.Geo_Location_Original.latitude_Maxm", latitude ]},
            ]}
       }
}, 
      ]);

      if (tokensGeo.length === 0) {
        result = {
          error: "Geo_Location Not Found",
        };
        res.status(400).send(result);
      } else {
        tokensGeo.map((elem, i)=>{
          if(elem.matches){
            channelRuleGeoData.push(elem._id.toString());
          }
        })
      }
      let tokens:any = [];
      for(let i =0; i<channelRuleIPData.length; i++){
        if(channelRuleGeoData.includes(channelRuleIPData[i])){
          tokens.push(channelRuleIPData[i]);
        }
      }

      if(tokens.length === 0){
        result = {
          error: "Data Not Found",
        };
      }else{
        result = {
          success : "success"
        };
      }
    
    }
    res.status(200).send(result);
    } catch (error) {
      console.log(error);
      let returnData = {
        ack: "0",
        message: "Something went wrong",
      };
      res.status(400).send(returnData);
    }
}


public getprogramdetails = async (req:any, res:any) => {
  try {
    let token = req.body.authToken;
    jwt.verify(token, secretUtil.ApppublicKey, async function( err, decoded){
      if(err){
        res.status(400).json(err);
        console.log(err)
      }
      else{
      let resultid = decoded.data;
      let resultData:any = [];
      
      for(let i=0; i<resultid.length; i++){
        await channelInfomodel.find({_id: resultid[i]})
      .then((result) => {
        if(result.length >0)
          resultData.push(result[0]);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
      }

          resultData.map((resp)=>{
            let programslist :any = resp.program;
            let programslist2 :any = [];
            if(resp.program){
              programslist.sort((a,b) => (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0));
              let programListToday:any = [];

              for(let i=0; i< programslist.length; i++){
                let starthour = parseFloat(programslist[i].startTime.split(":")[0]);
                let startminutes = parseFloat(programslist[i].startTime.split(":")[1]);
                let endhours = parseFloat(programslist[i].endTime.split(":")[0]);
                let endminutes = parseFloat(programslist[i].endTime.split(":")[1]);

                let currdateToday = new Date();
                let currdateTodayend = new Date();
                currdateToday.setHours(starthour);
                currdateToday.setMinutes(startminutes);
                programslist[i]["startToday"] = currdateToday.getTime();
                

                currdateTodayend.setHours(endhours);
                currdateTodayend.setMinutes(endminutes);
                programslist[i]["endToday"] = currdateTodayend.getTime();

                if(starthour > endhours){
                  currdateTodayend.setHours(endhours);
                  currdateTodayend.setMinutes(endminutes);
                  currdateTodayend.setDate(currdateTodayend.getDate() + 1);
                  programslist[i]["endToday"] = currdateTodayend.getTime();
                }


                let currdateTomorrow = new Date();
                let currdateTomorrowend = new Date();
                currdateTomorrow.setHours(starthour);
                currdateTomorrow.setMinutes(startminutes);
                currdateTomorrow.setDate(currdateTomorrow.getDate() + 1);
                programslist[i]["startTomorrow"] = currdateTomorrow.getTime();

                
                currdateTomorrowend.setHours(endhours);
                currdateTomorrowend.setMinutes(endminutes);
                currdateTomorrowend.setDate(currdateTomorrowend.getDate() + 1);
                programslist[i]["endTomorrow"] = currdateTomorrowend.getTime();

                if(starthour > endhours){
                  currdateTomorrowend.setHours(endhours);
                  currdateTomorrowend.setMinutes(endminutes);
                  currdateTomorrowend.setDate(currdateTomorrowend.getDate() + 2);
                  programslist[i]["endTomorrow"] = currdateTomorrowend.getTime();
                }


                programListToday.push(programslist[i]);
            }
            let count =0;
            for(let i =0; i<programListToday.length; i++){
              let currTimedate = new Date();
              let currTimeStamp = currTimedate.getTime();
              if((currTimeStamp >= programListToday[i].startToday && currTimeStamp < programListToday[i].endToday) || currTimeStamp < programListToday[i].startToday){
                if(count <= 3){
                  count++;
                  programListToday[i]["day"] = "Today";
                  programslist2.push(programListToday[i]);
                }else{
                  break;
                }
              }
            }
            if(count <= 3){
              for(let i =0; i<programListToday.length; i++){
                let currTime = new Date();
                let currTimeStamp = currTime.getTime();
                if(currTimeStamp < programListToday[i].startTomorrow){
                  if(count <= 3){
                    count++;
                    let progTom = {...programListToday[i]};
                    progTom["day"] = "Tomorrow";
                    programslist2.push(progTom);
                  }else{
                    break;
                  }
                }
              }
            }


            if(count <=3){
              let resData = [...programslist2];
              resp["program"] = resData;
            }else{
              let resData = programslist2.slice(0,3);
              resp["program"] = resData;
            }
          };
          
        }
        )
        let returnData = {
          data: resultData,
          ack: "1",
          message: "Successful",
        }
        res.status(200).send(resultData);
      
    }
  
    })
  

  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
}
public getLicenses = async (req) => {
  try {
      let requestResult = await licenseCheckModel.find({}).catch((err) => console.log(err));
      requestResult = requestResult[0]["SlugStatus"];
      return { output: requestResult };
  } catch (error) {
      return null;
  }
}
public chekKeylok = async (req) => {
  try {
      let requestResult = await licenseCheckModel.find({}).catch((err) => console.log(err));
      requestResult = requestResult[0]["Slug"];
      return { output: requestResult };
  } catch (error) {
      return null;
  }
}
public retreiveDetailbyId = async (req:any, res:any) => {
  try {
    if (!req.params.id) {
      res.status(400).json({error : "ID is missing in the query string"});
    }
    let token = req.body.authToken;
  jwt.verify(token, secretUtil.ApppublicKey, function( err, decoded){
    if(err){
      res.status(400).json(err);
      console.log(err)
    }
    else{
      let decodedData = decoded.data;
      if(decodedData.includes(req.params.id)){
    channelInfomodel.findById(req.params.id)
      .then((resp:any) => {
        let programslist = resp.program;
          let programslist2:any = [];
          if(resp.program.length > 0){
            programslist.sort((a,b) => (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0));
            let programListToday:any = [];

            for(let i=0; i< programslist.length; i++){
              let starthour = parseFloat(programslist[i].startTime.split(":")[0]);
              let startminutes = parseFloat(programslist[i].startTime.split(":")[1]);
              let endhours = parseFloat(programslist[i].endTime.split(":")[0]);
              let endminutes = parseFloat(programslist[i].endTime.split(":")[1]);

              let currdateToday = new Date();
              let currdateTodayend = new Date();
              currdateToday.setHours(starthour);
              currdateToday.setMinutes(startminutes);
              programslist[i]["startToday"] = currdateToday.getTime();
              

              currdateTodayend.setHours(endhours);
              currdateTodayend.setMinutes(endminutes);
              programslist[i]["endToday"] = currdateTodayend.getTime();

              if(starthour > endhours){
                currdateTodayend.setHours(endhours);
                currdateTodayend.setMinutes(endminutes);
                currdateTodayend.setDate(currdateTodayend.getDate() + 1);
                programslist[i]["endToday"] = currdateTodayend.getTime();
              }


              let currdateTomorrow = new Date();
              let currdateTomorrowend = new Date();
              currdateTomorrow.setHours(starthour);
              currdateTomorrow.setMinutes(startminutes);
              currdateTomorrow.setDate(currdateTomorrow.getDate() + 1);
              programslist[i]["startTomorrow"] = currdateTomorrow.getTime();

              
              currdateTomorrowend.setHours(endhours);
              currdateTomorrowend.setMinutes(endminutes);
              currdateTomorrowend.setDate(currdateTomorrowend.getDate() + 1);
              programslist[i]["endTomorrow"] = currdateTomorrowend.getTime();

              if(starthour > endhours){
                currdateTomorrowend.setHours(endhours);
                currdateTomorrowend.setMinutes(endminutes);
                currdateTomorrowend.setDate(currdateTomorrowend.getDate() + 2);
                programslist[i]["endTomorrow"] = currdateTomorrowend.getTime();
              }


              programListToday.push(programslist[i]);


          }
          let count =0;
          for(let i =0; i<programListToday.length; i++){
            let currTimedate = new Date();
            let currTimeStamp = currTimedate.getTime();
            if((currTimeStamp > programListToday[i].startToday && currTimeStamp < programListToday[i].endToday) || currTimeStamp < programListToday[i].startToday){
              if(count <= 3){
                count++;
                programListToday[i]["day"] = "Today";
                programslist2.push(programListToday[i]);
              }else{
                break;
              }
            }
          }
          if(count <= 3){
            for(let i =0; i<programListToday.length; i++){
              let currTime = new Date();
              let currTimeStamp = currTime.getTime();
              if(currTimeStamp < programListToday[i].startTomorrow){
                if(count <= 3){
                  count++;
                  let progTom = {...programListToday[i]};
                  progTom["day"] = "Tomorrow";
                  programslist2.push(progTom);
                }else{
                  break;
                }
              }
            }
          }
          if(count<=3){
          let resData = [...programslist2];
          resp["program"] = resData;
          }else{
            let resData = programslist2.slice(0,3);
          resp["program"] = resData;
          }
        };
        res.status(200).json(resp);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
    }else {
      res.status(400).json({
        error: "Details not found"
      });
    }
    }
  })

  } catch (error) {
    console.log(error);
    return {
      ack: "0",
      message: "Something went wrong",
    };
  }
}
public channelviews = async (req, res) => {
  try {
  let data = req.body;
  let id = data._id ? data._id : "";
  let dataget = data.dataget ? data.dataget : "";

  let result = {
    ack: "1",
    message: "Successful",
  };
  
  if(id != ""){
    let blob1 = {};
    let channelData: any = await channelInfomodel.findOne({_id : id});
    if(channelData == undefined || Object.keys(channelData).length == 0 ){
      let errorResult = {
        ack: "0",
        message: "Channel not found",
      }
      res.status(400).send(errorResult);
    }
    let countData = channelData.viewCount ? channelData.viewCount : 0;
    if(dataget == "INC"){
      blob1 = {
        $set: {
          viewCount : countData + 1
        }
      };
    }else if(dataget == "DEC"){
      blob1 = {
        $set: {
          viewCount : countData - 1
        }
      };
    }
    await channelInfomodel.updateOne({_id : id}, blob1);
    res.status(200).send(result);
  }else{
    let errorResult = {
      ack: "0",
      message: "Id not found",
    }
    res.status(400).send(errorResult);
  }

  } catch (error) {
    console.log(error);
    let resultData= {
      ack: "0",
      message: "Something went wrong",
    };
    res.status(400).send(resultData);
  }
}

  }
  
  export const appServicesV1 = new AppServices();