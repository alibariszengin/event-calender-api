const msal = require("@azure/msal-node");
const asyncErrorWrapper = require("express-async-handler");
const { AuthorizationCode } = require("simple-oauth2");
const SERVER_PORT = process.env.PORT || 5000;
var clientId = "ec77214a-cc0f-40bd-a10b-c89eedf3ee9eE";
var clientSecret = "ndl8Q~RAtZkO85nZYpxSAQv5pywOKAnG~cLotc2l";
var redirectUri = "http://localhost:5000/api/outlook/redirect";

var scopes = [
  "openid",
  "profile",
  "offline_access",
  "https://outlook.office.com/calendars.readwrite"
];

// var credentials = {
//   client: {
//     id: clientId,
//     secret: clientSecret
//   },
//   auth: {
//     tokenHost: 'https://login.live.com',
//     tokenPath: '/oauth20_token.srf',
//     authorizePath: '/oauth20_authorize.srf',
//   },
//   options: {
//     authorizationMethod: 'body',
//   },
// };

// const client = new AuthorizationCode(credentials);

module.exports = {
  getAuthUrl: function () {
    var returnVal = client.authCode.authorizeURL({
      redirect_uri: redirectUri,
      scope: scopes.join(" "),
    });
    console.log("");
    console.log("Generated auth url: " + returnVal);
    return returnVal;
  },

  getTokenFromCode: asyncErrorWrapper(async function (client, auth_code, callback, request, response) {
    
    const tokenParams = {
      code: auth_code,
      redirect_uri: redirectUri,
      //scope: scopes.join(" ")
    };
    console.log(tokenParams)
    try {
      const token = await client.getToken(tokenParams, { json: true });

      //var token = oauth2.accessToken.create(result);

      console.log("Token created: ", token.token);
      callback(request, response, null, token);
    } catch (error) {
     
      console.log("Access token error: ", error.message);
      callback(request, response, error, null);
    }
  }),

  getEmailFromIdToken: function (id_token) {
    // JWT is in three parts, separated by a '.'
    var token_parts = id_token.split(".");
    
    // Token content is in the second part, in urlsafe base64
    var encoded_token = Buffer.from(
      token_parts[1].replace("-", "+").replace("_", "/"),
      "base64"
    );

    var decoded_token = encoded_token.toString();
      console.log(decoded_token)
    var jwt = JSON.parse(decoded_token);

    // Email is in the preferred_username field
    return jwt.preferred_username;
  },

  getTokenFromRefreshToken: function (
    refresh_token,
    callback,
    request,
    response
  ) {
    var token = oauth2.accessToken.create({
      refresh_token: refresh_token,
      expires_in: 0,
    });
    token.refresh(function (error, result) {
      if (error) {
        console.log("Refresh token error: ", error.message);
        callback(request, response, error, null);
      } else {
        console.log("New token: ", result.token);
        callback(request, response, null, result);
      }
    });
  },
};
