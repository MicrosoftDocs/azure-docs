---
title: Sign in users and call an API in a Node.js web application - acquire an access token
description: Learn how to sign-in users and acquire an access token for calling an API in your own Node.js web application.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer, devx-track-js
---

# Sign in users and call an API in a Node.js web application - acquire an access token

In this article, you add sign in, then acquire an access token to the web app project that you prepared in the previous chapter, [Prepare your client app and API](how-to-web-app-node-sign-in-call-api-prepare-app.md). The application you build uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to simplify adding authentication and authorization to your node web application.

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
            authority: process.env.AUTHORITY || `https://${TENANT_SUBDOMAIN}.ciamlogin.com/`, 
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
    
    const toDoListReadScope = process.env.TODOLIST_READ || 'api://Enter_the_Web_Api_Application_Id_Here/ToDoList.Read';
    const toDoListReadWriteScope = process.env.TODOLIST_READWRITE || 'api://Enter_the_Web_Api_Application_Id_Here/ToDoList.ReadWrite';
    
    const protectedResources = {
        toDoListAPI: {
            endpoint: 'https://localhost:44351/api/todolist',
            scopes: {
                read: [toDoListReadScope],
                write: [toDoListReadWriteScope],
            },
        },
    };    
    module.exports = {
        msalConfig,
        protectedResources,
        TENANT_SUBDOMAIN,
        REDIRECT_URI,
        POST_LOGOUT_REDIRECT_URI,
    };
```

The `msalConfig` object contains a set of configuration options that you use to customize the behavior of your authentication flows. 

In your `authConfig.js` file, replace: 

- `Enter_the_Application_Id_Here` with the Application (client) ID of the client web app that you registered earlier.

- `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

- `Enter_the_Client_Secret_Here` with the client web app secret value that you copied earlier.

- `Enter_the_Web_Api_Application_Id_Here` with the Application (client) ID of the web API app that you copied earlier.

