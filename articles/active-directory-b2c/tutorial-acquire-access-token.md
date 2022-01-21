---
title: Tutorial - Acquire an access token for calling a web API in Azure AD B2C
description: Follow this tutorial to learn how to acquire an access token for calling a web API in Azure AD B2C using Microsoft Authentication Library (MSAL) for Node - msal-node.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 12/7/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# Tutorial: Acquire an access token for calling a web API in Azure AD B2C 
In this tutorial, you'll build a web app that acquires an access token for calling a protected web API. A user needs to sign in to the web app to acquire the access token. The access token acquisition is made easier by using [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node). 

Follow the steps in this tutorial to:

> [!div class="checklist"]
> * Register the web application and web API in the Azure portal
> * Expose API permissions and configure scopes on the web API
> * Grant permissions on the web app
> * Install the MSAL library and other necessary node packages  
> * Add code for acquiring the access token
> * Test the app

## Prerequisites
- [Node.js](https://nodejs.org)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor


## Register the web application in Azure portal
Register the web application in Azure portal so that Azure Active Directory B2C (Azure AD B2C) can provide authentication service for your application and its users.

First, complete the steps in [Tutorial: Register a web application in Azure Active Directory B2C](tutorial-register-applications.md) to register the web app. 

Use the following settings for your app registration:
- Under **Name**: `webapp1` (suggested)
- Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
- Under **Redirect URI**, select **Web**, and then enter `http://localhost:3000/redirect` in the URL text box
- Immediately you generate a **Client secret**, record the value as advised as it's shown only once.

At this point, you've the web application (client) ID, and client secret, and you've set the app's redirect URI.

## Register the web API and configure scopes in Azure portal

Register the web API is Azure portal so that you can use Azure AD B2C to protect it. 

First, complete the steps in [Add a web API application to your Azure Active Directory B2C tenant](add-web-api-application.md) to register the web API, configure API scopes, and grant API permissions to the web app.

Use the following settings for your registration:
- While you register the web API, under **Redirect URI**, select web, but you don't need to provide the value for the redirect URI.
- While you configure web API scopes, replace the default value (a GUID) with `colorsapi`. The full URI is should then be formatted as `https://your-tenant-name.onmicrosoft.com/colorsapi`.

## Create Sign in and sign up user flows in Azure portal
Complete the steps in [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow) to create a **Sign in and sign up**  user flow. Give your user flow a name such as `susi_node_app`.

At this point, you've a web app, which can request an access token with scopes `https://your-tenant-name.onmicrosoft.com/colorsapi/demo.write` and `https://your-tenant-name.onmicrosoft.com/colorsapi/demo.read`, and then use it to call a web API. 

You'll learn how to use the acquired access token to call a protected web API in the next tutorial.   

## Create the node project

Create a folder to host your node application, such as  `tutorial-acquire-access-token`.

1. In your terminal, change directory into your node app folder, such as `cd tutorial-acquire-access-token`, and run `npm init -y`. This command creates a default package.json file for your Node.js project.
2. In your terminal, run `npm install express`. This command installs the Express framework.
3. Create more folders and files to achieve the following project structure:
    
    ```
    tutorial-acquire-access-token/
    ├── index.js
    └── package.json
    └── .env
    └── views/
        └── layouts/
            └── main.hbs
        └── signin.hbs
    ```
        
    The `views` folder contains handlebars files for the web app's UI. 

## Install the dependencies 

In your terminal, install the `dotenv`, `express-handlebars`, `express-session`, and `@azure/msal-node` packages by running the following commands:

```
npm install dotenv
npm install express-handlebars
npm install express-session
npm install @azure/msal-node
```

 


## Build web app UI components 

1. In the `main.hbs` file, add the following code:

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
        <title>Tutorial | Authenticate users with MSAL for B2C</title>
    
        <!-- adding Bootstrap 5 for UI components  -->
        <!-- CSS only -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <link rel="SHORTCUT ICON" href="https://c.s-microsoft.com/favicon.ico?v2" type="image/x-icon">
      </head>
      <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <a class="navbar-brand" href="/">Microsoft Identity Platform</a>
            {{#if showSignInButton}}
                <div class="ml-auto">
                    <a type="button" id="SignIn" class="btn btn-success" href="/signin" aria-haspopup="true" aria-expanded="false">
                        Sign in to acquire access token
                    </a>
                </div>
            {{else}}
                    <p class="navbar-brand d-flex ms-auto">Hi {{givenName}}</p>
                    <a class="navbar-brand d-flex ms-auto" href="/signout">Sign out</a>
            {{/if}}
        </nav>
        <br>
        <h5 class="card-header text-center">MSAL Node Confidential Client application with Auth Code Flow</h5>
        <br>
        <div class="row" style="margin:auto" >
          {{{body}}}
        </div>
        <br>
        <br>
      </body>
    </html> 
    ```
    The `main.hbs` file is in the `layout` folder and it should contain any HTML code that is required throughout your application. It implements UI built with the Bootstrap 5 CSS Framework. Any UI that changes from page to page, such as `signin.hbs`, is placed in the placeholder shown as ` {{{body}}}`. 

2. In the `signin.hbs` file, add the following code:

    ```html
    <div class="col-md-3" style="margin:auto">
      <div class="card text-center">
        <div class="card-body">
          {{#if showSignInButton}}
    
          {{else}}
               <h5 class="card-title">You have signed in. You've acquired an access token. You can use it to call a protected API</h5>
          {{/if}}
        </div>
        </div>
      </div>
    </div>
    ```

## Complete the server code

1. In the `.env` file, add the following code, which includes server http port,  app registration details, and sign in and sign up user flow/policy details:

    ```
    #HTTP port
    SERVER_PORT=server-port
    #web apps client ID
    APP_CLIENT_ID=client-id
    #session secret
    SESSION_SECRET=session-secret
    #web app client secret
    APP_CLIENT_SECRET=client-secret
    #B2C sign up and sign in user flow/policy authority
    SIGN_UP_SIGN_IN_POLICY_AUTHORITY=https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/susi-flow
    AUTHORITY_DOMAIN=https://tenant-name.b2clogin.com
    #client redirect url
    APP_REDIRECT_URI=http://localhost:server-port/redirect
    LOGOUT_ENDPOINT=https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/susi-flow/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:server-port
    ``` 
    Modify the values in the `.env` files as follows:
    - `server-port`: The HTTP port on which your web app is running such as `3000`.
    - `client-id`: The **Application (client) ID** of the web app you registered.
    - `session-secret`: A random string to be used as your express session secret. 
    - `client-secret`: Replace this value with the client secret you created earlier.
    - `tenant-name`: Replace this value with the tenant name in which you created your web app. Learn how to [Read your tenant name](tenant-management.md#get-your-tenant-name). If you're using a custom domain, then replace `tenant-name.b2clogin.com` with your domain, such as `contoso.com`.
    - `susi-flow`: The **Sign up and Sign up** user flow such as `B2C_1_susi_node_app`.
    
    >[!WARNING]
    > Any plaintext secret in source code poses an increased security risk. This tutorial uses a plaintext client secret for simplicity. Use certificate credential instead of client secrets in your confidential client applications, especially for the apps you intend to deploy to production.

2. In your `index.js` file, add the following code:

    ```javascript
    /*
     * Copyright (c) Microsoft Corporation. All rights reserved.
     * Licensed under the MIT License.
     */
    require('dotenv').config();
    const express = require('express');
    const session = require('express-session');
    const {engine}  = require('express-handlebars');
    const msal = require('@azure/msal-node');
    
    /**
     * Confidential Client Application Configuration
     */
     const confidentialClientConfig = {
        auth: {
            clientId: process.env.APP_CLIENT_ID, 
            authority: process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY, 
            clientSecret: process.env.APP_CLIENT_SECRET,
            knownAuthorities: [process.env.AUTHORITY_DOMAIN], //This must be an array
            redirectUri: process.env.APP_REDIRECT_URI,
            validateAuthority: false
        },
        system: {
            loggerOptions: {
                loggerCallback(loglevel, message, containsPii) {
                    console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: msal.LogLevel.Verbose,
            }
        }
    };
    
    // Current web API coordinates were pre-registered in a B2C tenant.
    const apiConfig = {
        webApiScopes: ['https://tenant-name.onmicrosoft.com/colorsapi/demo.read']
    };
    
    /**
     * The MSAL.js library allows you to pass your custom state as state parameter in the Request object
     * By default, MSAL.js passes a randomly generated unique state parameter value in the authentication requests.
     * The state parameter can also be used to encode information of the app's state before redirect. 
     * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
     * For more information, visit: https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request
     */
    const APP_STATES = {
        LOGIN: 'login',  
    }
    
    /** 
     * Request Configuration
     * We manipulate these two request objects below 
     * to acquire a token with the appropriate claims.
     */
     const authCodeRequest = {
        redirectUri: confidentialClientConfig.auth.redirectUri,
    };
    
    const tokenRequest = {
        redirectUri: confidentialClientConfig.auth.redirectUri,
    };
    
    // Initialize MSAL Node
    const confidentialClientApplication = new msal.ConfidentialClientApplication(confidentialClientConfig);
    
    /**
     * Using express-session middleware. Be sure to familiarize yourself with available options
     * and set them as desired. Visit: https://www.npmjs.com/package/express-session
     */
     const sessionConfig = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // set this to true on production
        }
    }
    //Create an express instance
    const app = express();
    
    //Set handlebars as your view engine
    app.engine('.hbs', engine({extname: '.hbs'}));
    app.set('view engine', '.hbs');
    app.set("views", "./views");
    
    app.use(session(sessionConfig));
    
    /**
     * This method is used to generate an auth code request
     * @param {string} authority: the authority to request the auth code from 
     * @param {array} scopes: scopes to request the auth code for 
     * @param {string} state: state of the application, tag a request
     * @param {Object} res: express middleware response object
     */
     const getAuthCode = (authority, scopes, state, res) => {
        // prepare the request
        console.log("Fetching Authorization code")
        authCodeRequest.authority = authority;
        authCodeRequest.scopes = scopes;
        authCodeRequest.state = state;
    
        //Each time you fetch Authorization code, update the authority in the tokenRequest configuration
        tokenRequest.authority = authority;
    
        // request an authorization code to exchange for a token
        return confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
            .then((response) => {
                console.log("\nAuthCodeURL: \n" + response);
                //redirect to the auth code URL/send code to 
                res.redirect(response);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    }
    
    app.get('/', (req, res) => {
        res.render('signin', { showSignInButton: true });
    });
    
    app.get('/signin',(req, res)=>{ 
            //Initiate a Auth Code Flow >> for sign in and access token acquisition 
            //Pass the api scopes as well so that you received both the IdToken and accessToken
            getAuthCode(process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY, apiConfig.webApiScopes, APP_STATES.LOGIN, res);
    });
    app.get('/redirect',(req, res)=>{    
        
        if (req.query.state === APP_STATES.LOGIN) {
            // prepare the request for calling the web API
            tokenRequest.authority = process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY;
            tokenRequest.scopes = apiConfig.webApiScopes;
            tokenRequest.code = req.query.code;
            confidentialClientApplication.acquireTokenByCode(tokenRequest)
            .then((response) => {
                req.session.accessToken = response.accessToken;
                req.session.givenName = response.idTokenClaims.given_name;
                console.log('\nAccessToken:' + req.session.accessToken);
                res.render('signin', {showSignInButton: false, givenName: response.idTokenClaims.given_name});
            }).catch((error) => {
                console.log(error);
                res.status(500).send(error);
            });
        }else{
            res.status(500).send('We do not recognize this response!');
        }
    });
    /**
     * Sign out end point
    */
    app.get('/signout',async (req, res)=>{    
        logoutUri = process.env.LOGOUT_ENDPOINT;
        req.session.destroy(() => {
            res.redirect(logoutUri);
        });
    });
    
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Msal Node Auth Code Sample app listening on port !` + process.env.SERVER_PORT);
    });
    ```
    Replace `tenant-name` with the tenant name in which you created your web app. 
    
    The code in the `index.js` files consists of global variables and endpoints.
    
    Global variables: 
    - `confidentialClientConfig`: The MSAL configuration object, which is used to create the confidential client application object. 
    - `apiConfig`: Contains `webApiScopes` property, which is the scopes configured in the web API, and granted to the web app.
    - `APP_STATES`: Used to differentiate between responses received from Azure AD B2C by tagging requests. There's only one redirect URI for any number of requests sent to Azure AD B2C.
    - `authCodeRequest`: The configuration object used to retrieve authorization code. 
    - `tokenRequest`: The configuration object used to acquire a token by authorization code.
    - `sessionConfig`: The configuration object for express session. 
    - `getAuthCode`: A method that creates the URL of the authorization request, letting the user input credentials and consent to the application. It uses the `getAuthCodeUrl` method, which is defined in the `ConfidentialClientApplication` class.
    
    App endpoints:
    - `/`: 
        - Used to enter the web app.
        - It renders the `signin` page.
    - `/signin`:
        - Used when the end-user signs in.
        - Calls `getAuthCode()` method and passes the `authority` for **Sign in and sign up** user flow/policy, `APP_STATES.LOGIN`, and `apiConfig.webApiScopes` to it.  
        - It causes the end user to be challenged to enter their logins, or if the user doesn't have an account, they can sign up.
        - The final response resulting from this endpoint includes an authorization code from B2C posted back to the `/redirect` endpoint.
    - `/redirect`:
        - It's the endpoint set as Redirect URI for the web app in Azure portal.
        - It uses the `state` query parameter in Azure AD B2C's request to it, to differentiate between requests, which are made from the web app.
        - If the app state is `APP_STATES.LOGIN`, the authorization code acquired is used to retrieve a token using the `acquireTokenByCode()` method. When requesting for a token using `acquireTokenByCode` method, you use the same scopes used while acquiring the authorization code. The acquired token includes an `accessToken`, `idToken`, and `idTokenClaims`. The `accessToken` can be used to call an API, and the `idToken` identifies the user alongside the `idTokenClaims`.
        - Put the `accessToken` in the session, and log it.  
    - `/signout`:
        - Used when a user signs out.
        - The web app session is cleared and an http call is made to Azure AD B2c logout endpoint.  

## Test your web app
1. In your terminal, run the following to start the Node.js web server:
    ```
    node index.js
    ``` 
2. In your browser, navigate to `http://localhost:3000` or `http://localhost:port`, where `port` is the port that your web server is listening on. You should see the page with a **Sign in to acquire access token** button.

    :::image type="content" source="./media/tutorial-acquire-access-token/signin-acquire-access-token.png" alt-text="Node web app sign in page for acquiring access token":::

### Test sign in
1. After the page with a **Sign in to acquire access token** button completes loading, select the **Sign in to acquire access token**. You're prompted to sign in.
1. Enter your sign in credentials such as email address and password. If you don't have an account, select **Sign up now** to create an account. If you've an account but have forgotten your password, select **Forgot your password?** to recover your password. After you successfully sign in or sign up, you should see the page with sign in status as shown below.

     :::image type="content" source="./media/tutorial-acquire-access-token/signed-in-acquire-access-token.png" alt-text="Node web app signed in status for acquiring access token":::
3. In the terminal, find a long string, such as one shown below, that's, the access token:
    ```
    eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtM.............
    ```

### Test sign out 
After you sign in, select **Sign out**. You should see the page with a **Sign in to acquire access token** button again. When you sign out, you clear the app session, and you lose the access token. 

## Next steps

- Learn how to [Call a web API protected by Azure AD B2C](tutorial-call-api-with-access-token.md).