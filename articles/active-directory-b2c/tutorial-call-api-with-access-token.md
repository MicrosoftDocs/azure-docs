---
title: Tutorial - Call a web API protected by Azure AD B2C
description: Follow this tutorial to learn how to call a web API protected by Azure AD B2C from a node js web app. A web app acquires an access token and uses it to call a protected endpoint. The web app adds the access token as a bearer in the Authorization header, and the web API needs to validate it. 
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

# Tutorial: Call a web API protected with Azure AD B2C

In this tutorial, you'll learn how to use an access token issued by Azure Active Directory B2C (Azure AD B2C) to call a web API. The web API need to be protected by Azure AD B2C itself. In this setup, a web app, such as *webapp1*, and a web API, such as *webapi1*, are involved. Users authenticate into the web app to acquire an access token, which they use to call a protected web API.

The following events are accomplished by the web app:
- It authenticates users with Azure AD B2C.
- It acquires an access token with the required permissions (scopes) for the web API endpoint.
- It passes the access token as a bearer token in the authentication header of the HTTP request. It uses the format:
```http
Authorization: Bearer <token>
```

The following events are accomplished by the web API:
- It reads the bearer token from the authorization header in the HTTP request.
- It validates the token.
- It validates the permissions (scopes) in the token.
- It responds to the HTTP request. If the token isn't valid, the web API endpoint responds with `401 Unauthorized` HTTP error.

Follow the steps in this tutorial to:

> [!div class="checklist"]
> * Write code for a sample node API, *colorsapi*
> * Expose a public and a private endpoint in the node API
> * Protect the private endpoint with Azure AD B2C and validate requests to this endpoint
> * Test the API by calling it from a node web app 



## Prerequisites
- Complete the steps in [Tutorial: Sign in and sign out users with Azure AD B2C in a Node.js web app](tutorial-authenticate-nodejs-web-app-msal.md). The tutorial shows you how to configure scopes for a web API, and grant permissions to a web app, such as *webapp1*. It also acquires an access token for calling a web API. The acquired access token is what we'll use to call a protected web API in this tutorial. 

## Create the web API

1. Create a folder to host your node application, such as `tutorial-colors-api`:
    1. In your terminal, change directory into your node app folder, such as `cd tutorial-colors-api`, and run `npm init -y`. This command creates a default package.json file for your Node.js project.
    1. In your terminal, run `npm install express`. This command installs the Express framework.
1. Create `index.js` and `.env` files to achieve the following project structure:

    ```
    tutorial-colors-api/
    ├── index.js
    └── package.json
    └── .env
    ``` 
