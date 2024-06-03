import { fetchEmails } from '../services/outlookService.js';
import { saveEmails } from '../services/elasticsearchService.js';
import wrapCatchAsyncFunctions from '../utils/catchAsync.js';
import client from '../config/elasticsearch.js';
import { SUCCESSFUL } from '../utils/constants.js';
import Env from '../env/Env.js';


class Emails {
    static async syncEmails(req, resp, next) {
        let token = req.cookies?.accessToken || (req.header("Authorization") && req.header("Authorization").split(' ')[1])
        if (!token) {
            return resp.status(401).send('Not authenticated');
        }

        const emails = await fetchEmails(token);
        // await saveEmails(emails, req.session.userId); // need to add userId
        resp.status(401).json({ status: SUCCESSFUL, emails });
    }

    static async getEmails(req, resp) {
        if (!req.session.userId) {
            return resp.status(401).send('Not authenticated');
        }

        const { body } = await client.search({
            index: Env.ELASTIC.INDEXES.EMAILS,
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
