import client from '../config/elasticsearch.js';
import Env from '../env/Env.js';
import AppError from '../utils/AppError.js';

// Constants for index names
const USERS_INDEX = Env.ELASTIC.INDEXES.USERS;
const EMAIL_INDEX = Env.ELASTIC.INDEXES.EMAILS;
const MAIL_BOXES_INDEX = Env.ELASTIC.INDEXES.MAIL_BOXES;

// Function to check if an index exists
const indexExists = async (index) => {
    const isExists = await client.indices.exists({ index });
    return isExists;
};

// Function to create required indexes if they do not exist
export const createIndexes = async () => {
    const userIndexExists = await indexExists(USERS_INDEX);
    const emailIndexExists = await indexExists(EMAIL_INDEX);
    const mailboxIndexExists = await indexExists(MAIL_BOXES_INDEX);

    // Create users index if not exists
    if (!userIndexExists) {
        await client.indices.create({
            index: USERS_INDEX,
            body: {
                mappings: {
                    properties: {
                        email: { type: 'keyword' },
                        password: { type: 'keyword' },
                        outlookId: { type: 'keyword' },
                        createdAt: { type: 'date' },
                        updatedAt: { type: 'date' }
                    }
                }
            }
        });
        console.log(`${USERS_INDEX} index created.`);
    } else {
        console.log(`${USERS_INDEX} index already exists.`);
    }

    // Create emails index if not exists
    if (!emailIndexExists) {
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

    // Create mailbox index if not exists
    if (!mailboxIndexExists) {
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

// Function to get user by email
export async function getUser(email) {
    const { hits } = await client.search({
        index: USERS_INDEX,
        body: {
            query: {
                term: { "email.keyword": email }
            }
        }
    });

    if (hits?.total?.value === 0) return [new AppError("Not Found", 404)];

    return [null, { ...hits.hits[0]._source, _id: hits.hits[0]._id }];
}

// Function to update user by id
export async function updateUser(id, { outlookId }) {
    await client.update({
        index: USERS_INDEX,
        id: id,
        body: {
            doc: { outlookId, updatedAt: new Date().toISOString() }
        }
    });

    const resp = await client.get({
        index: USERS_INDEX,
        id
    });

    return [null, { ...resp._source, _id: id }];
}

// Function to add a new user
export async function addUser(user) {
    const { hits } = await client.search({
        index: USERS_INDEX,
        body: {
            query: {
                term: { "email.keyword": user.email }
            }
        }
    });

    if (hits?.total?.value > 0) return [new AppError("Email already exists", 400)];

    const now = new Date().toISOString();
    user.createdAt = now;
    user.updatedAt = now;

    const { _id } = await client.index({
        index: USERS_INDEX,
        body: user
    });

    const resp = await client.get({
        index: USERS_INDEX,
        id: _id
    });

    return [null, { ...resp._source, _id }];
}

// Function to save emails to Elasticsearch
export const saveEmails = async (emails, userId) => {
    for (const email of emails) {
        await client.index({
            index: EMAIL_INDEX,
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

// Function to get user by email
export async function getEmails(userId) {
    const { hits } = await client.search({
        index: EMAIL_INDEX,
        body: {
            query: {
                term: { "userId": userId }
            }
        }
    });

    return [null, hits.hits];
}