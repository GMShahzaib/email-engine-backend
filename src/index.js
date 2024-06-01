import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import api from './app.js';
import Env from './env/Env.js';

import { createIndexes } from './services/elasticsearchService.js'
import globalErrorHandler from './handler/globalError.js';


const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Mount the API routes on the '/api' path
app.use('/api', api);

// globalErrorHandler
app.use(globalErrorHandler);

// Define the port to run the server on
const PORT = Env.PORT || 8080;

// Start the server and listen on the defined port
try {
    app.listen(PORT, async() => {
        await createIndexes(); 
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    // Log any server startup errors
    console.error(`Error occurred: ${error.message}`);
}
