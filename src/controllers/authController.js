import Env from '../env/Env.js';
import wrapCatchAsyncFunctions from '../utils/catchAsync.js';

import oauth2 from '../config/oauth.js';

import ApiResponse from '../utils/apiResponse.js';


class Auth {
    static async authOutlook(req, resp, next) {
        const authURL = oauth2.getAuthorizeUrl({
            redirect_uri: Env.OUTLOOK.REDIRECT_URI,
            scope: 'openid profile offline_access Mail.Read',
            response_type: 'code'
        });
        resp.status(200).json(new ApiResponse(200, { url: authURL }));
    }

    static async outlookCallback(req, resp) {
        const code = req.query.code;
        oauth2.getOAuthAccessToken(
            code,
            { grant_type: 'authorization_code', redirect_uri: Env.OUTLOOK.REDIRECT_URI },
            (err, accessToken, refreshToken, params) => {
                if (err) {
                    console.log(err);
                    return resp.status(500).send('Authentication failed');
                }
                const httpOnlyCookieOptions = { httpOnly: true, secure: true }
                resp.status(200).cookie("accessToken", accessToken, httpOnlyCookieOptions).cookie("refreshToken", refreshToken, httpOnlyCookieOptions).json(new ApiResponse(200, { accessToken, refreshToken, userId: params.id_token }));
            }
        );
    };
}

// Wrap all methods in error handling
wrapCatchAsyncFunctions(Auth);

export default Auth;
