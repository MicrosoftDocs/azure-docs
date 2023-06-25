---
title: Sign in users in a Node.js web application  - add sign-in and sign-out
description: Learn about how to add sign-in and sign-out in your own Node.js web application.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own Node.js web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in a Node.js web application  - add sign-in and sign-out

In this article, you add sign in and sign out to the web app project that you prepared in the previous chapter, [Prepare your web app](how-to-web-app-node-sign-in-prepare-app.md). The application you build uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to simplify adding authentication to your node web application.

## Create MSAL configuration object

In your code editor, open *authConfig.js* file, then add the following code:

```javascript
    require('dotenv').config();
    
    const TENANT_SUBDOMAIN = process.env.TENANT_SUBDOMAIN || 'Enter_the_Tenant_Subdomain_Here';
    const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/redirect';
    const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000';
    
    /**
     * Configuration object to be passed to MSAL instance on creation.
     * For a full list of MSAL Node configuration parameters, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
     */
    const msalConfig = {
        auth: {
            clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
            authority: process.env.AUTHORITY || `https://${TENANT_SUBDOMAIN}.ciamlogin.com/`, // replace "Enter_the_Tenant_Subdomain_Here" with your tenant name
            clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Client_Secret_Here', // Client secret generated from the app registration in Azure portal
        },
        system: {
            loggerOptions: {
                loggerCallback(loglevel, message, containsPii) {
                    console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: 'Info',
            },
        },
    };
    
    module.exports = {
        msalConfig,
        REDIRECT_URI,
        POST_LOGOUT_REDIRECT_URI,
        TENANT_SUBDOMAIN
    };
```

The `msalConfig` object contains a set of configuration options that you use to customize the behavior of your authentication flows. 

In your *authConfig.js* file, replace: 

- `Enter_the_Application_Id_Here` with the Application (client) ID of the app you registered earlier.

- `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).
 
- `Enter_the_Client_Secret_Here` with the app secret value you copied earlier.

If you use the *.env* file to store your configuration information:

1. In your project folder such as `ciam-sign-in-node-express-web-app`, create a *.env* file. 

1. In your code editor, open *.env* file, then add the following code. 

    ```
        CLIENT_ID=Enter_the_Application_Id_Here
        TENANT_SUBDOMAIN=Enter_the_Tenant_Subdomain_Here
        CLIENT_SECRET=Enter_the_Client_Secret_Here
        REDIRECT_URI=http://localhost:3000/auth/redirect
        POST_LOGOUT_REDIRECT_URI=http://localhost:3000
    ```

1. Replace the `Enter_the_Application_Id_Here`, `Enter_the_Tenant_Subdomain_Here` and `Enter_the_Client_Secret_Here` placeholders as explained earlier. 

You export `msalConfig`, `REDIRECT_URI`, `TENANT_SUBDOMAIN` and `POST_LOGOUT_REDIRECT_URI` variables in the *authConfig.js* file. This makes them accessible wherever you require the file.

## Add express routes

The Express routes provide the endpoints that enable us the execute operations such as sign in, sign out and view ID token claims.

### App entry point 

In your code editor, open *routes/index.js* file, then add the following code:

```javascript
    const express = require('express');
    const router = express.Router();
    
    router.get('/', function (req, res, next) {
        res.render('index', {
            title: 'MSAL Node & Express Web App',
            isAuthenticated: req.session.isAuthenticated,
            username: req.session.account?.username !== '' ? req.session.account?.username : req.session.account?.name,
        });
    });    
    module.exports = router;
```

