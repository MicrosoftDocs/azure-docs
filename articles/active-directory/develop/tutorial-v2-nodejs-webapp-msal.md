---
title: "Tutorial: Sign in users in a Node.js & Express web app | Azure"
titleSuffix: Microsoft identity platform
description: In this tutorial, you add support for signing-in users in a web app.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.date: 02/17/2021
ms.author: marsma
---

# Tutorial: Sign in users and acquire a token for Microsoft Graph in a Node.js & Express web app

In this tutorial, you build a web app that signs-in users and acquires access tokens for calling Microsoft Graph. The web app you build uses the [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node).

Follow the steps in this tutorial to:

> [!div class="checklist"]
> - Register the application in the Azure portal
> - Create an Express web app project
> - Install the authentication library packages
> - Add app registration details
> - Add code for user login
> - Test the app

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

## Register the application

First, complete the steps in [Register an application with the Microsoft identity platform](quickstart-register-app.md) to register your app.

Use the following settings for your app registration:

- Name: `ExpressWebApp` (suggested)
- Supported account types: **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**
- Platform type: **Web**
- Redirect URI: `http://localhost:3000/auth/redirect`
- Client secret: `*********` (record this value for use in a later step - it's shown only once)

## Create the project

Use the [Express application generator tool](https://expressjs.com/en/starter/generator.html) to create an application skeleton.

1. First, install the [express-generator](https://www.npmjs.com/package/express-generator) package:

```console
    npm install -g express-generator
```

2. Then, create an application skeleton as follows: 
 
```console
    express --view=hbs /ExpressWebApp && cd /ExpressWebApp
    npm install
```

You now have a simple Express web app. The file and folder structure of your project should look similar to the following:

```
ExpressWebApp/
├── bin/
|    └── wwww
├── public/
|    ├── images/
|    ├── javascript/
|    └── stylesheets/
|        └── style.css
├── routes/
|    ├── index.js
|    └── users.js
├── views/
|    ├── error.hbs
|    ├── index.hbs
|    └── layout.hbs
├── app.js
└── package.json
```

## Install the auth library

Locate the root of your project directory in a terminal and install the MSAL Node package via NPM.

```console
    npm install --save @azure/msal-node
```

## Install other dependencies

The web app sample in this tutorial uses the [express-session](https://www.npmjs.com/package/express-session) package for session management, [dotenv](https://www.npmjs.com/package/dotenv) package for reading environment parameters during development, and [axios](https://www.npmjs.com/package/axios) for making network calls to the Microsoft Graph API. Install these via NPM:

```console
    npm install express-session dotenv axios
```

## Add app registration details

1. Create an *.env* file in the root of your project folder. Then add the following code:

```txt
    AAD_CLOUD_INSTANCE=Enter_the_Cloud_Instance_Id_Here # cloud instance string should end with a trailing slash
    AAD_TENANT_INFO=Enter_the_Tenant_Info_Here
    AAD_CLIENT_ID=Enter_the_Application_Id_Here
    AAD_CLIENT_SECRET=Enter_the_Client_Secret_Here
    
    AAD_REDIRECT_URI=http://localhost:3000/auth/redirect
    AAD_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
    
    GRAPH_API_ENDPOINT=Enter_the_Graph_Endpoint_Here # graph api endpoint string should end with a trailing slash
    
    EXPRESS_SESSION_SECRET=Enter_the_Express_Session_Secret_Here
```

Fill in these details with the values you obtain from Azure app registration portal:

- `Enter_the_Cloud_Instance_Id_Here`: The Azure cloud instance in which your application is registered.
  - For the main (or *global*) Azure cloud, enter `https://login.microsoftonline.com/` (include the trailing forward-slash).
  - For **national** clouds (for example, China), you can find appropriate values in [National clouds](authentication-national-cloud.md).
- `Enter_the_Tenant_Info_here` should be one of the following:
  - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name**. For example, `contoso.microsoft.com`.
  - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
  - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`.
  - To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
- `Enter_the_Application_Id_Here`: The **Application (client) ID** of the application you registered.
- `Enter_the_Client_secret`: Replace this value with the client secret you created earlier. To generate a new key, use **Certificates & secrets** in the app registration settings in the Azure portal.

> [!WARNING]
> Any plaintext secret in source code poses an increased security risk. This article uses a plaintext client secret for simplicity only. Use [certificate credentials](active-directory-certificate-credentials.md) instead of client secrets in your confidential client applications, especially those apps you intend to deploy to production.

- `Enter_the_Graph_Endpoint_Here`: The Microsoft Graph API cloud instance that your app will call. For the main (global) Microsoft Graph API service, enter `https://graph.microsoft.com/` (include the trailing forward-slash). For more information, see the [National cloud deployments](https://docs.microsoft.com/graph/deployments).
- `Enter_the_Express_Session_Secret_Here` the secret used to encrypt the Express session cookie. Choose a hard to guess value to replace this string with, such as your client secret.


2. Next, create a file named *authConfig.js* in the root of your project for reading in these parameters. Once created, add the following code there:

```JavaScript
require('dotenv').config();

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: process.env.AAD_CLIENT_ID, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
    authority: process.env.AAD_CLOUD_INSTANCE + process.env.AAD_TENANT_INFO, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
    clientSecret: process.env.AAD_CLIENT_SECRET // Client secret generated from the app registration in Azure portal
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: "Info",
    }
  }
}

const REDIRECT_URI = process.env.AAD_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI = process.env.AAD_POST_LOGOUT_REDIRECT_URI;
const GRAPH_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v1.0/me";

module.exports = {
  msalConfig,
  REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI,
  GRAPH_ENDPOINT
};
```

## Add code for user login and token acquisition

1. In the *routes/* folder, create a new file named *auth.js* and add the following code:

```JavaScript
    var express = require('express');
    var msal = require('@azure/msal-node');
    
    var {
      msalConfig,
      REDIRECT_URI,
      POST_LOGOUT_REDIRECT_URI
    } = require('../authConfig');
    
    const router = express.Router();
    const msalInstance = new msal.ConfidentialClientApplication(msalConfig);
    const cryptoProvider = new msal.CryptoProvider();
    
    async function redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams) {
    
      // Generate PKCE Codes before starting the authorization flow
      const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
    
      // Set generated PKCE codes and method as session vars
      req.session.pkceCodes = {
        challengeMethod: 'S256',
        verifier: verifier,
        challenge: challenge,
      };
    
      req.session.authCodeUrlRequest = {
        redirectUri: REDIRECT_URI,
        responseMode: 'form_post', // recommended for confidential clients
        codeChallenge: req.session.pkceCodes.challenge,
        codeChallengeMethod: req.session.pkceCodes.challengeMethod,
        ...authCodeUrlRequestParams,
      }
    
      req.session.authCodeRequest = {
        redirectUri: REDIRECT_URI,
        code: "",
        ...authCodeRequestParams,
      }
    
      // Get url to sign user in and consent to scopes needed for application
      try {
        const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
        res.redirect(authCodeUrlResponse);
      } catch (error) {
        next(error);
      }
    };
    
    router.get('/signin', async function (req, res, next) {
    
      // create a GUID for crsf
      req.session.csrfToken = cryptoProvider.createNewGuid();
    
      const state = cryptoProvider.base64Encode(
        JSON.stringify({
          csrfToken: req.session.csrfToken,
          redirectTo: '/'
        })
      );
    
      const authCodeUrlRequestParams = {
        state: state,
        scopes: [], // by default, MSAL Node will add OIDC scopes to the request
      };
    
      const authCodeRequestParams = {
        scopes: [],
      }
    
      // trigger the first leg of auth code flow
      return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams)
    });
    
    router.get('/acquireToken', async function (req, res, next) {
    
      // create a GUID for csrf
      req.session.csrfToken = cryptoProvider.createNewGuid();
    
      // encode the state param
      const state = cryptoProvider.base64Encode(
        JSON.stringify({
          csrfToken: req.session.csrfToken,
          redirectTo: '/users/profile'
        })
      );
    
      const authCodeUrlRequestParams = {
        state: state,
        scopes: ["User.Read"],
      };
    
      const authCodeRequestParams = {
        scopes: ["User.Read"],
      }
    
      // trigger the first leg of auth code flow
      return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams)
    });
    
    router.post('/redirect', async function (req, res, next) {
      if (req.body.state) {
        const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));
    
        // check if csrfToken matches
        if (state.csrfToken === req.session.csrfToken) {
          req.session.authCodeRequest.code = req.body.code; // authZ code
          req.session.authCodeRequest.codeVerifier = req.session.pkceCodes.verifier // PKCE Code Verifier
    
          try {
            const tokenResponse = await msalInstance.acquireTokenByCode(req.session.authCodeRequest);
            req.session.accessToken = tokenResponse.accessToken;
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            req.session.isAuthenticated = true;
    
            res.redirect(state.redirectTo);
          } catch (error) {
            next(error);
          }
        } else {
          next(new Error('csrf token does not match'));
        }
      } else {
        next(new Error('state is missing'));
      }
    });
    
    router.get('/signout', function (req, res) {
      const logoutUri = `${msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;
    
      req.session.destroy(() => {
        res.redirect(logoutUri);
      });
    });
    
    module.exports = router;
```

2. Next, update the *index.js* route by replacing the existing code with the following:

```JavaScript
    var express = require('express');
    var router = express.Router();
    
    router.get('/', function (req, res, next) {
      res.render('index', {
        title: 'MSAL Node & Express Web App',
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.account?.username,
      });
    });
    
    module.exports = router;
```

3. Finally, update the *users.js* route by replacing the existing code with the following:

```JavaScript
    var express = require('express');
    var router = express.Router();
    
    var fetch = require('../fetch');
    
    var { GRAPH_ENDPOINT } = require('../authConfig');
    
    // custom middleware to check auth state
    function isAuthenticated(req, res, next) {
      if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
      }
    
      next();
    };
    
    router.get('/id',
      isAuthenticated, // check if user is authenticated
      async function (req, res, next) {
        res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
      }
    );
    
    router.get('/profile',
      isAuthenticated, // check if user is authenticated
      async function (req, res, next) {
        try {
          const graphResponse = await fetch(GRAPH_ENDPOINT, req.session.accessToken);
          res.render('profile', { profile: graphResponse });
        } catch (error) {
          next(error);
        }
      }
    );
    
    module.exports = router;
```

## Add code for calling the Microsoft Graph API

Create a file named **fetch.js** in the root of your project and add the following code:

```JavaScript
    var axios = require('axios').default;
    
    async function fetch(endpoint, accessToken) {
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };
    
      console.log(`request made to ${endpoint} at: ` + new Date().toString());
    
      try {
        const response = await axios.get(endpoint, options);
        return await response.data;
      } catch (error) {
        throw new Error(error);
      }
    }
    
    module.exports = fetch;
```

## Add views for displaying data

1. In the *views/* folder, update the *index.hbs* file by replacing the existing code with the following:

```hbs
    <h1>{{title}}</h1>
    {{#if isAuthenticated }}
    <p>Hi {{username}}!</p>
    <a href="/users/id">View ID token claims</a>
    <br>
    <a href="/auth/acquireToken">Acquire a token to call the Microsoft Graph API</a>
    <br>
    <a href="/auth/signout">Sign out</a>
    {{else}}
    <p>Welcome to {{title}}</p>
    <a href="/auth/signin">Sign in</a>
    {{/if}}
```

2. Still in the same folder, create another file named *id.hbs* for displaying the contents of user's ID token:

```hbs
    <h1>Azure AD</h1>
    <h3>ID Token</h3>
    <table>
      <tbody>
        {{#each idTokenClaims}}
        <tr>
          <td>{{@key}}</td>
          <td>{{this}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
    <br>
    <a href="/">Go back</a>
```

3. Finally, create another file named *profile.hbs* for displaying the result of the call made to Microsoft Graph:

```hbs
    <h1>Microsoft Graph API</h1>
    <h3>/me endpoint response</h3>
    <table>
      <tbody>
        {{#each profile}}
        <tr>
          <td>{{@key}}</td>
          <td>{{this}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
    <br>
    <a href="/">Go back</a>
```

## Register routers and add state management

In the *app.js* file in the root of the project folder, register the routes you have created earlier and add session support for tracking authentication state using **express-session** package. Replace the existing code there with the following:

```JavaScript
    require('dotenv').config();
    
    var path = require('path');
    var express = require('express');
    var session = require('express-session');
    var createError = require('http-errors');
    var cookieParser = require('cookie-parser');
    var logger = require('morgan');
    
    var indexRouter = require('./routes/index');
    var usersRouter = require('./routes/users');
    var authRouter = require('./routes/auth');
    
    // initialize express
    var app = express();
    
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');
    
    app.use(logger('dev'));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    
    app.use(session({
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // set this to true on production
      }
    }));
    
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/auth', authRouter);
    
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });
    
    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    
      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
    
    module.exports = app;
```

## Test sign in and call Microsoft Graph

You've completed creation of the application and are now ready to test the app's functionality.

1. Start the Node.js console app by running the following command from within the root of your project folder:

```console
   npm start
```

2. Open a browser window and navigate to `http://localhost:3000`. You should see a welcome page:

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/welcome-screen.png" alt-text="Web app welcome page displaying":::

3. Select **Sign in** link. You should see the Azure AD sign-in screen:

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/sign-in-screen.png" alt-text="Azure AD sign-in screen displaying":::

4. Once you enter your credentials, you should see a consent screen asking you to approve the permissions for the app.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/consent-screen.png" alt-text="Azure AD consent screen displaying":::

5. Once you consent, you should be redirected back to application home page. 

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/post-sign-in-screen.png" alt-text="Web app welcome page after sign-in displaying":::

6. Select the **View ID Token** link for displaying the contents of the signed-in user's ID token.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/id-token-screen.png" alt-text="User ID token screen displaying":::

7. Go back to the home page, and select the **Acquire an access token and call the Microsoft Graph API** link. Once you do, you should see the response from Microsoft Graph /me endpoint for the signed-in user.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/graph-call-screen.png" alt-text="Graph call screen displaying":::

8. Go back to the home page, and select the **Sign out** link. You should see the Azure AD sign-out screen.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/sign-out-screen.png" alt-text="Azure AD sign-out screen displaying":::

## How the application works

In this tutorial, you instantiated an MSAL Node [ConfidentialClientApplication](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md) object by passing it a configuration object (*msalConfig*) that contains parameters obtained from your Azure AD app registration on Azure portal. The web app you created uses the [OpenID Connect protocol](./v2-protocols-oidc.md) to sign-in users and the [OAuth 2.0 Authorization code grant flow](./v2-oauth2-auth-code-flow.md) obtain access tokens.

## Next steps

If you'd like to dive deeper into Node.js & Express web application development on the Microsoft identity platform, see our multi-part scenario series:

> [!div class="nextstepaction"]
> [Scenario: Web app that signs in users](scenario-web-app-sign-user-overview.md)
