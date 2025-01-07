import { Client, Databases, Users } from 'node-appwrite';

export class AppwriteService {
    constructor(apiKey) {
        this.client = new Client();
        this.databases = new Databases(this.client);
        this.users = new Users(this.client);

        this.client
            .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
            .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
            .setKey(apiKey);
    }

    async fetchCollectionData(databaseId, collectionId, query) {
        try {
            const response = await this.databases.listDocuments(databaseId, collectionId, query);
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

    async searchUser(query) {
        try {
            const result = await this.users.list(query);
            return result;
        } catch(err) {
            console.log(JSON.stringify(err));
        }
    }

    async deleteUser(userId) {
        try {
            await this.users.delete(userId);
            return "success";
        } catch(err) {
            console.log(JSON.stringify(err));
            return "error";
        }
    }

}

