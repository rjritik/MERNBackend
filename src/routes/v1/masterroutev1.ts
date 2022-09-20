import express, { NextFunction, request, Request, Response } from "express";
import { BaseRoutes } from "../baseroutes";
import cores from "cors";

import {globalControllerV1} from "../../controllers/v1/global/globalcontroller";
import { backupControllerV1 } from "../../controllers/v1/backup/backupcontorllerv1";
import { appControllerV1 } from "../../controllers/appcontrollers";
import path from "path";
import process from "process";
class MasterRouteV1 extends BaseRoutes {
  public path = "/";

  constructor() {
    super();
    this._configure();
  }

  private _configure() {
    this.router.use(cores());
    this.router.use(express.static(path.join(__dirname ,"../../../build")));
    this.router.get('/',(req,res,next) => {
        res.sendFile(path.join(__dirname,"../../../build", "index.html"))
    })

    this.router.post(
      "/addwidgetApi",
      (req: Request, res: Response, next: NextFunction) => {
        globalControllerV1.addwidgetApi(req, res, next);
      }
    );
    this.router.post(
      "/removeslideAPI",
      (req: Request, res: Response, next: NextFunction) => {
        globalControllerV1.removeslideAPI(req, res, next);
      }
    );
    this.router.post(
      "/removewidgetApi",
      (req: Request, res: Response, next: NextFunction) => {
        globalControllerV1.removewidgetApi(req, res, next);
      }
    );
    this.router.post(
      "/savewidgetlocationAPI",
      (req: Request, res: Response, next: NextFunction) => {
        globalControllerV1.savewidgetlocationAPI(req, res, next);
      }
    );
    this.router.post(
      "/addslidetoslideshowApi",
      (req: Request, res: Response, next: NextFunction) => {
        globalControllerV1.addslidetoslideshowApi(req, res, next);
      }
    );
    this.router.post(
      "/updateWidgetApi",
      (req: Request, res: Response, next: NextFunction) => {
        globalControllerV1.updateWidgetApi(req, res, next);
      }
    );
    this.router.post(
      "/getwidgetsApi",
      (req: Request, res: Response, next: NextFunction) => {
        globalControllerV1.getwidgetsApi(req, res, next);
      }
    );
    this.router.post(
      "/getwidgetlocationAPI",
      (req: Request, res: Response, next: NextFunction) => {
        globalControllerV1.getwidgetlocationAPI(req, res, next);
      }
    );
    // this.router.get(
    //   "/getalllayoutAPI",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     globalControllerV1.getalllayoutAPI(req, res, next);
    //   }
    // );
    this.router.post(
      "/getruleapi",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getruleapi(req,res,next);
      }
    );
    this.router.post(
      "/getInfoapi",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getInfoapi(req,res,next);
      }
    );
    this.router.post(
      "/getloginapi",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getloginapi(req,res,next);
      }
    );
    this.router.post(
      "/getalldataapi",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getalldataapi(req,res,next);
      }
    );
    this.router.post(
      "/getallProperty",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getallProperty(req,res,next);
      }
    );
    this.router.post(
      "/getallAdminData",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getallAdminData(req,res,next);
      }
    );
    this.router.get(
      "/getalluserdataapi",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getalluserdataapi(req,res,next);
      }
    );
    this.router.get(
      "/getuserlength",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getuserslength(req,res,next);
      }
    );

    this.router.post(
      "/DeleteChannelRow",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.DeleteChannelRow(req,res,next);
      }
    );
    this.router.post(
      "/savebgpictureApi",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.savebgpictureApi(req,res,next);
      }
    );
    this.router.post(
      "/getbgpictureApi",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getbgpictureApi(req,res,next);
      }
    );
    this.router.post(
      "/getSelectedLayout",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getSelectedLayout(req,res,next);
      }
    );
    this.router.post(
      "/getSelectedLayoutById",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getSelectedLayoutById(req,res,next);
      }
    );
    this.router.post(
      "/saveSelectedLayout",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.saveSelectedLayout(req,res,next);
      }
    );
    this.router.post(
      "/updateSelectedLayout",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.updateSelectedLayout(req,res,next);
      }
    );
    this.router.post(
      "/updateSelectedLayoutName",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.updateSelectedLayoutName(req,res,next);
      }
    );
    this.router.post(
      "/updateWidgetSettings",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.updateWidgetSettings(req,res,next);
      }
    );

    this.router.post(
      "/removelayoutAPI",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.removelayoutAPI(req,res,next);
      }
    );
    this.router.post(
      "/UpdateChannelRow",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.UpdateChannelRow(req,res,next);
      }
    );

    this.router.post(
      "/SaveProperty",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.SaveProperty(req,res,next);
      }
    );
    this.router.post(
      "/UpdateProperty",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.UpdateProperty(req,res,next);
      }
    );
    this.router.post(
      "/getviewData",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getviewData(req,res,next);
      }
    );




    this.router.post(
      "/getauthentication",
      (req: Request ,res:Response,next:NextFunction)=>{
        appControllerV1.getauthentication(req,res,next);
      }
    );
    this.router.post(
      "/verifycredentials",
      (req: Request ,res:Response,next:NextFunction)=>{
        appControllerV1.verifycredentials(req,res,next);
      }
    );
    this.router.post(
      "/getprogramdetails",
      (req: Request ,res:Response,next:NextFunction)=>{
        appControllerV1.getprogramdetails(req,res,next);
      }
    );
    this.router.post(
      "/channelviews",
      (req: Request ,res:Response,next:NextFunction)=>{
        appControllerV1.channelviews(req,res,next);
      }
    );
    this.router.post(
      "/getdetail/:id",
      (req: Request ,res:Response,next:NextFunction)=>{
        appControllerV1.retreiveDetailbyId(req,res,next);
      }
    );





    this.router.post(
      "/DeleteProperty",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.DeleteProperty(req,res,next);
      }
    );
    this.router.post(
      "/DeleteUser",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.DeleteUser(req,res,next);
      }
    );
    this.router.post(
      "/SaveUpdateUser",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.SaveUpdateUser(req,res,next);
      }
    );
    this.router.post(
      "/getSelectedLayoutData",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getSelectedLayoutData(req,res,next);
      }
    );
    this.router.post(
      "/addaudioLayout",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.addaudioLayout(req,res,next);
      }
    );
    this.router.get(
      "/getbackendversion",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getbackendversion(req,res,next);
      }
    );
    this.router.post(
      "/DeleteRule",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.DeleteRule(req,res,next);
      }
    );
    this.router.post(
      "/SaveChannelRule",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.SaveChannelRule(req,res,next);
      }
    );
    this.router.post(
      "/UpdateChannelRuleforChannel",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.UpdateChannelRuleforChannel(req,res,next);
      }
    );
    
    this.router.post(
      "/UpdateSelectedLayoutProp",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.UpdateSelectedLayoutProp(req,res,next);
      }
    );
    this.router.post(
      "/changePassword",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.changePassword(req,res,next);
      }
    );
    this.router.post(
      "/setClientIdApi",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.setClientIdApi(req,res,next);
      }
    );
    this.router.post(
      "/getClientIdData",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.getClientIdData(req,res,next);
      }
    );
    this.router.post(
      "/updateClientIdForClient",
      (req: Request ,res:Response,next:NextFunction)=>{
        globalControllerV1.updateClientIdForClient(req,res,next);
      }
    );
    this.router.get('/getlicenses', (req: Request, res: Response, next: NextFunction) => {
      appControllerV1.getLicenses(req, res, next);
    })

    this.router.get('/checkkeylok', (req: Request, res: Response, next: NextFunction) => {
      appControllerV1.chekKeylok(req, res, next);
    })
    this.router.post(
      "/savebackuplocation",
      (req: Request, res: Response, next: NextFunction) => {
        backupControllerV1.saveBackupLocation(req, res, next);
      }
    );
    this.router.post(
      "/getbackuplocation",
      (req: Request, res: Response, next: NextFunction) => {
        backupControllerV1.getBackupLocation(req, res, next);
      }
    );
    this.router.post(
      "/savebackupnow",
      (req: Request, res: Response, next: NextFunction) => {
        backupControllerV1.uploadBackupNow(req, res, next);
      }
    );
    this.router.post(
      "/listallbackups",
      (req: Request, res: Response, next: NextFunction) => {
        backupControllerV1.listAllBackups(req, res, next);
      }
    );
    this.router.post('/restore', (req:Request, res:Response, next:NextFunction) => {
      backupControllerV1.restoreLocal(req, res, next);
    })
    this.router.post('/restoreremote', (req:Request, res:Response, next:NextFunction) => {
      backupControllerV1.restoreRemote(req, res, next);
    })
    this.router.post('/listlocalbackups', (req:Request, res:Response, next:NextFunction) => {
      backupControllerV1.listLocalBackups(req, res, next);
    })
    this.router.get('/downloadbackup/:foldername', (req:Request, res:Response, next:NextFunction) => {
      backupControllerV1.downloadBackup(req, res, next);
    })
    this.router.post('/savedailycron', (req:Request, res:Response, next: NextFunction) => {
      backupControllerV1.savedailycron(req,res,next);
    })
    this.router.post('/saveweeklycron', (req:Request, res:Response, next: NextFunction) => {
      backupControllerV1.saveWeeklyCron(req,res,next);
    })
    this.router.post('/uploadbackup', (req:Request, res:Response, next: NextFunction) => {
      backupControllerV1.uploadBackupFiles(req,res,next);
    })



  }
}

export const masterRouteV1 = new MasterRouteV1();
