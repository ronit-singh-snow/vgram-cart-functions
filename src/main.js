import { Client, Users, Databases, Query } from 'node-appwrite';
import AppExpress from '@itznotabug/appexpress';
import { DatabaseService } from './utils/DatabaseService.js';
import { COUPON_COLLECTION_ID } from './Constants.js';

const app = new AppExpress();

const validateCoupons = async (request, response) => {
    let params = request.body;
    const couponRecordId = params.couponRecordId;

    var dbService = new DatabaseService();
    const result = await dbService.getDocument(COUPON_COLLECTION_ID, couponRecordId).

    response.json(result);
}

app.post("/validate_coupon", validateCoupons)

export default async (context) => await app.attach(context);