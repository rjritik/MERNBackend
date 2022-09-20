import express, { Request, Response, NextFunction } from "express";
import fileUpload from "express-fileupload";
import * as bodyParser from "body-parser";
import "reflect-metadata";
import { appAPI } from "./routes/apiroutes";
import mongoose from "mongoose";
import { secretUtil } from "./utils/secretutil";
import cors from 'cors';
var CronJobManager = require("cron-job-manager");
import * as cron from "node-cron";
import { convertTo16Bit, validateLicense } from "./utils/responsehandlerutil";
import { licenseCheckModel } from "./model/licensemodel";
import { channelInfomodel } from "./model/widgets/channelInfo";
import { channelViewmodel } from "./model/widgets/channelviewcount";



/**
 * @description Express server application class.
 */
class App {
  public Manager = new CronJobManager();
  public server = express();
  constructor() {
    // Schedule tasks to be run on the server.
    try {
      this.initMiddlewares();
      this.defineRoutes();
      this.MongoosConnect();
      this.saveLicenseModel();
      cron.schedule(`*/1 * * * *`, async () => {
        let keyValue:any = await validateLicense("check-key").catch(err => console.log(err));
        let keyCount: any = await validateLicense("check-license").catch((err)=>{ console.log(err)});
        let SlugStatus = convertTo16Bit(keyCount['output'])
        let totalLicense: any = await licenseCheckModel.find({});
        if(totalLicense === undefined || totalLicense.length === 0){
          let licensemodel = new licenseCheckModel();
          licensemodel["Slug"] = keyValue["output"];
          licensemodel["SlugStatus"] = SlugStatus
          await licensemodel.save();
        }else{
          if(keyValue['output']==null || keyCount['output']==null) return;
          totalLicense[0]['Slug'] = keyValue['output'];
          totalLicense[0]['SlugStatus'] = SlugStatus
          await totalLicense[0].save()
        }
      });
      cron.schedule(`*/10 * * * *`, async () => {
        let alldata = await channelInfomodel.find({});
        for(let i=0; i<alldata.length; i++){
          let id = alldata[i]._id;
          let model = new channelViewmodel();
          model.channel_id = id;
          model.viewCountArray = [alldata[i].viewCount ? alldata[i].viewCount : 0, new Date()];
          model.save();
        }
      });
      
      cron.schedule(`0 2 * * *`, async () => {
        await channelViewmodel.deleteMany({createdAt : { $lte: new Date(new Date().getTime() - 86400000) }});
      });
      
    }catch{
      console.log("Error")
    }
  }
  private saveLicenseModel = async () => {
    let keyValue:any = await validateLicense("check-key").catch(err => console.log(err));
    let keyCount: any = await validateLicense("check-license").catch((err)=>{ console.log(err)});
    let SlugStatus = convertTo16Bit(keyCount['output'])
    let totalLicense: any = await licenseCheckModel.find({});
        if(totalLicense === undefined || totalLicense.length === 0){
          let licensemodel = new licenseCheckModel();
          licensemodel["Slug"] = keyValue["output"];
          licensemodel["SlugStatus"] = SlugStatus
          await licensemodel.save();
        }
        else {
          if(keyValue['output']==null || keyCount['output']==null) return;
          totalLicense[0]['Slug'] = keyValue['output'];
          totalLicense[0]['SlugStatus']= SlugStatus
          await totalLicense[0].save()
        }
  }


  private initMiddlewares(): void {
    try {
      this.server.use(cors())
      this.server.use(fileUpload());
      this.server.use(appAPI.appPath, appAPI.routerinstance);
      this.server.use(bodyParser.json({ limit: "10mb" }));
    } catch (error) {
      console.log(error);
    }
  }



  private MongoosConnect() {
    try {
      var ip = secretUtil.MONGODB_SERVER;
      var dbName = secretUtil.MONGODB_DBNAME as string;
      //var user_name = secretUtil.MONGODB_USERNAME as string;
      //var pass = secretUtil.MONGODB_PASSWORD as string;

      // var conn =
      //   "mongodb://" +
      //   ip +
      //   ":27017/" +
      //   dbName +
      //   "?username=" +
      //   user_name +
      //   "&password=" +
      //   pass;

      var conn =
        "mongodb://" +
        ip +
        ":27017/" +
        dbName;

      mongoose
        .connect(conn) // if error it will throw async error
        .then(async () => {
          // if all is ok we will be here
          let useDb = mongoose.connection.useDb(dbName);
          while (useDb.readyState !== 1) {
            continue;
          }
          console.log("> MongoDB connected - " + ip);

          // loggerUtil.error('> MongoDB connected - '+ip);
        })
        .catch((err) => {
          // we will not be here...
          console.error(
            "> MongoDB connection error........." + " " + ip + " " + err.stack
          );
          // loggerUtil.error('> MongoDB connection error.........'+err.stack);
          process.exit(1);
        });
    } catch (error) {
      console.log(error);
    }
  }

  private defineRoutes(): void {
    try {
      // API Base path
      this.server.use(bodyParser.urlencoded({ extended: false }));
      this.server.use(bodyParser.json());
      this.server.use(appAPI.path, appAPI.routerinstance);

      // fallback invalid route
      this.server.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404).json({
          success: false,
          message: "Invalid route",
          result: {},
          statusCode: 404,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

// initialize server app
const app = new App();

// export the default "App" class object "server" property
export default app;
