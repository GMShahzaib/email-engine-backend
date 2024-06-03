import Env from "../env/Env.js";
import { APP_MODES } from "../utils/const.values.js";

const sendDevErr = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (Env.ENVIRONMENT === APP_MODES.DEVELOPMENT) {
        sendDevErr(err, res);
    }
};

export default globalErrorHandler;
