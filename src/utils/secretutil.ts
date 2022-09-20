import { settings } from '../settings'
import dotenv from 'dotenv';

dotenv.config = settings.GetEnvironmentConfig();

class SecretUtil {

    //Define the node environment
    public PORT = "3008";
    public HOST = "localhost";
    public MONGODB_SERVER = "localhost";
    public MONGODB_DBNAME = "rsdcustomer";
    public MONGODB_PORT = "27017";
    public ApppublicKey = "ro8BS6Hiivgzy8Xuu09JDjlNLnSLldY5";

}

export const secretUtil = new SecretUtil();
