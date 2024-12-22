import { APPWRITE_ENDPOINT, DB_NAME, PROJECT_ID } from "../Constants";
import { Client, Databases, Query } from 'node-appwrite';

export class DatabaseService {
    constructor() {
        const client = new Client()
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(PROJECT_ID);
        
        this.database = new Databases(client)
    }

    getDocument(collectionId, documentId) {
        return this.database.getDocument(DB_NAME, collectionId, documentId);
    }
}