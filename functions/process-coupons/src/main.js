import AppExpress from '@itznotabug/appexpress';
import { AppwriteService } from './appwriteHelper.js';
import { COUPON_COLLECTION_ID, DB_NAME, ORDER_COLLECTION_ID } from './constants.js';
import { Query } from 'node-appwrite';

const app = new AppExpress();

app.post("/validate_coupon", async (request, response) => {
    let appwriteService = new AppwriteService(request.headers["x-appwrite-key"]);
    const { userId, couponCode, totalCartValue} = request.body;

    try {
        const coupons = await appwriteService.fetchCollectionData(DB_NAME, COUPON_COLLECTION_ID, [Query.equal("code", couponCode)]);
        if (coupons.length == 0) {
            return response.json({
                status: "error",
                message: "No coupons found with the code " + couponCode
            })
        }

        let coupon = coupons[0];
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
        GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
        APPWRITE_ENDPOINT: process.env.APPWRITE_FUNCTION_API_ENDPOINT,
        PROJECT_ID: process.env.APPWRITE_FUNCTION_PROJECT_ID,
        APP_DELIVERY_FEE: process.env.DELIVERY_FEE,
        APP_PLATFORM_FEE: process.env.PLATFORM_FEE
    })
});

app.delete("/delete_account", async (request, response) => {
    const {email, phoneNumber} = request.body;
    let query = [];
    if (email)
        query = [Query.equal("email", email)];
    else if (phoneNumber)
        query = [Query.equal("phone", phoneNumber)];

    try {
        let appwriteService = new AppwriteService(request.headers["x-appwrite-key"]);
        const result = await appwriteService.searchUser(query);

        if (result && result.total > 0) {
            const status = await appwriteService.deleteUser(result.users[0].$id);
            if (status === "success")
                return response.json({
                    status: "success",
                    userId: result.users[0].$id
                });
            else return response.json({
                    status: "failed",
                    userId: result.users[0].$id,
                    message: "Error occurred while deleting the user record."
                });
        }
        else
            response.json({
                status: "Failed",
                message: "No record found for the Provided inputs."
            });
    } catch(error) {
        console.log(JSON.stringify(error));
        response.json({
            status: "error"
        })
    }
});

app.post("/update_email", (request, response) => {
    const {email, userId} = request.body;
    if (!userId || !email) {
        response.json({
            status: "error"
        });
        return;
    }
    let appwriteService = new AppwriteService(request.headers["x-appwrite-key"]);
    try {
        const result = appwriteService.updateEmail(userId, email);
        response.json({
            status: "success"
        });
    } catch(err) {
        response.json({
            status: "error"
        });
    }
});

app.get("/", (request, response) => {
    response.send("Welcome to Vgram Cart");
});


export default async (context) => await app.attach(context);