import AppExpress from '@itznotabug/appexpress';

import { COUPON_COLLECTION_ID, DB_NAME } from './Constants.js';
import AppwriteService from './utils/appwriteHelper.js';

const app = new AppExpress();

const validateCoupons = async (request, res) => {
    const appwriteService = new AppwriteService();
    let params = request.body;
    const couponRecordId = params.couponRecordId;

    try {
        const databaseId = DB_NAME; // Replace with your database ID
        const collectionId = COUPON_COLLECTION_ID; // Replace with your collection ID

        // Fetch data using the helper
        const documents = await appwriteService.fetchCollectionData(databaseId, collectionId);

        // Send response
        res.json({
            status: 'success',
            data: documents,
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message,
        });
    }
}

app.post("/validate_coupon", validateCoupons)

export default async (context) => await app.attach(context);