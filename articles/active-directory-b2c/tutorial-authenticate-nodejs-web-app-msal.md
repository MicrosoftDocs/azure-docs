---
title: Tutorial - Sign in and sign out users with Azure AD B2C in a Node.js web app using
description: Follow this tutorial to learn how to integrate nodejs web app, which allows users to sign in, sign out, update profile, and reset password using Azure AD B2C user flows, and  Microsoft Authentication Library (MSAL) for Node.
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

# Tutorial: Sign in and sign out users with Azure AD B2C in a Node.js web app
In this tutorial, you'll build a web app using Azure Active Directory B2C (Azure AD B2C) user flows and the [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) for users to use their local accounts to:
- Sign in 
- Sign out
- Update a profile
- Reset a password  

You'll optionally allow users to authenticate by using their Google account. 

Follow the steps in this tutorial to:

> [!div class="checklist"]
> * Register the application in the Azure portal.
> * Create user flows for the app in the Azure portal. 
> * Create an Express web app project that uses the [Handlebars template engine](https://handlebarsjs.com/). 
> * Install the MSAL library and other necessary Node packages.  
> * Add code for user sign-in, sign-out, profile editing, and password reset.
> * Test the app.

## Prerequisites
- [Node.js](https://nodejs.org)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor


## Register the web application in the Azure portal
Register the web application in the Azure portal so that Azure Active Directory B2C (Azure AD B2C) can provide an authentication service for your application and its users.

First, complete the steps in [Tutorial: Register a web application in Azure Active Directory B2C](tutorial-register-applications.md) to register the web app. 

Use the following settings for your app registration:
- For **Name**, enter **WebAppNode** (suggested).
- For **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
- For **Redirect URI**, select **Web**, and then enter `http://localhost:3000/redirect` in the URL text box.
- Immediately, you generate a **Client secret** value. Record the value as advised, because it appears only once.

At this point, you have the application (client) ID and client secret. You've also set the app's redirect URI. 

## Create Azure AD B2C user flows 

Follow the steps in [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow) to create a user flow. Repeat the steps to create three separate user flows as follows: 
- A combined **Sign in and sign up** user flow, such as `susi_node_app`. This user flow also supports the **Forgot your password** experience.
- A **Profile editing** user flow, such as `edit_profile_node_app`.
- A **Password reset** user flow, such as `reset_password_node_app`.


Azure AD B2C prepends `B2C_1_` to the user flow name. For example, `susi_node_app` becomes `B2C_1_susi_node_app`.

## Create the node project

Create a folder to host your node application, such as  `tutorial-login-logout-msal`.

1. In your terminal, change directory into your Node app folder, such as `cd tutorial-login-logout-msal`, and run `npm init -y`. This command creates a default `package.json` file for your Node.js project.
2. In your terminal, run `npm install express`. This command installs the Express framework.
3. Create more folders and files to achieve the following project structure:

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

The `views` folder contains Handlebars files for the app's UI. 

## Install the dependencies 

In your terminal, install the `dotenv`, `express-handlebars`, `express-session`, and `@azure/msal-node` packages by running the following commands:

```
npm install dotenv
npm install express-handlebars
npm install express-session
npm install @azure/msal-node
```

## Build app UI components 

In the `main.hbs` file, add the following code:

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

The `main.hbs` file is in the `layout` folder. It should contain any HTML code that's required throughout your application. Any UI that changes from page to page, such as `signin.hbs`, is placed in the placeholder shown as `{{{body}}}`. 

The `main.hbs` file implements UI built with the Bootstrap 5 CSS framework. The user sees the **Edit password**, **Reset password**, and **Sign out** UI components when signed in. The user sees **Sign in** when signed out. This behavior is tracked by the `showSignInButton` Boolean variable, which the app server sends. 

In the `signin.hbs` file, add the following code:

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

## Configure the web server and MSAL client

In the `.env` file, add the following code. This code includes the server HTTP port, app registration details, and user flow/policy details. 

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
- `server-port`: The HTTP port that's used to run your web app, such as 3000.
- `client-id`: The **Application (client) ID** of the application that you registered.
- `session-secret`: A random string to be used as your Express session secret. 
- `client-secret`: The client secret that you created earlier.
- `tenant-name`: The tenant name in which you created your web app. Learn how to [Get your tenant name](tenant-management.md#get-your-tenant-name). If you're using a custom domain, replace `tenant-name.b2clogin.com` with your domain, such as `contoso.com`.
- `susi-flow`: The **Sign in and sign up** user flow, such as `b2c_1_susi_node_app`.
- `reset-password-flow`: The **Password reset** user flow, such as `b2c_1_reset_password_node_app`. 
- `edit-profile-flow`: The **Profile editing** user flow, such as `b2c_1_edit_profile_node_app`.


>[!WARNING]
> Any plaintext secret in source code poses an increased security risk. This tutorial uses a plaintext client secret for simplicity. Use a certificate credential instead of client secrets in your confidential client applications, especially for the apps that you intend to deploy to production.

In your `index.js` file, add the following code to use your app dependencies: 

```javascript
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const {engine}  = require('express-handlebars');
const msal = require('@azure/msal-node');
```

In your `index.js` file, add the following code:

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
`confidentialClientConfig` is the MSAL configuration object that's used to create the confidential client application (that is, `confidentialClientApplication`). 

To add mode global variables in the `index.js` file, add the following code:

```javascript
/**
 * The MSAL.js library allows you to pass your custom state as a state parameter in the Request object.
 * By default, MSAL.js passes a randomly generated unique state parameter value in the authentication requests.
 * The state parameter can also be used to encode information of the app's state before redirect. 
 * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
 * For more information, visit: https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request.
 * In this scenario, the states also serve to show the action that was requested of Azure AD B2C, because only one redirect URL is available. 
 */
const APP_STATES = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    PASSWORD_RESET: 'password_reset',
    EDIT_PROFILE : 'update_profile'
}
/** 
 * Request Configuration
 * We manipulate the two request objects below 
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

- `APP_STATES`: Used to differentiate between responses received from Azure AD B2C by tagging requests. There's only one redirect URI for any number of requests sent to Azure AD B2C.  
- `authCodeRequest`: The configuration object that's used to retrieve the authorization code. 
- `tokenRequest`: The configuration object that's used to acquire a token by authorization code.
- `sessionConfig`: The configuration object for the Express session. 

To set the view template engine and Express session configuration, add the following code in the `index.js` file: 

```javascript
//Create an Express instance
const app = express();

//Set Handlebars as your view engine
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set("views", "./views");

app.use(session(sessionConfig));
```

## Add app endpoints

Before you add the app endpoints, add the logic that retrieves the authorization code URL. This is the first leg of authorization code grant flow. In the `index.js` file, add the following code:

```javascript
/**
 * This method is used to generate an auth code request
 * @param {string} authority: the authority to request the auth code from 
 * @param {array} scopes: scopes to request the auth code for 
 * @param {string} state: state of the application
 * @param {Object} res: Express middleware response object
 */
 const getAuthCode = (authority, scopes, state, res) => {

    // Prepare the request
    console.log("Fetching Authorization code")
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    authCodeRequest.state = state;

    //Each time you fetch the authorization code, update the authority in the tokenRequest configuration
    tokenRequest.authority = authority;

    // Request an authorization code to exchange for a token
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

The `authCodeRequest` object has the properties `redirectUri`, `authority`, `scopes`, and `state`. The object is passed to the `getAuthCodeUrl` method as a parameter. 

In the `index.js` file, add the following code:

```javascript
    app.get('/', (req, res) => {
        res.render('signin', { showSignInButton: true });
    });
    app.get('/signin',(req, res)=>{
            //Initiate an auth code flow >> for sign-in.
            //No scopes passed. openid, profile, and offline_access will be used by default.
            getAuthCode(process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY, [], APP_STATES.LOGIN, res);
    });
    
    /**
     * Change password endpoint
    */
    app.get('/password',(req, res)=>{
        getAuthCode(process.env.RESET_PASSWORD_POLICY_AUTHORITY, [], APP_STATES.PASSWORD_RESET, res); 
    });
    
    /**
     * Edit profile endpoint
    */
    app.get('/profile',(req, res)=>{
        getAuthCode(process.env.EDIT_PROFILE_POLICY_AUTHORITY, [], APP_STATES.EDIT_PROFILE, res); 
    });
    
    /**
     * Sign-out endpoint
    */
    app.get('/signout',async (req, res)=>{    
        logoutUri = process.env.LOGOUT_ENDPOINT;
        req.session.destroy(() => {
            res.redirect(logoutUri);
        });
    });
    
    app.get('/redirect',(req, res)=>{
        
        //Determine the reason why the request was sent by checking the state
        if (req.query.state === APP_STATES.LOGIN) {
            //Prepare the request for authentication
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
            //If the query string has an error parameter
            if (req.query.error) {
                //and if the error_description contains the AADB2C90091 error code,
                //that means the user selected the Cancel button on the password reset experience 
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

The app endpoints are:
- `/`:
    - It's used to enter the web app.
    - It renders the `signin` page.
- `/signin`:
    - It's used when the user signs in.
    - It calls the `getAuthCode()` method and passes `authority` for the **Sign in and sign up** user flow/policy, `APP_STATES.LOGIN`, and an empty `scopes` array to it.  
    - If necessary, it causes the user to be challenged to enter their credentials. If the user doesn't have an account, it prompts the user to sign up.
    - The final response that results from this endpoint includes an authorization code from Azure AD B2C posted back to the `/redirect` endpoint. 
- `/password`:
    - It's used when a user resets a password.
    - It calls the `getAuthCode()` method and passes `authority` for the **Password reset** user flow/policy, `APP_STATES.PASSWORD_RESET`, and an empty `scopes` array to it.
    - It causes the user to change their password by using the password reset experience, or they can cancel the operation.
    - The final response that results from this endpoint includes an authorization code from Azure AD B2C posted back to the `/redirect` endpoint. If the user cancels the operation, an error is posted back. 
- `/profile`: 
    - It's used when a user updates their profile.
    - It calls the `getAuthCode()` method and passes `authority` for the **Profile editing** user flow/policy, `APP_STATES.EDIT_PROFILE`, and an empty `scopes` array to it.
    - It causes the user to update their profile by using the profile-editing experience. 
    - The final response that results from this endpoint includes an authorization code from Azure AD B2C posted back to the `/redirect` endpoint. 
- `/signout`:
    - It's used when a user signs out.
    - The web app session is cleared, and an HTTP call is made to the Azure AD B2C logout endpoint. 
- `/redirect`:
    - It is the endpoint set as Redirect URI for the web app in Azure portal.
    - It uses the `state` query parameter in the request from Azure AD B2C to differentiate between requests that were made from the web app. It handles all redirects from Azure AD B2C, except for sign-out.
    - If the app state is `APP_STATES.LOGIN`, the acquired authorization code is used to retrieve a token through the `acquireTokenByCode()` method. This token includes `idToken` and `idTokenClaims`, which are used for user identification.
    - If the app state is `APP_STATES.PASSWORD_RESET`, it handles any error, such as `user cancelled the operation` identified by error code `AADB2C90091`. Otherwise, it decides the next user experience. 
    - If the app state is `APP_STATES.EDIT_PROFILE`, it uses the authorization code to acquire a token. The token contains `idTokenClaims`, which includes the new changes. 

## Start the Node server 
To start the Node server, add the following code in the `index.js` file:

```javascript
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Msal Node Auth Code Sample app listening on port !` + process.env.SERVER_PORT);
});
```

## Test your web app
1. In your terminal, run the following code to start the Node.js web server:
 
   ```
   node index.js
   ``` 

2. In your browser, go to `http://localhost:3000` or `http://localhost:port`, where `port` is the port that your web server is listening on. You should see the page with a **Sign in** button.

   :::image type="content" source="./media/tutorial-authenticate-nodejs-webapp-msal/tutorial-login-page.png" alt-text="Screenshot that shows a Node web app sign-in page.":::

### Test sign-in
1. After the page with the **Sign in** button finishes loading, select **Sign in**. You're prompted to sign in.
1. Enter your sign-in credentials, such as email address and password. If you don't have an account, select **Sign up now** to create an account. If you have an account but have forgotten your password, select **Forgot your password?** to recover your password. After you successfully sign in or sign up, you should see the following page that shows sign-in status.

   :::image type="content" source="./media/tutorial-authenticate-nodejs-webapp-msal/tutorial-dashboard-page.png" alt-text="Screenshot that shows Node web app sign-in status.":::

### Test profile editing
1. After you sign in, select **Edit profile**. 
1. Enter new changes as required, and then select **Continue**. You should see the page with sign-in status showing the new changes, such as **Given Name**. 

### Test password reset
1. After you sign in, select **Reset password**. 
1. In the next dialog that appears, you can cancel the operation by selecting **Cancel**. Alternatively, enter your email address, and then select **Send verification code**. Azure AD B2C sends a verification code to your email account. Copy the verification code from your email, enter the code in the Azure AD B2C password reset dialog, and then select **Verify code**.
1. Select **Continue**.
1. Enter your new password, confirm it, and then select **Continue**. You should see the page that shows sign-in status.

### Test sign-out 
After you sign in, select **Sign out**. You should see the page that has a **Sign in** button. 

## Authenticate users with a Google account (optional)
You can allow users to sign in to the Node web app without adding any code to your app.

Complete the steps in [Set up sign-up and sign-in with a Google account using Azure Active Directory B2C](identity-provider-google.md#create-a-google-application). Be sure to [add a Google identity provider](identity-provider-google.md#add-google-identity-provider-to-a-user-flow) to your **Sign in and sign up** user flow, such as `B2C_1_susi_node_app`.

Test the Google identity provider:
1. After you sign out, select **Sign in** again. You should see a **Sign in and sign up** experience with a Google sign-in option under **Sign in with your social account**.
1. Select **Google**, and then select the Google account that you want to sign in with. 
1. Complete your profile by entering required details, such as **Given Name**, and then select **Continue**. You should see the page that shows sign-in status.

When you use a social identity provider such as Google, that provider manages the user's identity. The following considerations apply:
- You can't reset your password the same way as you can with a local account.  
- When you sign out the user in your web app, you don't also sign out the user from the identity provider.  


## Next steps
- Learn how to [Acquire an access token for calling a web API in Azure AD B2C](tutorial-acquire-access-token.md).