1. To install app dependencies, run the following commands in your terminal:
    ```
    npm install dotenv
    npm install express
    npm install passport
    npm install passport-azure-ad
    ```  
    `passport-azure-ad` enables you to protect an API endpoint using BearerStrategy. Learn more about [how BearerStrategy](https://www.npmjs.com/package/passport-azure-ad).   
1. In your `.env` file, add the following code:

    ```
    #api port number
    HTTP_PORT=api-server-port
    #client ID for the colors web api; also serves as the audience
    CLIENT_ID=web-api-client-id
    TENANT_NAME=tenant-name
    ISSUER=https://tenant-name.b2clogin.com/tenant-id/v2.0/
    POLICY_NAME=susi-flow
    METADATA_DISCOVERY=.well-known/openid-configuration
    METADATA_VERSION=v2.0
    isB2C=true
    validateIssuer=false
    passReqToCallbackfalse=false
    loggingLevel=info
    ```
    Modify the values in the `.env` files as follows:
    - `api-server-port`: The HTTP port on which your web API is running, such as `4000`.
    - `web-api-client-id`: The **Application (client) ID** of the web API you registered. It's different from the application ID for the web app.
    - `tenant-name`: The tenant name in which you created your web app. Learn how to [Get your tenant name](tenant-management.md#get-your-tenant-name). If you're using a custom domain, then replace `tenant-name.b2clogin.com` with your custom domain, such as `contoso.com`.
    - `tenant-id`: The tenant ID in which you created your web app. Learn how to [Get your tenant ID](tenant-management.md#get-your-tenant-id).
    - `susi-flow`: The **Sign in and sign up** user flow, such as `b2c_1_susi_node_app`, which you created for while following the steps in the prerequisite.

1. In your `index.js` file, add the following code:
    ```javascript
        require('dotenv').config();
        const express = require("express");
        const passport = require("passport");
        const BearerStrategy = require("passport-azure-ad").BearerStrategy;
        
        
        const options = {
            identityMetadata: `https://${process.env.TENANT_NAME}.b2clogin.com/${process.env.TENANT_NAME}.onmicrosoft.com/${process.env.POLICY_NAME}/${process.env.METADATA_VERSION}/${process.env.METADATA_DISCOVERY}`,
            issuer: process.env.ISSUER,
            policyName: process.env.POLICY_NAME,
            clientID: process.env.CLIENT_ID,
            audience: process.env.CLIENT_ID,
            isB2C: process.env.isB2C,
            validateIssuer: process.env.validateIssuer,
            passReqToCallback: process.env.passReqToCallback,
            loggingLevel: process.env.loggingLevel,
            scope: ['demo.read'] 
          };
        
        //Instantiate the passport Azure AD library with the Azure AD B2C options
          const bearerStrategy = new BearerStrategy(options, (token, done) => {
            // Send user info using the second argument. See more info here: https://www.npmjs.com/package/passport-azure-ad 
            done(null, { }, token);
          });
        
        
        // Use the required libraries
        const app = express();
        
        app.use(passport.initialize());
        
        passport.use(bearerStrategy);
        
        //enable CORS (for testing only -remove in production/deployment)
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        
        /**
         * Red is a public API
         */
        app.get('/red', (req, res) => {
            res.send({color: 'danger'});
        });
        
        /**
         * Green is a private API. 
         * One needs to present a valid Bearer token to access it.
         * Set session:false for non-persistent login session. See details: https://www.npmjs.com/package/passport-azure-ad 
         */
         app.get('/green', passport.authenticate('oauth-bearer', {session: false}), (req, res) => {
            //Log claims, which were validated. 
            console.log('Validated claims: ', req.authInfo);
            //return success after authentication
            res.send({color: 'success'});
        })
        app.listen(process.env.HTTP_PORT, () => {
            console.log('Listening on port ' + process.env.HTTP_PORT);
        });
    ```
    - `options` variable is an object, which contains all the information required when we instantiate the passport Azure AD library, that is, `bearerStrategy`.
    - The `isB2C` `options`' property is required to specify if you're using B2C tenant, and is set to `true`. When `isB2C` is set to `true`, you need to include the `policyName`. 
    - The `scopes` `options` property contains the scopes configured in the web API. These scopes need to have been granted to the web app and are used while acquiring the access token. 
    - The `/red` endpoint is public, and is accessed without presenting an access token.
    - The `/green` endpoint is protected. It first calls the `passport.authenticate()` function, which limits access to requests with a valid access token.  
    
At this point, you've built the *colorsapi*. Next, we update the web app code, such as *webapp1*, which you built by following the steps in the prerequisite. 

## Update the web app to call the web API

1. In your web app, such as *webapp1*, add `api.hbs` file to achieve the following project structure:
    ```
    tutorial-acquire-access-token/
    ├── index.js
    └── package.json
    └── .env
    └── views/
        └── layouts/
            └── main.hbs
        └── signin.hbs
        └── api.hbs
    ```
1. In the `api.hbs` file, add the following code:
    ```html
        <div class="col-md-3" style="margin:auto">
          <div class="card text-center bg-{{color}}">
            <div class="card-body">
        
                  <h5 class="card-title">This's your color</h5>
        
            </div>
          </div>
        </div>
    ```
    This's the page that shows the API you call. If you call the web API's `/red` endpoint, you'll see a red color, otherwise, you'll see a green color. The color is shown using Bootstrap's card `bg-{{color}}` class attribute. We replace the handlebars' `{{color}}` placeholder with `danger` or `success` when we call the red and green APIs respectively. 
1. In the `signin.hbs` file, update the code as shown:

    ```html
        <div class="col-md-3" style="margin:auto">
          <div class="card text-center">
            <div class="card-body">
              {{#if showSignInButton}}
        
              {{else}}
                   <h5 class="card-title">You have signed in</h5>
                  <a type="button" id="Call-api" class="btn btn-success" href="/api" aria-haspopup="true" aria-expanded="false">
                      Now call the GREEN API
                  </a>
              {{/if}}
            </div>
            </div>
          </div>
        </div>
    ``` 
1. In the `main.hbs` file, update the code as shown:

    ```html
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <title>Tutorial | Authenticate users with MSAL for B2C</title>
        
            <!-- adding Bootstrap 4 for UI components  -->
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
                            Sign in to call GREEN API
                        </a>
                        <a type="button" id="SignIn" class="btn btn-warning" href="/api" aria-haspopup="true" aria-expanded="false">
                            Or call the Red API
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
1. In the `index.js` file, update the code as shown:
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
        const axios = require('axios');
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
            webApiScopes: ['https://Contosob2c2233.onmicrosoft.com/colorsapi/demo.read'],
            redApiUri: 'http://localhost:api-server-port/red',
            greenApiUri: 'http://localhost:api-server-port/green'
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
            CALL_API:'call_api'   
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
                //Initiate a Auth Code Flow >> for sign in
                //Pass the api scopes as well so that you received both the IdToken and accessToken
                getAuthCode(process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY,apiConfig.webApiScopes, APP_STATES.LOGIN, res);
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
        
        app.get('/api', async (req, res) => {
            if(!req.session.accessToken){
                //User is not logged in and so they can only call the red API
                try {
                    const response = await axios.get(apiConfig.redApiUri);
                    console.log('API response' + response.data.color); 
                    res.render('api',{color: response.data.color, showSignInButton: true});
                } catch (error) {
                    console.error(error);
                    res.status(500).send(error);
                }         
            }else{
                //Users have the accessToken because they logged in and the accessToke is still in the session
                console.log('\nAccessToken:' + req.session.accessToken);
                let accessToken = req.session.accessToken;
                const options = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                };
        
                try {
                    const response = await axios.get(apiConfig.greenApiUri,options);
                    console.log('API response' + response.data.color); 
                    res.render('api',{color: response.data.color, showSignInButton: false, givenName: req.session.givenName});
                } catch (error) {
                    console.error(error);
                    res.status(500).send(error);
                }
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
        app.listen(process.env.SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port !` + process.env.SERVER_PORT));
    ```   

    We've made the following updates in the code:

    - Import axioms http client, which we use to make http calls.
    - Add `redApiUri` and `greenApiUri` properties in the `apiConfig` object. The properties are the URIs for calling the red and green APIs respectively. Replace `api-server-port` with the port number that your web API runs on, such as 4000. 
    - In the `/redirect` endpoint, we put the access token in a session after we acquire it. 
    - Add `/api` endpoint, where we call the API. If the `accessToken` isn't in the session, we call the red API, otherwise, we call the green API.     
        
1. In your terminal, run `npm install axios` to install axios http client. 


## Test the web API

To test the web API, start both the web API and the web app. Make sure they're running on different port numbers. For example, the web app can run on port 3000, and the web API on port 4000. 

1. Run the following command on each one of them: 

    ```
        node index.js
    ```
1. In your browser, navigate to http://localhost:3000 to access your web app. You should see a page like the one shown below:

    :::image type="content" source="./media/tutorial-call-api-using-access-token/tutorial-call-api-sign-in-page.png" alt-text="Web page for tutorial call api sign in page.":::

### Test the public API
After the web app page completes loading, select **Or call the Red API** button. You should see a page like the one below. 

:::image type="content" source="./media/tutorial-call-api-using-access-token/tutorial-call-red-api.png" alt-text="Web page for call red API.":::

You can also access the red API by typing `http://localhost:4000/red` directly in the browser. You should see the following response in the browser:

```json
    {"color":"danger"}
```

### Test the protected API

You can access the protected API through the web app or by typing the address `http://localhost:4000/green` directly in the browser: 
1. In the browser address bar, type `http://localhost:4000/green`, and hit enter. You should see `Unauthorized` as the response. This's so because no access token has been used in the request. 
1. In the web app:
    1. Select **Sign in to call GREEN API** button. You're prompted to sign in.
    1. Enter your sign in credentials such as email address and password. If you don't have an account, select **Sign up now** to create an account. If you've an account but have forgotten your password, select **Forgot your password?** to recover your password. After you successfully sign in or sign up, you should see the page with sign in status like the one shown below.
        
        :::image type="content" source="./media/tutorial-call-api-using-access-token/call-api-signed-in.png" alt-text="Web page for call API signed in.":::
    1. Select **Now call the GREEN API** button. You should see a page like the one shown below.
    
        :::image type="content" source="./media/tutorial-call-api-using-access-token/call-green-api-response.png" alt-text="Web page call green API.":::
    
        > [!NOTE]
        > If you attempt to call the green API from the web app, and the session's expired, you'll see the red color. 


## Next steps
Learn how to:
- [Enable authentication in your own Android app](enable-authentication-android-app.md)
- [Configure authentication options in an Android app](enable-authentication-android-app-options.md)