import { NextFunction, response, Response } from 'express';
import { BaseController } from './basecontroller';
import { appServicesV1 } from '../services/v1/global/appservices';
import { IFilteredRequest } from '../interfaces';


class AppController extends BaseController {

    public async getauthentication(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await appServicesV1.getauthentication(req, res);
            // return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async verifycredentials(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await appServicesV1.verifycredentials(req, res);
            // return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getprogramdetails(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await appServicesV1.getprogramdetails(req,res);
            // return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async retreiveDetailbyId(req: IFilteredRequest<null>, res: Response, next: NextFunction) {
        try {
            let requestResult = await appServicesV1.retreiveDetailbyId(req,res);
            // return res.send(requestResult);

        } catch (error) {
            return res.send(null)
        }
    }
    public async getLicenses(req:any, res: Response, next:NextFunction) {
        try {
            const requestResult = await appServicesV1.getLicenses(req);
            return res.send(requestResult);
        } catch (error) {
            return res.send(null);
            
        }
    }
    public async chekKeylok(req:any, res: Response, next:NextFunction) {
        try {
            const requestResult = await appServicesV1.chekKeylok(req);
            return res.send(requestResult);
        } catch (error) {
            return res.send(null);
            
        }
    }
    public async channelviews(req:any, res: Response, next:NextFunction) {
        try {
            const requestResult = await appServicesV1.channelviews(req, res);
            return res.send(requestResult);
        } catch (error) {
            return res.send(null);
            
        }
    }

}

export const appControllerV1 = new AppController();