Notice that the `todolistReadScope` and `todolistReadWriteScope` variables hold the full scope URLs that you set earlier in [Prepare your client app and API](how-to-web-app-node-sign-in-call-api-prepare-app.md). They're packaged in the `protectedResources` object. 


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
The `/` route is the entry point to the application. It renders the `views/index.hbs` that you created earlier in [Build app UI components](how-to-web-app-node-sign-in-call-api-prepare-app.md#build-app-ui-components). The `isAuthenticated` is a boolean variable that determines what you see in the view.   

### Sign-in and sign-out 

1. In your code editor, open *routes/auth.js* file, then add the code from [auth.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/2-Authorization/4-call-api-express/App/routes/auth.js) to it.

1. In your code editor, open *controller/authController.js* file, then add the code from [authController.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/2-Authorization/4-call-api-express/App/controller/authController.js) to it.

1. In your code editor, open *auth/AuthProvider.js* file, then add the code from [AuthProvider.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/2-Authorization/4-call-api-express/App/auth/AuthProvider.js) to it.

The `/signin`, `/signout` and `/redirect` routes are defined in the *routes/auth.js* file, but you implement their logic in *auth/AuthProvider.js* file.

- The `login` method handles`/signin` route:
    
    - Initiates sign-in flow by triggering the first leg of auth code flow.  
    
    - Initializes a [confidential client application](../../../active-directory/develop/msal-client-applications.md) instance by using `msalConfig` MSAL configuration object.
        
        ```javascript
            const msalInstance = this.getMsalInstance(this.config.msalConfig);
        ```
    
        The `getMsalInstance` method is defined in the `AuthProvider` class as:

        ```javascript
            getMsalInstance(msalConfig) {
                return new msal.ConfidentialClientApplication(msalConfig);
            }
        ```
    - The first leg of auth code flow generates an authorization code request URL, then redirects to that URL to obtain the authorization code. This first leg is implemented in the `redirectToAuthCodeUrl` method:
    
        ```javascript
            async redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams, msalInstance) {
                // Generate PKCE Codes before starting the authorization flow
                const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();
        
                // Set generated PKCE codes and method as session vars
                req.session.pkceCodes = {
                    challengeMethod: 'S256',
                    verifier: verifier,
                    challenge: challenge,
                };
        
                /**
                 * By manipulating the request objects below before each request, we can obtain
                 * auth artifacts with desired claims. For more information, visit:
                 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationurlrequest
                 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationcoderequest
                 **/
        
                req.session.authCodeUrlRequest = {
                    ...authCodeUrlRequestParams,
                    redirectUri: this.config.redirectUri,
                    responseMode: 'form_post', // recommended for confidential clients
                    codeChallenge: req.session.pkceCodes.challenge,
                    codeChallengeMethod: req.session.pkceCodes.challengeMethod,
                };
        
                req.session.authCodeRequest = {
                    ...authCodeRequestParams,
                    redirectUri: this.config.redirectUri,
                    code: '',
                };
        
                try {
                    const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
                res.redirect(authCodeUrlResponse);
            } catch (error) {
                next(error);
            }
        }  
        ```
        
        Notice how we use MSALs [getAuthCodeUrl](/javascript/api/@azure/msal-node/confidentialclientapplication#@azure-msal-node-confidentialclientapplication-getauthcodeurl) method to generate authorization code URL:
        
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
    
    - You set this route as Redirect URI for the web app in the Microsoft Entra admin center earlier in [Register the web app](how-to-web-app-node-sample-sign-in-call-api.md#register-the-web-app).
    
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
    
    - It initiates sign out process. 
    
    - When you want to sign the user out of the application, it isn't enough to end the user's session. You must redirect the user to the *logout URI*. Otherwise, the user might be able to reauthenticate to your applications without reentering their credentials. If the name of your tenant is *contoso*, then the *logout URI* looks similar to `https://contoso.ciamlogin.com/contoso.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000`.
    
    ```javascript
        //...
         const logoutUri = `${this.config.msalConfig.auth.authority}${TENANT_SUBDOMAIN}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;

        req.session.destroy(() => {
            res.redirect(logoutUri);
        });
        //...
    ```
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
If the user is authenticated, the `/id` route displays ID token claims by using the `views/id.hbs` view. You added this view earlier in [Build app UI components](tutorial-web-app-node-sign-in-prepare-app.md#build-app-ui-components).
To extract a specific ID token claim, such as *given name*: 
```javascript
    const givenName = req.session.account.idTokenClaims.given_name
``` 

## Acquire access token

The `getToken` method in the `AuthProvider` class shows how to request for an access token: 

```javascript
    getToken(scopes) {
        return  async function (req, res, next) {
            const msalInstance = authProvider.getMsalInstance(authProvider.config.msalConfig);
            try {
                msalInstance.getTokenCache().deserialize(req.session.tokenCache);

                const silentRequest = {
                    account: req.session.account,
                    scopes: scopes,
                };

                const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);

                req.session.tokenCache = msalInstance.getTokenCache().serialize();
                req.session.accessToken = tokenResponse.accessToken;
                next();
            } catch (error) {
                if (error instanceof msal.InteractionRequiredAuthError) {
                    req.session.csrfToken = authProvider.cryptoProvider.createNewGuid();

                    const state = authProvider.cryptoProvider.base64Encode(
                        JSON.stringify({
                            redirectTo: 'http://localhost:3000/todos',
                            csrfToken: req.session.csrfToken,
                        })
                    );
                    
                    const authCodeUrlRequestParams = {
                        state: state,
                        scopes: scopes,
                    };

                    const authCodeRequestParams = {
                        state: state,
                        scopes: scopes,
                    };

                    authProvider.redirectToAuthCodeUrl(
                        req,
                        res,
                        next,
                        authCodeUrlRequestParams,
                        authCodeRequestParams,
                        msalInstance
                    );
                }

                next(error);
            }
        };
    }
```

- First, the function attempts to acquire an access token silently (without prompting the user for credentials):

    ```javascript
    const silentRequest = {
        account: req.session.account,
        scopes: scopes,
    };

    const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
    ```
- If you successfully acquire a token silently, store it in a session. You retrieve the token from the session when you call an API.

    ```javascript
    req.session.accessToken = tokenResponse.accessToken;
    ```

- If you fail to acquire the token silently (such as with `InteractionRequiredAuthError` exception), request an access token afresh.

## Next steps

> [!div class="nextstepaction"]
> [Call an API >](how-to-web-app-node-sign-in-call-api-call-api.md)
