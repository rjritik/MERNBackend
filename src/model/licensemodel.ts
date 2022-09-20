import { BaseModel } from './basemodel'
import { Document, Schema, Model, model, Types } from "mongoose"
import mongooseFieldEncryption from "mongoose-field-encryption"


export interface ILicenseCheck extends Document {
    Slug:string;
    SlugStatus: string;
}

export class LicenseCheck extends BaseModel {
    Slug?:string;
    SlugStatus?: string;
}

const LicenseCheckSchema: Schema = new Schema({
    Slug: { type: String },
    SlugStatus: { type: String },
}, { timestamps: true });
// LicenseCheckSchema.plugin(mongooseFieldEncryption.fieldEncryption, { fields: ["Slug", "SlugStatus"], secret: "icanhazcheeseburger"})

export const licenseCheckModel = model<LicenseCheck>('Slugs', LicenseCheckSchema);