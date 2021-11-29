---
title: Tutorial: Sign in and sign out users in a Node.js Express web app
description: Follow this tutorial to learn how to integrates nodejs web app to allow user to sign in, sign out, updates profile, and reset password using Azure AD B2C user flows, and  Microsoft Authentication Library (MSAL) for Node.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 12/1/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# Tutorial: Sign in and sign out users in a Node.js Express web app
In this tutorial, you will build a web app using Azure AD B2C user flows and the [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to allow users to:
- Sign in 
- Sign out
- Update profile
- Reset password  

Follow the steps in this tutorial to:

> [!div class="checklist"]
> * Register the application in the Azure portal
> * Create user flows for the app in Azure portal 
> * Create an Express web app project, which uses [handlebars template engine](https://handlebarsjs.com/) 
> * Install the MSAL library and other necessary node packages  
> * Add code for user sign in, sign out, password reset and password reset
> * Test the app

## Prerequisites
- [Node.js](https://nodejs.org)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor


## Register the web application in Azure portal
Register the web application in Azure portal so that Azure B2Ccan provide authentication service for your application and its users.

First, complete the steps in [Tutorial: Register a web application in Azure Active Directory B2C](tutorial-register-applications.md) to register the web app. 

Use the following settings for your app registration:
- Under **Name**: `WebAppNode` (suggested)
- Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
- Under **Redirect URI**, select **Web**, and then enter `http://localhost:3000/redirect` in the URL text box
- Immediately you generate a **Client secret**, record the values as advised as it's shown only once.

At this point, you have the application (client) ID, and client secret, and you've set the app's redirect URI. 

## Create Azure AD B2C user flows 

Complete the steps in [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow) to create a users flow. Repeat the steps to create 3 separate user flows as follows: 
- A combined **Sign up and Sign up** user flow, such as `susi_node_app`. This user flow also supports **Forgot your password** experience
- **Profile editing** user flow such as `edit_profile_node_app`.
- **Password reset** user flow such as `reset_password_node_app`.

## Create the node project

Create a folder to host your node application, such as  `tutorial-login-logout-msal`.

1. In your terminal, change directory into your node app folder, such as `cd tutorial-login-logout-msal`, and run `npm init -y`. This command creates a default package.json file for your Node.js project.
2. In your terminal, run `npm install express`. This command installs the Express framework.
3. Create additional folders and files to achieve the following project structure:

```
tutorial-login-logout-msal/
├── index.js
└── package.json
└── .env
└── views/
    └── layouts/
        └── main.hbs
    └── signin.hbs
```
The `views` folder contains handlebars files for the app's UI. 
## Install the dependencies 

In your terminal, install the `dotenv`, `express-handlebars`, `express-session`,and `@azure/msal-node` packages by running the following commands:

```
npm install dotenv
npm install express-handlebars
npm install express-session
npm install @azure/msal-node
```
## Build app UI components 

1. In the `main.hbs` file, add the following code:

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
                <a type="button" id="SignIn" class="btn btn-secondary" href="/signin" aria-haspopup="true" aria-expanded="false">
                    Sign in
                </a>
            </div>
        {{else}}
              <div class="ml-auto">
                  <a type="button" id="EditProfile" class="btn btn-warning" href="/profile" aria-haspopup="true" aria-expanded="false">
                      Edit profile
                  </a>
                  <a type="button" id="PasswordReset" class="btn btn-warning" href="/password" aria-haspopup="true" aria-expanded="false">
                      Reset password
                  </a>
              </div>

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

The `main.hbs` file is in the `layout` folder and it should contain any HTML code that is required throughout your application. Any UI that changes from page to page, such as `signin.hbs`, is placed in the placeholder shown as ` {{{body}}}`. 

The `main.hbs` file implements UI built with the Bootstrap 5 CSS Framework. The end user sees the **Edit password**, **Reset password**, and **Sign out** UI components when signed in. The end user sees the **Sign in** when signed out. This behavior is tracked by the `showSignInButton` boolean variable, which is sent by the app server. 

2. In the `signin.hbs` file, add the following code:

```html
<div class="col-md-3" style="margin:auto">
  <div class="card text-center">
    <div class="card-body">
      {{#if showSignInButton}}
          <h5 class="card-title">Please sign-in to acquire an ID token</h5>
      {{else}}
           <h5 class="card-title">You have signed in</h5>
      {{/if}}
    </div>

    <div class="card-body">
      {{#if message}}
          <h5 class="card-title text-danger">{{message}}</h5>
      {{/if}}
    </div>
  </div>
</div>
```

## Configure web server and MSAL client

1. In the `.env` file, add the following code, which entails server http port,  app registration details, and user flow/policy details: 

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
#B2C password reset user flow/policy authority
RESET_PASSWORD_POLICY_AUTHORITY=https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/reset-password-flow
#B2C edit profile user flow/policy authority
EDIT_PROFILE_POLICY_AUTHORITY=https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/edit-profile-flow
#B2C authority domain
AUTHORITY_DOMAIN=https://tenant-name.b2clogin.com
#client redirect url
APP_REDIRECT_URI=http://localhost:server-port/redirect
#Logout endpoint 
LOGOUT_ENDPOINT=https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/susi-flow/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:server-port
```

Modify the values in the `.env` files as follows:
- `server-port`: The HTTP port used to run your web app such as 3000.
- `client-id`: The **Application (client) ID** of the application you registered.
- `session-secret`: A random string to be used as your express session secret. 
- `client-secret`: Replace this value with the client secret you created earlier.
- `tenant-name`: Replace this with the tenant name in which you created your web app. Learn how to [Get your tenant name](tenant-management.md#get-your-tenant-name).
- `susi-flow`: The **Sign up and Sign up** user flow such as `b2c_1_susi_node_app`.
- `reset-password-flow`: The **Password reset** user flow such as `b2c_1_reset_password_node_app`. 
- `edit-profile-flow`: The **Profile editing** user flow such as `b2c_1_edit_profile_node_app`.

>[!WARNING]
> Any plaintext secret in source code poses an increased security risk. This article uses a plaintext client secret for simplicity only. Use [certificate credentials]() instead of client secrets in your confidential client applications, especially those apps you intend to deploy to production.

2. In your `index.js` file, add the following code to use your app dependencies: 

```javascript
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const {engine}  = require('express-handlebars');
const msal = require('@azure/msal-node');
```
3. In your `index.js` file, add the following code:

```javascript
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

// Initialize MSAL Node
const confidentialClientApplication = new msal.ConfidentialClientApplication(confidentialClientConfig);
```
`confidentialClientConfig` is the MSAL configuration object, which is used to create the confidential client application i.e. `confidentialClientApplication`. 

4. To add mode global variables in the `index.js` file, add the following code:

```javascript
/**
 * The MSAL.js library allows you to pass your custom state as state parameter in the Request object
 * By default, MSAL.js passes a randomly generated unique state parameter value in the authentication requests.
 * The state parameter can also be used to encode information of the app's state before redirect. 
 * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
 * For more information, visit: https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request
 * In this scenario, the states also serve to show the action that was requested of B2C since only one redirect URL is available. 
 */
const APP_STATES = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    PASSWORD_RESET: 'password_reset',
    EDIT_PROFILE : 'update_profile'
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
```
- `APP_STATES`: Used to differentiate between responses received from Azure AD B2C by tagging requests. There is only one redirect URI for any number of requests sent to Azure AD B2C.  
- `authCodeRequest`: The configuration object used to retrieve authorization code. 
- `tokenRequest`: The configuration object used to acquire a token by authorization code.
- `sessionConfig`: The configuration object for express session. 

5. To set view template engine and express session configuration, add the following code in the `index.js` file: 

```javascript
//Create an express instance
const app = express();

//Set handlebars as your view engine
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set("views", "./views");

app.use(session(sessionConfig));
```
## App endpoints

Before you add the app endpoints, add the logic, which retrieves the authorization code URL. This is the first leg of authorization code grant flow. In the `index.js` file add the following code:

```javascript
/**
 * This method is used to generate an auth code request
 * @param {string} authority: the authority to request the auth code from 
 * @param {array} scopes: scopes to request the auth code for 
 * @param {string} state: state of the application
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
```
The `authCodeRequest` object has properties `redirectUri`, `authority`, `scopes` and `state`, and is passed to `getAuthCodeUrl` method as a parameter. 

In the `index.js` file, add the following code:

```javascript
    app.get('/', (req, res) => {
        res.render('signin', { showSignInButton: true });
    });
    app.get('/signin',(req, res)=>{
            //Initiate a Auth Code Flow >> for sign in
            //no scopes passed. openid, profile and offline_access will be used by default.
            getAuthCode(process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY, [], APP_STATES.LOGIN, res);
    });
    
    /**
     * Change password end point
    */
    app.get('/password',(req, res)=>{
        getAuthCode(process.env.RESET_PASSWORD_POLICY_AUTHORITY, [], APP_STATES.PASSWORD_RESET, res); 
    });
    
    /**
     * Edit profile end point
    */
    app.get('/profile',(req, res)=>{
        getAuthCode(process.env.EDIT_PROFILE_POLICY_AUTHORITY, [], APP_STATES.EDIT_PROFILE, res); 
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
    
    app.get('/redirect',(req, res)=>{
        
        //determine the reason why the request was sent by checking the state
        if (req.query.state === APP_STATES.LOGIN) {
            //prepare the request for authentication
            //tokenRequest.scopes = ['openid','profile'];
            tokenRequest.code = req.query.code;
            confidentialClientApplication.acquireTokenByCode(tokenRequest).then((response)=>{
            //req.session.userAndToken = {userAccount: response.account};
            req.session.sessionParams = {user: response.account, idToken: response.idToken};
            console.log("\nAuthToken: \n" + JSON.stringify(response));
            res.render('signin',{showSignInButton: false, givenName: response.account.idTokenClaims.given_name});
            }).catch((error)=>{
                console.log("\nErrorAtLogin: \n" + error);
            });
        }else if (req.query.state === APP_STATES.PASSWORD_RESET) {
            //If the query string has a error param
            if (req.query.error) {
                //and if the error_description contains AADB2C90091 error code
                //Means user selected the Cancel button on the password reset experience 
                if (JSON.stringify(req.query.error_description).includes('AADB2C90091')) {
                    //Send the user home with some message
                    //But always check if your session still exists
                    res.render('signin', {showSignInButton: false, givenName: req.session.sessionParams.user.idTokenClaims.given_name, message: 'User has cancelled the operation'});
                }
            }else{
                res.render('signin', {showSignInButton: false, givenName: req.session.sessionParams.user.idTokenClaims.given_name});
            }        
            
        }else if (req.query.state === APP_STATES.EDIT_PROFILE){
        
            tokenRequest.scopes = [];
            tokenRequest.code = req.query.code;
            
            //Request token with claims, including the name that was updated.
            confidentialClientApplication.acquireTokenByCode(tokenRequest).then((response)=>{
                req.session.sessionParams = {user: response.account, idToken: response.idToken};
                console.log("\AuthToken: \n" + JSON.stringify(response));
                res.render('signin',{showSignInButton: false, givenName: response.account.idTokenClaims.given_name});
            }).catch((error)=>{
                //Handle error
            });
        }else{
            res.status(500).send('We do not recognize this response!');
        }
    
    });
```

The app endpoints are explained below:
- `/`:
    - Used to enter the web app.
    - It renders the `signin` page.
- `/signin`:
    - Used when the end user signs in.
    - Calls `getAuthCode` method and passes the `authority` for **Sign in and sign up** user flow/policy to it, `APP_STATES.LOGIN` and empty `scopes` array.  
    - If necessary, it causes the end user to be challenged to enter their logins or if the user does not have an account, they to sign up.
    - A final response resulting from this endpoint includes an authorization code from B2C posted back to the `/redirect` endpoint. 
- `/password`:
    - Used when a user resets password.
    - Calls `getAuthCode` method and passes the `authority` for **Password reset** user flow/policy to it, `APP_STATES.PASSWORD_RESET` and empty `scopes` array.
    - It causes the end user to to be challenged to change their password or they can cancel the operation.
    - A final response resulting from this endpoint includes an authorization code from B2C posted back to the `/redirect` endpoint or if the end user canceled the operation, an error is posted back.  