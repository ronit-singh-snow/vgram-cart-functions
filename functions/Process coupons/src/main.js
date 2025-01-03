import AppExpress from '@itznotabug/appexpress';
import { AppwriteService } from './appwriteHelper.js';
import { API_KEY, APPWRITE_ENDPOINT, COUPON_COLLECTION_ID, DB_NAME, ORDER_COLLECTION_ID, PROJECT_ID } from './constants.js';
import { Query } from 'node-appwrite';

const app = new AppExpress();

app.post("/validate_coupon", async (request, response) => {
    let appwriteService = new AppwriteService(request.headers["x-appwrite-key"]);
    const {couponId, userId, couponCode, totalCartValue} = request.body;

    try {
        const coupon = await appwriteService.getDocumentById(DB_NAME, COUPON_COLLECTION_ID, couponId);
        if (new Date(coupon.expiry_date) < new Date()) {
            return response.json({
                status: "error",
                message: "This coupon has expired."
            });
        }

        if (coupon.single_use && userId) {
            const orderQuery = [
                Query.equal("coupon", couponCode),
                Query.equal("user_id", userId),
            ];
            const orderResponse = await appwriteService.fetchCollectionData(DB_NAME, ORDER_COLLECTION_ID, orderQuery);
            
            if (orderResponse.length > 0) {
                return response.json({
                    status: "error",
                    message: "You have already used this coupon."
                });
            }
        }

        if (totalCartValue < coupon.min_purchase_amount) {
            return response.json({
                status: "error",
                message: `Add items worth ${coupon.min_purchase_amount - totalCartValue} to apply this coupon.`
            })
        }

        const maximumDiscountApplied = Math.floor(Math.min(coupon.max_discount_amount, totalCartValue * (coupon.discount_value / 100)))

        return response.json({
            status: "success",
            maxDiscount: maximumDiscountApplied
        });
            
    } catch(error) {
        console.error("Error validating coupon:", error);
        response.json({
            "status": "Error",
            "message": error.toString()
        })
    }

});

app.get("/api_keys", (request, response) => {
    response.json({
        GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY
    })
})

app.get("/", (request, response) => {
    response.send("Welcome to Vgram Cart");
});


export default async (context) => await app.attach(context);