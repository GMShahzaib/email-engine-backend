import { fetchEmails } from '../services/outlookService.js';
import { saveEmails } from '../services/elasticsearchService.js';
import wrapCatchAsyncFunctions from '../utils/catchAsync.js';
import client from '../config/elasticsearch.js';
import Env from '../env/Env.js';
import ApiResponse from '../utils/apiResponse.js';

class Emails {
    // Method to sync emails from Outlook to Elasticsearch
    static async syncEmails(req, resp, next) {
        // Check if access token is provided in cookies or headers
        let token = req.cookies?.accessToken || (req.header("Authorization") && req.header("Authorization").split(' ')[1])
        if (!token) {
            return resp.status(401).send('Not authenticated');
        }

        // Fetch emails from Outlook
        const emails = await fetchEmails(token);

        // Save emails to Elasticsearch
        await saveEmails(emails, req.session.userId); // assuming req.session.userId is available

        // Send success response
        resp.json(new ApiResponse(200, { emails }));
    }

    // Method to get emails from Elasticsearch
    static async getEmails(req, resp, next) {
        // Check if user is authenticated
        if (!req.session.userId) {
            return resp.status(401).send('Not authenticated');
        }

        // Search for emails in Elasticsearch for the logged-in user
        const { body } = await client.search({
            index: Env.ELASTIC.INDEXES.EMAILS,
            body: {
                query: {
                    match: { userId: req.session.userId }
                }
            }
        });

        // Send found emails as response
        resp.json(body.hits.hits);
    };
}

// Wrap all methods in error handling
wrapCatchAsyncFunctions(Emails);

export default Emails;
