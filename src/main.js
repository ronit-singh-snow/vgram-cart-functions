import { Client, Users, Databases, Query } from 'node-appwrite';
import AppExpress from '@itznotabug/appexpress';
import { DatabaseService } from './utils/DatabaseService.js';
import { COUPON_COLLECTION_ID } from './Constants.js';

const app = new AppExpress();

const validateCoupons = (request, response) => {
    let params = request.body;
    const couponRecordId = params.couponRecordId;

    var dbService = new DatabaseService();
    dbService.getDocument(COUPON_COLLECTION_ID, couponRecordId).then((result) => {
        response.json(result);
    });

    response.json("Hello World");
}

app.post("/validate_coupon", validateCoupons)

export default async (context) => await app.attach(context);