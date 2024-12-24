const { Client, Databases } = require('node-appwrite');
const { APPWRITE_ENDPOINT, PROJECT_ID } = require('../Constants.js');

class AppwriteService {
    constructor() {
        this.client = new Client();
        this.databases = new Databases(this.client);

        this.client
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(PROJECT_ID);
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
}

module.exports = AppwriteService;
