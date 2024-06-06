import { fetchEmails } from '../services/outlookService.js';
import { getEmails, saveEmails } from '../services/elasticsearchService.js';
import wrapCatchAsyncFunctions from '../utils/catchAsync.js';
import client from '../config/elasticsearch.js';
import Env from '../env/Env.js';
import ApiResponse from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';

class Emails {
    // Method to sync emails from Outlook to Elasticsearch
    static async syncEmails(req, resp, next) {
        // Check if access token is provided in cookies or headers
        let outlookAccessToken = req.cookies?.outlookAccessToken

        if (!outlookAccessToken) next(new AppError('OutLook is not linked!',401))

        // Fetch emails from Outlook
        const emails = await fetchEmails(outlookAccessToken);

        // Save emails to Elasticsearch
        await saveEmails(emails, req.user.id);
        
        // Send success response
        resp.json(new ApiResponse(200, { emails }));
    }

    // Method to get emails from Elasticsearch
    static async getEmails(req, resp, next) {
        const [err,emails] = await getEmails(req.user.id)

        if (err) return next(err);
        
        // Send success response
        resp.json(new ApiResponse(200, { emails }));
    };
}

// Wrap all methods in error handling
wrapCatchAsyncFunctions(Emails);

export default Emails;
