import AppExpress from '@itznotabug/appexpress';
import { AppwriteService } from './appwriteHelper.js';
import { API_KEY, APPWRITE_ENDPOINT, COUPON_COLLECTION_ID, DB_NAME, PROJECT_ID } from './constants.js';

const app = new AppExpress();

app.post("/validate_coupon", async (request, response) => {
    let appwriteService = new AppwriteService(request.headers["x-appwrite-key"]);
    const params = request.body;
    
    const documents = await appwriteService.getDocumentById(DB_NAME, COUPON_COLLECTION_ID, params.coupon_id);

    return response.json({
        status: "success",
        data: documents
    })
    
});

app.get("/", (request, response) => {
    response.send("Welcome to Vgram Cart");
})

export default async (context) => await app.attach(context);