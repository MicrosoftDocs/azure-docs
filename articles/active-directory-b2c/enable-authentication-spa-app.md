---
title: Enable authentication in a SPA application by using Azure Active Directory B2C building blocks
description:  This article discusses the building blocks of Azure Active Directory B2C for signing in and signing up users in a SPA application.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/24/2023
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication in your own single-page application by using Azure AD B2C

This article shows you how to add Azure Active Directory B2C (Azure AD B2C) authentication to your own single-page application (SPA). Learn how create a SPA application by using the [Microsoft Authentication Library for JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js). 

Use this article with [Configure authentication in a sample SPA application](./configure-authentication-sample-spa-app.md), substituting the sample SPA app with your own SPA app.

## Overview

This article uses Node.js and [Express](https://expressjs.com/) to create a basic Node.js web app. Express is a minimal and flexible Node.js web app framework that provides a set of features for web and mobile applications.

The [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js) authentication library is a Microsoft-provided library that simplifies adding authentication and authorization support to SPA apps.

> [!TIP]
> The entire MSAL.js code runs on the client side. You can substitute the Node.js and Express server side code with other solutions, such as .NET Core, Java, and Hypertext Preprocessor (PHP) scripting languages.

## Prerequisites

To review the prerequisites and integration instructions, see [Configure authentication in a sample SPA application](configure-authentication-sample-spa-app.md).

## Step 1: Create an SPA app project

You can use an existing SPA app project or create new one. To create a new project, do the following:

1. Open a command shell, and create a new directory (for example, *myApp*). This directory will contain your app code, user interface, and configuration files.

1. Enter the directory you created.

1. Use the `npm init` command to create a `package.json` file for your app. This command prompts you for information about your app (for example, the name and version of your app, and the name of the initial entry point, the *index.js* file). Run the following command, and accept the default values:

```
npm init
```

## Step 2: Install the dependencies

To install the Express package, in your command shell, run the following command:

```
npm install express
```

To locate the app's static files, the server-side code uses the [Path](https://www.npmjs.com/package/path) package. 

To install the Path package, in your command shell, run the following command:

```
npm install path
```

## Step 3: Configure your web server

In your *myApp* folder, create a file named *index.js*, which contains the following code:

```javascript
// Initialize express
const express = require('express');
const app = express();

// The port to listen to incoming HTTP requests
const port = 6420;

// Initialize path
const path = require('path');

// Set the front-end folder to serve public assets.
app.use(express.static('App'));

// Set up a route for the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Start the server, and listen for HTTP requests
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
```

## Step 4: Create the SPA user interface

Add the SPA app `index.html` file. This file implements a user interface that's built with a Bootstrap framework, and it imports script files for configuration, authentication, and web API calls.

The resources referenced by the *index.html* file are detailed in the following table: 

|Reference |Definition|
|---|---|
|MSAL.js library| MSAL.js authentication JavaScript library [CDN path](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/cdn-usage.md).|
|[Bootstrap stylesheet](https://getbootstrap.com/) | A free front-end framework for faster and easier web development. The framework includes HTML-based and CSS-based design templates. |
|[`policies.js`](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/blob/main/App/policies.js) | Contains the Azure AD B2C custom policies and user flows. |
|[`authConfig.js`](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/blob/main/App/authConfig.js) | Contains authentication configuration parameters.|
|[`authRedirect.js`](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/blob/main/App/authRedirect.js) | Contains the authentication logic. |
|[`apiConfig.js`](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/blob/main/App/apiConfig.js) | Contains web API scopes and the API endpoint location. |
|[`api.js`](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/blob/main/App/api.js) | Defines the method to use to call your API and handle its response.|
|[`ui.js`](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/blob/main/App/ui.js) | Controls the UI elements. |
| | |

To render the SPA index file, in the *myApp* folder, create a file named *index.html*, which contains the following HTML snippet:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>My Azure AD B2C test app</title>
    </head>
    <body>
        <h2>My Azure AD B2C test app</h2>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
        <button type="button" id="signIn" class="btn btn-secondary" onclick="signIn()">Sign-in</button>
        <button type="button" id="signOut" class="btn btn-success d-none" onclick="signOut()">Sign-out</button>
        <h5 id="welcome-div" class="card-header text-center d-none"></h5>
        <br />
        <!-- Content -->
        <div class="card">
            <div class="card-body text-center">
                <pre id="response" class="card-text"></pre>
                <button type="button" id="callApiButton" class="btn btn-primary d-none" onclick="passTokenToApi()">Call API</button>
            </div>
        </div>
        <script src="https://alcdn.msauth.net/browser/2.14.2/js/msal-browser.min.js" integrity="sha384-ggh+EF1aSqm+Y4yvv2n17KpurNcZTeYtUZUvhPziElsstmIEubyEB6AIVpKLuZgr" crossorigin="anonymous"></script>

        <!-- Importing app scripts (load order is important) -->
        <script type="text/javascript" src="./apiConfig.js"></script>
        <script type="text/javascript" src="./policies.js"></script>
        <script type="text/javascript" src="./authConfig.js"></script>
        <script type="text/javascript" src="./ui.js"></script>

        <!-- <script type="text/javascript" src="./authRedirect.js"></script>   -->
        <!-- uncomment the above line and comment the line below if you would like to use the redirect flow -->
        <script type="text/javascript" src="./authRedirect.js"></script>
        <script type="text/javascript" src="./api.js"></script>
    </body>
</html>
 ```

## Step 5: Configure the authentication library

Configure how the MSAL.js library integrates with Azure AD B2C. The MSAL.js library uses a common configuration object to connect to your Azure AD B2C tenant's authentication endpoints.

To configure the authentication library, do the following:

1. In the *myApp* folder, create a new folder called *App*. 
1. Inside the *App* folder, create a new file named *authConfig.js*.
1. Add the following JavaScript code to the *authConfig.js* file:

    ```javascript
    const msalConfig = {
        auth: {
        clientId: "<Application-ID>", 
        authority: b2cPolicies.authorities.signUpSignIn.authority, 
        knownAuthorities: [b2cPolicies.authorityDomain], 
        redirectUri: "http://localhost:6420",
        },
        cache: {
        cacheLocation: "localStorage", .
        storeAuthStateInCookie: false, 
        }
    };

    const loginRequest = {
    scopes: ["openid", ...apiConfig.b2cScopes],
    };

    const tokenRequest = {
    scopes: [...apiConfig.b2cScopes],
    forceRefresh: false
    };
    ```

1. Replace `<Application-ID>` with your app registration application ID. For more information, see [Configure authentication in a sample SPA application](./configure-authentication-sample-spa-app.md#step-23-register-the-spa).

> [!TIP]
> For more MSAL object configuration options, see the [Authentication options](./enable-authentication-spa-app-options.md) article.

## Step 6: Specify your Azure AD B2C user flows

Create the *policies.js* file, which provides information about your Azure AD B2C environment. The MSAL.js library uses this information to create authentication requests to Azure AD B2C.

To specify your Azure AD B2C user flows, do the following:

1. Inside the *App* folder, create a new file named *policies.js*.
1. Add the following code to the *policies.js* file:

    ```javascript
    const b2cPolicies = {
        names: {
            signUpSignIn: "B2C_1_SUSI",
            editProfile: "B2C_1_EditProfile"
        },
        authorities: {
            signUpSignIn: {
                authority: "https://contoso.b2clogin.com/contoso.onmicrosoft.com/Your-B2C-SignInOrSignUp-Policy-Id",
            },
            editProfile: {
                authority: "https://contoso.b2clogin.com/contoso.onmicrosoft.com/Your-B2C-EditProfile-Policy-Id"
            }
        },
        authorityDomain: "contoso.b2clogin.com"
    }
    ```

1. Replace `B2C_1_SUSI` with your sign-in Azure AD B2C Policy name.
1. Replace `B2C_1_EditProfile` with your edit profile Azure AD B2C policy name.
1. Replace all instances of `contoso` with your [Azure AD B2C tenant name](./ tenant-management-read-tenant-name.md#get-your-tenant-name).

## Step 7: Use the MSAL to sign in the user

In this step, implement the methods to initialize the sign-in flow, API access token acquisition, and the sign-out methods. 

For more information, see the [MSAL PublicClientApplication class reference](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_browser.publicclientapplication.html), and [Use the Microsoft Authentication Library (MSAL) to sign in the user](../active-directory/develop/tutorial-v2-javascript-spa.md#use-the-msal-to-sign-in-the-user) articles.

To sign in the user, do the following:

1. Inside the *App* folder, create a new file named *authRedirect.js*.
1. In your *authRedirect.js*, copy and paste the following code:

    ```javascript
    // Create the main myMSALObj instance
    // configuration parameters are located at authConfig.js
    const myMSALObj = new msal.PublicClientApplication(msalConfig);

    let accountId = "";
    let idTokenObject = "";
    let accessToken = null;

    myMSALObj.handleRedirectPromise()
        .then(response => {
            if (response) {
                /**
                 * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
                 * from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy policies may use "acr" instead of "tfp").
                 * To learn more about B2C tokens, visit https://learn.microsoft.com/azure/active-directory-b2c/tokens-overview
                 */
                if (response.idTokenClaims['tfp'].toUpperCase() === b2cPolicies.names.signUpSignIn.toUpperCase()) {
                    handleResponse(response);
                }
            }
        })
        .catch(error => {
            console.log(error);
        });


    function setAccount(account) {
        accountId = account.homeAccountId;
        idTokenObject = account.idTokenClaims;
        myClaims= JSON.stringify(idTokenObject);
        welcomeUser(myClaims);
    }

    function selectAccount() {

        /**
         * See here for more information on account retrieval: 
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
         */

        const currentAccounts = myMSALObj.getAllAccounts();

        if (currentAccounts.length < 1) {
            return;
        } else if (currentAccounts.length > 1) {
        
            /**
             * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
             * is cached as a new account, which results in more than one account in the cache. Here we make
             * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow, 
             * as this is the default flow the user initially signed-in with.
             */
            const accounts = currentAccounts.filter(account =>
                account.homeAccountId.toUpperCase().includes(b2cPolicies.names.signUpSignIn.toUpperCase())
                &&
                account.idTokenClaims.iss.toUpperCase().includes(b2cPolicies.authorityDomain.toUpperCase())
                &&
                account.idTokenClaims.aud === msalConfig.auth.clientId 
                );

            if (accounts.length > 1) {
                // localAccountId identifies the entity for which the token asserts information.
                if (accounts.every(account => account.localAccountId === accounts[0].localAccountId)) {
                    // All accounts belong to the same user
                    setAccount(accounts[0]);
                } else {
                    // Multiple users detected. Logout all to be safe.
                    signOut();
                };
            } else if (accounts.length === 1) {
                setAccount(accounts[0]);
            }

        } else if (currentAccounts.length === 1) {
            setAccount(currentAccounts[0]);
        }
    }

    // in case of page refresh
    selectAccount();

    async function handleResponse(response) {

        if (response !== null) {
            setAccount(response.account);
        } else {
            selectAccount();
        }
    }

    function signIn() {
        myMSALObj.loginRedirect(loginRequest);
    }

    function signOut() {
        const logoutRequest = {
            postLogoutRedirectUri: msalConfig.auth.redirectUri,
        };

        myMSALObj.logoutRedirect(logoutRequest);
    }

    function getTokenRedirect(request) {
        request.account = myMSALObj.getAccountByHomeId(accountId); 

        return myMSALObj.acquireTokenSilent(request)
            .then((response) => {
                // In case the response from B2C server has an empty accessToken field
                // throw an error to initiate token acquisition
                if (!response.accessToken || response.accessToken === "") {
                    throw new msal.InteractionRequiredAuthError;
                } else {
                    console.log("access_token acquired at: " + new Date().toString());
                    accessToken = response.accessToken;
                    passTokenToApi();
                }
            }).catch(error => {
                console.log("Silent token acquisition fails. Acquiring token using popup. \n", error);
                if (error instanceof msal.InteractionRequiredAuthError) {
                    // fallback to interaction when silent call fails
                    return myMSALObj.acquireTokenRedirect(request);
                } else {
                    console.log(error);   
                }
        });
    }
    
    // Acquires and access token and then passes it to the API call
    function passTokenToApi() {
        if (!accessToken) {
            getTokenRedirect(tokenRequest);
        } else {
            try {
                callApi(apiConfig.webApi, accessToken);
            } catch(error) {
                console.log(error); 
            }
        }
    }

    function editProfile() {


        const editProfileRequest = b2cPolicies.authorities.editProfile;
        editProfileRequest.loginHint = myMSALObj.getAccountByHomeId(accountId).username;

        myMSALObj.loginRedirect(editProfileRequest);
    }
    ```

## Step 8: Configure the web API location and scope

To allow your SPA app to call a web API, provide the web API endpoint location and the [scopes](./configure-authentication-sample-spa-app.md#app-registration-overview) to use to authorize access to the web API.

To configure the web API location and scopes, do the following:

1. Inside the *App* folder, create a new file named *apiConfig.js*.
1. In your *apiConfig.js*, copy and paste the following code:

    ```javascript
    // The current application coordinates were pre-registered in a B2C tenant.
    const apiConfig = {
        b2cScopes: ["https://contoso.onmicrosoft.com/tasks/tasks.read"],
        webApi: "https://mydomain.azurewebsites.net/tasks"
    };
    ```

1. Replace `contoso` with your tenant name. The required scope name can be found as described in the [Configure scopes](./configure-authentication-sample-spa-app.md#step-22-configure-scopes) article.
1. Replace the value for `webApi` with your web API endpoint location.

## Step 9: Call your web API

Define the HTTP request to your API endpoint. The HTTP request is configured to pass the access token that was acquired with *MSAL.js* into the `Authorization` HTTP header in the request.

The following code defines the HTTP `GET` request to the API endpoint, passing the access token within the `Authorization` HTTP header. The API location is defined by the `webApi` key in *apiConfig.js*. 

To call your web API by using the token you acquired, do the following:

1. Inside the *App* folder, create a new file named *api.js*.
1. Add the following code to the *api.js* file:

    ```javascript
    function callApi(endpoint, token) {
        
        const headers = new Headers();
        const bearer = `Bearer ${token}`;
    
        headers.append("Authorization", bearer);
    
        const options = {
            method: "GET",
            headers: headers
        };
    
        logMessage('Calling web API...');
        
        fetch(endpoint, options)
        .then(response => response.json())
        .then(response => {

            if (response) {
            logMessage('Web API responded: ' + response.name);
            }
            
            return response;
        }).catch(error => {
            console.error(error);
        });
    }
    ```

## Step 10: Add the UI elements reference

The SPA app uses JavaScript to control the UI elements. For example, it displays the sign-in and sign-out buttons, and renders the users' ID token claims to the screen.

To add the UI elements reference, do the following:

1. Inside the *App* folder, create a file named *ui.js*.
1. Add the following code to the *ui.js* file:

    ```javascript
    // Select DOM elements to work with
    const signInButton = document.getElementById('signIn');
    const signOutButton = document.getElementById('signOut')
    const titleDiv = document.getElementById('title-div');
    const welcomeDiv = document.getElementById('welcome-div');
    const tableDiv = document.getElementById('table-div');
    const tableBody = document.getElementById('table-body-div');
    const editProfileButton = document.getElementById('editProfileButton');
    const callApiButton = document.getElementById('callApiButton');
    const response = document.getElementById("response");
    const label = document.getElementById('label');

    function welcomeUser(claims) {
        welcomeDiv.innerHTML = `Token claims: </br></br> ${claims}!`

        signInButton.classList.add('d-none');
        signOutButton.classList.remove('d-none');
        welcomeDiv.classList.remove('d-none');
        callApiButton.classList.remove('d-none');
    }

    function logMessage(s) {
        response.appendChild(document.createTextNode('\n' + s + '\n'));
    }
    ```
  
## Step 11: Run your SPA application

In your command shell, run the following commands:

``` powershell
npm install  
npm ./index.js
```

1. Go to https://localhost:6420. 
1. Select **Sign-in**.
1. Complete the sign-up or sign-in process.

After you've authenticated successfully, the parsed ID token is displayed on the screen. Select `Call API` to call your API endpoint.

## Next steps

* Learn more about the [code sample](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa).
* Configure [Authentication options in your own SPA application by using Azure AD B2C](enable-authentication-spa-app-options.md).
* [Enable authentication in your own web API](enable-authentication-web-api.md).
