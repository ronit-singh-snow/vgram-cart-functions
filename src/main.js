import { Client, Users, Databases, Query } from 'node-appwrite';
import AppExpress from '@itznotabug/appexpress';
import { DatabaseService } from './utils/DatabaseService';
import { COUPON_COLLECTION_ID } from './Constants';

const app = new AppExpress();

const validateCoupons = (request, response) => {
    let params = request.body;
    const couponRecordId = params.couponRecordId;

    var dbService = new DatabaseService();
    dbService.getDocument(COUPON_COLLECTION_ID, couponRecordId).then((response) => {
        console.log(response);
    })

    response.json()
}

app.post("/validate_coupon", validateCoupons)

export default async (context) => await app.attach(context);