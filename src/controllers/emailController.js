import { fetchEmails } from '../services/outlookService.js';
import { saveEmails } from '../services/elasticsearchService.js';
import wrapCatchAsyncFunctions from '../utils/catchAsync.js';

class Emails {
    static async syncEmails(req, resp, next) {
        if (!req.session.accessToken) {
            return resp.status(401).send('Not authenticated');
        }
    
        const emails = await fetchEmails(req.session.accessToken);
        await saveEmails(emails, req.session.userId);
        resp.send('Emails synchronized successfully');
    }

    static async getEmails(req, resp) {
        const client = require('../config/elasticsearch');
        if (!req.session.userId) {
            return resp.status(401).send('Not authenticated');
        }
    
        const { body } = await client.search({
            index: 'emails',
            body: {
                query: {
                    match: { userId: req.session.userId }
                }
            }
        });
    
        resp.json(body.hits.hits);
    };
}

// Wrap all methods in error handling
wrapCatchAsyncFunctions(Emails);

export default Emails;
