import client from '../config/elasticsearch.js'
import Env from '../env/Env.js';


const indexExists = async (index) => {
    const { body } = await client.indices.exists({ index });
    return body;
};


export const createIndexes = async () => {
    const EMAIL_INDEX = Env.ELASTIC.INDEXES.EMAILS
    const MAIL_BOXES_INDEX = Env.ELASTIC.INDEXES.MAIL_BOXES
    
    const emailIndexExists = await indexExists(EMAIL_INDEX);
    const mailboxIndexExists = await indexExists(MAIL_BOXES_INDEX);

    if (emailIndexExists) {
        await client.indices.create({
            index: EMAIL_INDEX,
            body: {
                mappings: {
                    properties: {
                        userId: { type: 'keyword' },
                        messageId: { type: 'keyword' },
                        subject: { type: 'text' },
                        sender: { type: 'text' },
                        body: { type: 'text' },
                        date: { type: 'date' }
                    }
                }
            }
        });
        console.log(`${EMAIL_INDEX} index created.`);
    } else {        
        console.log(`${EMAIL_INDEX} index already exists.`);
    }

    if (mailboxIndexExists) {
        await client.indices.create({
            index: MAIL_BOXES_INDEX,
            body: {
                mappings: {
                    properties: {
                        userId: { type: 'keyword' },
                        mailboxName: { type: 'text' }
                    }
                }
            }
        });
        console.log(`${MAIL_BOXES_INDEX} index created.`);
    } else {        
        console.log(`${MAIL_BOXES_INDEX} index already exists.`);
    }
};

export const saveEmails = async (emails, userId) => {
    for (const email of emails) {
        await client.index({
            index: Env.ELASTIC.INDEXES.EMAILS,
            body: {
                userId,
                messageId: email.id,
                subject: email.subject,
                sender: email.from.emailAddress.address,
                body: email.body.content,
                date: email.receivedDateTime
            }
        });
    }
};
