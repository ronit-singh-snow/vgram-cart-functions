import { APPWRITE_ENDPOINT, DB_NAME, PROJECT_ID } from "../Constants.js";
import { Client, Databases, Query } from 'node-appwrite';

export class DatabaseService {
    constructor() {
        const client = new Client()
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(PROJECT_ID);
        
        this.database = new Databases(client)
    }

    async getDocument(collectionId, documentId) {
        try {
            const response = await this.database.getDocument(DB_NAME, collectionId, documentId);
            return response;
        } catch(err) {
            return "Error Observed"
        }
    }
}