---
title: Sign in users in your own Node.js web application by using Microsoft Entra - Add sign-in and sign-out
description: Learn about how to add sign-in and sign-out in your own Node.js web application by using Microsoft Entra.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own Node.js web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own Node.js web application by using Microsoft Entra - Add sign-in and sign-out

In this article, you add sign in and sign out to the web app project that you prepare in the previous chapter, [Prepare your web app](how-to-web-app-node-sign-in-prepare-app.md). The application you build uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to simplify adding authentication to your node web application.

## Create MSAL configuration object

In your code editor, open `authConfig.js` file, then add the following code:

```javascript
    require('dotenv').config();
    
    /**
     * Configuration object to be passed to MSAL instance on creation.
     * For a full list of MSAL Node configuration parameters, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
     */
    const msalConfig = {
        auth: {
            clientId: process.env.CLIENT_ID || "Enter_the_Application_Id_Here", // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
            authority: "https://login.microsoftonline.com/" + (process.env.TENANT_ID || "Enter_the_Tenant_Info_Here"), // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
            clientSecret: process.env.CLIENT_SECRET || "Enter_the_Client_Secret_Here" // Client secret generated from the app registration in Azure portal
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
    
    const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/auth/redirect";
    const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI || "http://localhost:3000";
    
    module.exports = {
        msalConfig,
        REDIRECT_URI,
        POST_LOGOUT_REDIRECT_URI,
    };
```

The `msalConfig` object contains a set of configuration options that you use to customize the behavior of your authentication flows. 

In your `authConfig.js` file, replace: 

- `Enter_the_Application_Id_Here` with the Application (client) ID of the app you registered earlier.

- `Enter_the_Tenant_Info_Here` with the Directory (tenant) ID you copied earlier.
 
- `Enter_the_Client_Secret_Here` with the app secret value you copied earlier.

If you use the `.env` file to store your configuration information:

1. In your project folder such as `ciam-sign-in-node-express-web-app`, create a `.env` file. 

1. In your code editor, open `.env` file, then add the following code. 

    ```
        CLIENT_ID=Enter_the_Application_Id_Here
        TENANT_ID=Enter_the_Tenant_Info_Here
        CLIENT_SECRET=Enter_the_Client_Secret_Here
        REDIRECT_URI=http://localhost:3000/auth/redirect
        POST_LOGOUT_REDIRECT_URI=http://localhost:3000
    ```

1. Replace the `Enter_the_Application_Id_Here`, `Enter_the_Tenant_Info_Here` and `Enter_the_Client_Secret_Here` placeholders as explained earlier. 

You export `msalConfig`, `REDIRECT_URI`, and `POST_LOGOUT_REDIRECT_URI` variables in the `authConfig.js` file. This makes them accessible wherever you require the file.

## Add express routes

The Express routes provides the endpoints that enable us the execute operations such as sign in, sign out and view ID token claims.

### App entry point 

In your code editor, open `routes/index.js` file, then add the following code:

```javascript
    const express = require('express');
    const router = express.Router();
    
    router.get('/', function (req, res, next) {
        res.render('index', {
            title: 'MSAL Node & Express Web App',
            isAuthenticated: req.session.isAuthenticated,
            username: req.session.account?.username,
        });
    });
    
    module.exports = router;
```

The `/` route is the entry point to the application. It renders the `views/index.js` that you created earlier in [Build app UI components](how-to-web-app-node-sign-in-prepare-app.md#build-app-ui-components). `isAuthenticated` is a boolean variable that determines what you see in the view.   

### Sign in and sign out

In your code editor, open `routes/auth.js` file, then add the code from [authConfig.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/1-Authentication/5-sign-in-express/App/routes/auth.js) to it.

This file has three routes: 

- `/signin`:
    
    - Initiates sign-in flow by triggering the first leg of auth code flow.  
    
    - Initializes a [confidential client application](../../../active-directory/develop/msal-client-applications.md) instance by using `msalConfig` MSAL configuration object.
        
        ```javascript
            const msalInstance = getMsalInstance(msalConfig);
        ```
    
        The `getMsalInstance` method is defined as:

        ```javascript
            function getMsalInstance(msalConfig) {
                return new msal.ConfidentialClientApplication(msalConfig);
            };
        ```
    - The first leg of auth code flow generates an authorization code request URL, then redirects to that URL to obtain the authorization code. This first leg is implemented in the `redirectToAuthCodeUrl` method:
    
        ```javascript
            async function redirectToAuthCodeUrl(req, res, next, msalInstance, authCodeUrlRequestParams, authCodeRequestParams) {
            
                    // Generate PKCE Codes before starting the authorization flow
                    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
                
                    // Set generated PKCE codes and method as session vars
                    req.session.pkceCodes = {
                        challengeMethod: 'S256',
                        verifier: verifier,
                        challenge: challenge,
                    };
                
                    /**
                     * By manipulating the request objects below before each request, we can obtain
                        * auth artifacts with desired claims. 
                        **/
                
                    req.session.authCodeUrlRequest = {
                        ...authCodeUrlRequestParams,
                        redirectUri: REDIRECT_URI,
                        responseMode: 'form_post', // recommended for confidential clients
                        codeChallenge: req.session.pkceCodes.challenge,
                        codeChallengeMethod: req.session.pkceCodes.challengeMethod,
                    };
                
                        req.session.authCodeRequest = {
                            ...authCodeRequestParams,
                            redirectUri: REDIRECT_URI,
                        code: "",
                    };
                
                    // Get url to sign user in and consent to scopes needed for application
                try {
                    const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
                    res.redirect(authCodeUrlResponse);
                } catch (error) {
                    next(error);
                }
            };  
        ```

        Notice how we use to [getAuthCodeUrl](/javascript/api/@azure/msal-node/confidentialclientapplication#@azure-msal-node-confidentialclientapplication-getauthcodeurl) method to generate authorization code URL:

        ```javascript
            ...
            const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
            ...
        ```
        
        We then redirect to the authorization code URL itself.

        ```javascript
            ...
            res.redirect(authCodeUrlResponse);
            ...
        ```
    
    - To improve performance in token acquisition, only request `cloudDiscoveryMetadata` and `authorityMetadata` if the current MSAL configuration doesn't have them. 

- `/redirect`:
    
    - You set this as Redirect URI for the web app in the Microsoft Entra admin center earlier in [Register the web app](how-to-web-app-node-sample-sign-in.md#register-the-web-app).
    
    - This endpoint implements the second leg of auth code flow uses. It uses the authorization code to request an ID token by using MSAL's [acquireTokenByCode](/javascript/api/@azure/msal-node/confidentialclientapplication#@azure-msal-node-confidentialclientapplication-acquiretokenbycode) method.
    
        ```javascript
            const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);
        ``` 

### View ID token claims
















## Next steps 

add sGoogle anf FB IdPs
branding 
extensions - customization. s