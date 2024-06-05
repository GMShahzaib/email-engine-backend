import bcrypt from 'bcryptjs';
import Env from '../env/Env.js';
import wrapCatchAsyncFunctions from '../utils/catchAsync.js';
import oauth2 from '../config/oauth.js';
import ApiResponse from '../utils/apiResponse.js';
import { addUser, getUser, updateUser } from '../services/elasticsearchService.js';
import AppError from '../utils/AppError.js';
import { WRONG_CREDENTIALS } from '../utils/constants.js';
import { createAccessToken, createRefreshToken } from '../utils/signToken.js';
import { fetchMe, getOAuthTokens } from '../services/outlookService.js';

class Auth {
    // Method to handle user login
    static async login(req, resp, next) {
        const { email, password } = req.body;
        // Retrieve user from database
        const [err, user] = await getUser(email);

        if (err) return next(err);
        // Check if user exists and has a password
        if (!user || !user.password) next(new AppError(WRONG_CREDENTIALS, 401));

        // Compare passwords
        const passwordValid = await bcrypt.compare(password, user.password);

        // If password is invalid, send error response
        if (!passwordValid) return next(new AppError(WRONG_CREDENTIALS, 401));

        // Generate access and refresh tokens
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        // Set options for HTTP-only cookies
        const httpOnlyCookieOptions = { httpOnly: true, secure: true };

        // Set cookies and send response
        resp.cookie("accessToken", accessToken, httpOnlyCookieOptions)
            .cookie("refreshToken", refreshToken, httpOnlyCookieOptions)
            .json(new ApiResponse(200, { user, accessToken, refreshToken }));
    }

    // Method to handle user registration
    static async register(req, resp, next) {
        const { email, password } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Add user to the database
        const [err, user] = await addUser({ email, password: hashedPassword });

        if (err) return next(err);

        // Send success response
        resp.json(new ApiResponse(200, { user }));
    }

    // Method to initiate authentication with Outlook
    static async authOutlook(req, resp, next) {
        // Get authorization URL
        const authURL = oauth2.getAuthorizeUrl({
            redirect_uri: Env.OUTLOOK.REDIRECT_URI,
            scope: 'openid profile User.Read offline_access Mail.Read',
            response_type: 'code'
        });

        // Send authorization URL in response
        resp.json(new ApiResponse(200, { url: authURL }));
    }

    // Method to handle callback from Outlook authentication
    static async outlookCallback(req, resp, next) {
        const code = req.query.code;
        // Get OAuth tokens using the authorization code
        const { accessToken, refreshToken, params } = await getOAuthTokens(code);
        // Fetch user data from Outlook
        const outLookUser = await fetchMe(accessToken);
        // Check if user already exists
        const [notExist, user] = await getUser(outLookUser.mail);
        let latestUser;

        // If user does not exist, add new user
        if (notExist) {
            const [err, newUser] = await addUser({ email: outLookUser.mail, outlookId: params.id_token });
            if (err) throw new Error();
            latestUser = newUser;
        } else {
            // If user exists, update user's Outlook ID
            const [err, updatedUser] = await updateUser(user._id, { outlookId: params.id_token });
            if (err) throw new Error();
            latestUser = updatedUser;
        }

        // Generate local access and refresh tokens
        const localAccessToken = createAccessToken(user._id);
        const localRefreshToken = createRefreshToken(user._id);
        // Set options for HTTP-only cookies
        const httpOnlyCookieOptions = { httpOnly: true, secure: true };

        // Set cookies and send response
        resp.cookie("accessToken", localAccessToken, httpOnlyCookieOptions)
            .cookie("refreshToken", localRefreshToken, httpOnlyCookieOptions)
            .cookie("outlookAccessToken", accessToken, httpOnlyCookieOptions)
            .cookie("outlookRefreshToken", refreshToken, httpOnlyCookieOptions);

        // Send response with user data and tokens
        resp.json(new ApiResponse(200, {
            user: latestUser,
            accessToken: localAccessToken,
            refreshToken: localRefreshToken,
            outlookAccessToken: accessToken,
            outlookRefreshToken: refreshToken,
            userId: params.id_token
        }));
    };
}

// Wrap async functions with error handling
wrapCatchAsyncFunctions(Auth);

export default Auth;
