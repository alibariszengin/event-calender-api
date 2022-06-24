/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const { addOutlookItems } = require("./calendar");
const msal = require("@azure/msal-node");
const asyncErrorWrapper = require("express-async-handler");
const SERVER_PORT = process.env.PORT || 5000;
const REDIRECT_URI = "http://localhost:5000/api/outlook/redirect";
var outlook = require("node-outlook");
var moment = require("moment");
const { AuthorizationCode } = require("simple-oauth2");

const authHelper = require("../helpers/authorization/outlookHelpers");
// Before running the sample, you will need to replace the values in the config,
// including the clientSecret
const config = {
  auth: {
    clientId: "ec77214a-cc0f-40bd-a10b-c89eedf3ee9e",
    authority: "https://login.microsoftonline.com/consumers",
    clientSecret: "ndl8Q~RAtZkO85nZYpxSAQv5pywOKAnG~cLotc2l",
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};
var credentials = {
  client: {
    id: "ec77214a-cc0f-40bd-a10b-c89eedf3ee9e",
    secret: "ndl8Q~RAtZkO85nZYpxSAQv5pywOKAnG~cLotc2l",
  },
  auth: {
    tokenHost: "https://login.live.com",
    tokenPath: "/oauth20_token.srf",
    authorizePath: "/oauth20_authorize.srf",
  },
  options: {
    authorizationMethod: "body",
  },
};
var scope = [
  "openid",
  "profile",
  "offline_access",
  "https://outlook.office.com/calendars.readwrite",
];
// Create msal application object
const pca = new msal.ConfidentialClientApplication(config);
const client = new AuthorizationCode(credentials);
const tokenReceived = asyncErrorWrapper(async (req, res, error, token) => {
  if (error) {
    console.log("ERROR getting token:" + error);
    res.send("ERROR getting token: " + error);
  } else {
    // save tokens in session

    console.log(token);
    req.session.access_token = token.idToken;
    req.session.access_token_not_jwt = token.accessToken;
    //req.session.refresh_token = token.token.refresh_token;
    req.session.email = authHelper.getEmailFromIdToken(token.idToken);
    res.redirect("./logincomplete");
  }
});
const authorize = asyncErrorWrapper(async (req, res, next) => {
  const tokenRequest = {
    code: req.query.code,
    redirectUri: REDIRECT_URI,
    scopes: scope,
  };

  pca
    .acquireTokenByCode(tokenRequest)
    .then((response) => {
      console.log("\nResponse: \n:", response);
      tokenReceived(req, res, null, response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

const completeLogin = asyncErrorWrapper(async (req, res, next) => {
  var access_token = req.session.access_token;
  //var refresh_token = req.session.access_token;

  var email = req.session.email;

  if (access_token === undefined || email === undefined) {
    console.log("/logincomplete called while not logged in");
    res.redirect("/");
    return;
  }

  res.redirect("./sync");
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  req.session.destroy();
  console.log("hey")
  res.send("done");
});

const getIntegration = asyncErrorWrapper(async (req, res, next) => {
  const authCodeUrlParameters = {
    scopes: scope,
    redirectUri: REDIRECT_URI,
  };

  // get url to sign user in and consent to scopes needed for application
  pca
    .getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => {
      console.log(response)
      res.send(response);
    })
    .catch((error) => console.log(JSON.stringify(error)));
});

const redirectUser = asyncErrorWrapper(async (req, res, next) => {
  const tokenRequest = {
    code: req.query.code,
    redirectUri: REDIRECT_URI,
    scopes: scope,
  };
  console.log("heyy");
  pca
    .acquireTokenByCode(tokenRequest)
    .then((response) => {
      console.log("\nResponse: \n:", response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});
const syncCalendar = asyncErrorWrapper(async (req, res, next) => {
  console.log(req.session.access_token);
  var token = req.session.access_token_not_jwt;
  var email = req.session.email;

  if (token === undefined || email === undefined) {
    console.log("/sync called while not logged in");
    res.redirect("/");
    return;
  }
  console.log(email);
  // Set the endpoint to API v2
  outlook.base.setApiEndpoint("https://outlook.office.com/api/v2.0");
  // Set the user's email as the anchor mailbox
  outlook.base.setAnchorMailbox(email);
  // Set the preferred time zone
  outlook.base.setPreferredTimeZone("Turkey Standard Time");

  // Use the syncUrl if available
  var requestUrl = req.session.syncUrl;
  if (requestUrl === undefined) {
    // Calendar sync works on the CalendarView endpoint
    requestUrl = outlook.base.apiEndpoint() + "/Me/CalendarView";
  }
  console.log(requestUrl);
  // Set up our sync window from midnight on the current day to
  // midnight 7 days from now.
  var startDate = moment().startOf("day").add(-30,"days");
  var endDate = moment(startDate).add(60, "days");
  // The start and end date are passed as query parameters
  var params = {
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString(),
  };

  // Set the required headers for sync
  var headers = {
    Prefer: [
      // Enables sync functionality
      "odata.track-changes",
      // Requests only 5 changes per response
      "odata.maxpagesize=5",
    ],
  };

  var apiOptions = {
    url: requestUrl,
    token: token,
    headers: headers,
    query: params,
  };
  console.log(apiOptions);
  outlook.base.makeApiCall(apiOptions, function (error, response) {
    if (error) {
      console.log(JSON.stringify(error));
      res.send(JSON.stringify(error));
    } else {
      if (response.statusCode !== 200) {
        console.log(response.body.error);
        console.log("API Call returned " + response.statusCode);
        res.send("API Call returned " + response.statusCode);
      } else {
        var nextLink = response.body["@odata.nextLink"];
        if (nextLink !== undefined) {
          req.session.syncUrl = nextLink;
        }
        var deltaLink = response.body["@odata.deltaLink"];
        if (deltaLink !== undefined) {
          req.session.syncUrl = deltaLink;
        }
        console.log(response.body);
        addOutlookItems(email, response.body.value, res);
        
      }
    }
  });
});

module.exports = {
  getIntegration,
  redirectUser,
  syncCalendar,
  authorize,
  completeLogin,
  logout
};
