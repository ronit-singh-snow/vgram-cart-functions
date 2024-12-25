import { Client, Databases } from 'node-appwrite';

export class AppwriteService {
    constructor(apiKey) {
        this.client = new Client();
        this.databases = new Databases(this.client);

        this.client
            .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
            .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
            .setKey(apiKey);
    }

    async fetchCollectionData(databaseId, collectionId) {
        try {
            const response = await this.databases.listDocuments(databaseId, collectionId);
            return response.documents;
        } catch (error) {
            console.error('Error fetching collection data:', error);
            throw new Error(error.message);
        }
    }

    async getDocumentById(databaseId, collectionId, documentId) {
        try {
            const response = await this.databases.getDocument(databaseId, collectionId, documentId);
            return response;
        } catch(error) {
            console.log("Error which fetching the document ID: " + documentId, error);
            throw new Error(error.message);
        }
    }
}