The `/` route is the entry point to the application. It renders the *views/index.hbs* view that you created earlier in [Build app UI components](how-to-web-app-node-sign-in-prepare-app.md#build-app-ui-components). `isAuthenticated` is a boolean variable that determines what you see in the view.   

### Sign in and sign out

1. In your code editor, open *routes/auth.js* file, then add the code from [auth.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/1-Authentication/5-sign-in-express/App/routes/auth.js) to it.

1. In your code editor, open *controller/authController.js* file, then add the code from [authController.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/1-Authentication/5-sign-in-express/App/controller/authController.js) to it.

1. In your code editor, open *auth/AuthProvider.js* file, then add the code from [AuthProvider.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/1-Authentication/5-sign-in-express/App/auth/AuthProvider.js) to it.

    The `/signin`, `/signout` and `/redirect` routes are defined in the *routes/auth.js* file, but their logic live in the *auth/AuthProvider.js* class.

- The `login` method handles `/signin` route:
    
    - It initiates sign-in flow by triggering the first leg of auth code flow.  
    
    - It initializes a [confidential client application](../../../active-directory/develop/msal-client-applications.md) instance by using MSAL configuration object, `msalConfig`.
        
        ```javascript
            const msalInstance = this.getMsalInstance(this.config.msalConfig);
        ```
    
        The `getMsalInstance` method is defined as:

        ```javascript
            getMsalInstance(msalConfig) {
                return new msal.ConfidentialClientApplication(msalConfig);
            }
        ```
    - The first leg of auth code flow generates an authorization code request URL, then redirects to that URL to obtain the authorization code. This first leg is implemented in the `redirectToAuthCodeUrl` method. Notice how we use MSALs [getAuthCodeUrl](/javascript/api/@azure/msal-node/confidentialclientapplication#@azure-msal-node-confidentialclientapplication-getauthcodeurl) method to generate authorization code URL:

        ```javascript
            //...
            const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
            //...
        ```
        
        We then redirect to the authorization code URL itself.

        ```javascript
            //...
            res.redirect(authCodeUrlResponse);
            //...
        ```
    

- The `handleRedirect` method handles `/redirect` route:
    
    - You set this as Redirect URI for the web app in the Microsoft Entra admin center earlier in [Register the web app](how-to-web-app-node-sample-sign-in.md#register-the-web-app).
    
    - This endpoint implements the second leg of auth code flow uses. It uses the authorization code to request an ID token by using MSAL's [acquireTokenByCode](/javascript/api/@azure/msal-node/confidentialclientapplication#@azure-msal-node-confidentialclientapplication-acquiretokenbycode) method.
    
        ```javascript
            //...
            const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);
            //...
        ``` 
    
    - After you receive a response, you can create an Express session and store whatever information you want in it. You need to include `isAuthenticated` and set it to `true`:
    
        ```javascript
            //...        
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            req.session.isAuthenticated = true;
            //...
        ```

- The `logout` method handles `/signout` route:
        
    ```javascript
        async logout(req, res, next) {
            /**
             * Construct a logout URI and redirect the user to end the
             * session with Azure AD. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
             */
            const logoutUri = `${this.config.msalConfig.auth.authority}${TENANT_SUBDOMAIN}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=${this.config.postLogoutRedirectUri}`;
    
            req.session.destroy(() => {
                res.redirect(logoutUri);
            });
        }
    ```
    - It initiates sign out request. 
    
    - When you want to sign the user out of the application, it isn't enough to end the user's session. You must redirect the user to the *logoutUri*. Otherwise, the user might be able to reauthenticate to your applications without reentering their credentials. If the name of your tenant is *contoso*, then the *logoutUri* looks similar to `https://contoso.ciamlogin.com/contoso.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000`.
    
    
### View ID token claims

In your code editor, open *routes/users.js* file, then add the following code:

```javascript
        const express = require('express');
        const router = express.Router();
        
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
        module.exports = router;
```

If the user is authenticated, the `/id` route displays ID token claims by using the *views/id.hbs* view. You added this view earlier in [Build app UI components](how-to-web-app-node-sign-in-prepare-app.md#build-app-ui-components).

To extract a specific ID token claim, such as *given name*: 

```javascript
    const givenName = req.session.account.idTokenClaims.given_name
``` 

## Finalize your web app 

1. In your code editor, open *app.js* file, then add the code from [app.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/1-Authentication/5-sign-in-express/App/app.js) to it.

1. In your code editor, open *server.js* file, then add the code from [server.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/1-Authentication/5-sign-in-express/App/server.js) to it.

1. In your code editor, open *package.json* file, then update the `scripts` property to:

    ```json
      "scripts": {
        "start": "node server.js"
      }
    ```

## Run and test the web app

1. In your terminal, make sure you're in the project folder that contains your web app such as `ciam-sign-in-node-express-web-app`.

1. Use the steps in [Run and test the web app](how-to-web-app-node-sample-sign-in.md#run-and-test-sample-web-app) article to test your web app.

## Next steps 

Learn how to: 

- [Enable password reset](how-to-enable-password-reset-customers.md).

- [Customize the default branding](how-to-customize-branding-customers.md).
 
- [Configure sign-in with Google](how-to-google-federation-customers.md). 

- [Use client certificate for authentication in your Node.js web app instead of a client secret](how-to-web-app-node-use-certificate.md).