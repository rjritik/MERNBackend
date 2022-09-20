import { NextFunction, response, Response } from 'express';
import { BaseController } from '../../basecontroller';
import { globalServicesV1 } from '../../../services/v1/global/globalservices'
import { IFilteredRequest } from "../../../interfaces";


class GlobalController extends BaseController {

    public async addwidgetApi(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await globalServicesV1.addwidgetApi(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async removeslideAPI(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await globalServicesV1.removeslideAPI(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async removewidgetApi(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await globalServicesV1.removewidgetApi(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async savewidgetlocationAPI(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await globalServicesV1.savewidgetlocationAPI(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async addslidetoslideshowApi(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await globalServicesV1.addslidetoslideshowApi(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async updateWidgetApi(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await globalServicesV1.updateWidgetApi(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getwidgetsApi(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await globalServicesV1.getwidgetsApi(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getruleapi(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getruleapi(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getInfoapi(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getInfoapi(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }


    public async getloginapi(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getloginapi(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getalldataapi(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getalldataapi(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getallProperty(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getallProperty(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getallAdminData(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getallAdminData(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async DeleteProperty(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.DeleteProperty(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getalluserdataapi(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getalluserdataapi(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getuserslength(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getusersLength(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
     public async DeleteChannelRow(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.DeleteChannelRow(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async savebgpictureApi(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.savebgpictureApi(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getbgpictureApi(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getbgpictureApi(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getwidgetlocationAPI(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getwidgetlocationAPI(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async saveSelectedLayout(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.saveSelectedLayout(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async updateSelectedLayout(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.updateSelectedLayout(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async updateSelectedLayoutName(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.updateSelectedLayoutName(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    
    public async updateWidgetSettings(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.updateWidgetSettings(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    
    public async getSelectedLayout(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getSelectedLayout(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getSelectedLayoutById(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getSelectedLayoutById(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async removelayoutAPI(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.removelayoutAPI(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    // public async getalllayoutAPI(req: IFilteredRequest<null>, res: Response, next: NextFunction){
    //     try {
    //         let requestResult = await globalServicesV1.getalllayoutAPI(req);
    //         return res.send(requestResult);

    //     } catch (error) {
    //         return res.send(null)
    //     }
    // }
    public async UpdateChannelRow(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.UpdateChannelRow(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }

    public async SaveProperty(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.SaveProperty(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async UpdateProperty(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.UpdateProperty(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async SaveUpdateUser(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.SaveUpdateUser(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async DeleteUser(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.DeleteUser(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getSelectedLayoutData(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getSelectedLayoutData(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async addaudioLayout(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.addaudioLayout(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getbackendversion(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getbackendversion(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async DeleteRule(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.DeleteRule(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async SaveChannelRule(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.SaveChannelRule(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async UpdateChannelRuleforChannel(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.UpdateChannelRuleforChannel(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async UpdateSelectedLayoutProp(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.UpdateSelectedLayoutProp(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async changePassword(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.changePassword(req);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async setClientIdApi(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.setClientIdApi(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)      
        }
    }

    public async updateClientIdForClient(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.updateClientIdForClient(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getClientIdData(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getClientIdData(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getviewData(req: IFilteredRequest<null>, res: Response, next: NextFunction){
        try {
            let requestResult = await globalServicesV1.getviewData(req,res);
            return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }



}

export const globalControllerV1 = new GlobalController();