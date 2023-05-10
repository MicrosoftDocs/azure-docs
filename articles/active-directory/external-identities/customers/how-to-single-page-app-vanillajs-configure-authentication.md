---
title: Configure a vanilla JavaScript single-page app for authentication
description: Learn how to configure authentication for a vanilla JavaScript single-page app (SPA) with your Azure Active Directory (AD) for customers tenant.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.author: owenrichards
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
ms.custom: developer

#Customer intent: As a developer, I want to learn how to configure vanilla JavaScript single-page app (SPA) to sign in and sign out users with my Azure Active Directory (AD) for customers tenant.
---

# Create components for authentication and authorization

In the previous article, you created a vanilla JavaScript (JS) single-page application (SPA) and a server to host it. In this article, you'll configure the application to authenticate and authorize users to access protected resources. Authentication and authorization are handled by the [Microsoft Authentication Library for JavaScript (MSAL.js)](/javascript/api/overview/). The library is used to authenticate users and acquire access tokens from Azure Active Directory (AD) for customers.

## Prerequisites

* Completion of the prerequisites and steps in [Prepare a single-page application for authentication](how-to-single-page-app-vanillajs-prepare-app.md).

## Creating the authentication configuration file

The application uses the [Implicit Grant Flow](../../develop/v2-oauth2-implicit-grant-flow.md) to authenticate users. The Implicit Grant Flow is a browser-based flow that doesn't require a back-end server. The flow redirects the user to the sign-in page, where the user signs in and consents to the permissions that are being requested by the application. The purpose of *authConfig.js* is to configure the authentication flow.

1. In your IDE, create a new folder and name it **public**
1. In the *public* folder, create a new file and name it *authConfig.js*.
1. Open *authConfig.js* and add the following code snippet:

    ```javascript
    /**
     * Configuration object to be passed to MSAL instance on creation. 
     * For a full list of MSAL.js configuration parameters, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
     */
    const msalConfig = {
        auth: {
            clientId: 'Enter_the_Application_Id_Here', // This is the ONLY mandatory field that you need to supply.
            authority: 'https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/', // Replace "Enter_the_Tenant_Subdomain_Here" with your tenant subdomain
            redirectUri: '/', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.href e.g. http://localhost:3000/
            navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
        },
        cache: {
            cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
            storeAuthStateInCookie: false, // set this to true if you have to support IE
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (containsPii) {
                        return;
                    }
                    switch (level) {
                        case msal.LogLevel.Error:
                            console.error(message);
                            return;
                        case msal.LogLevel.Info:
                            console.info(message);
                            return;
                        case msal.LogLevel.Verbose:
                            console.debug(message);
                            return;
                        case msal.LogLevel.Warning:
                            console.warn(message);
                            return;
                    }
                },
            },
        },
    };
    
    /**
     * An optional silentRequest object can be used to achieve silent SSO
     * between applications by providing a "login_hint" property.
     */
    
    // const silentRequest = {
    //   scopes: ["openid", "profile"],
    //   loginHint: "example@domain.net"
    // };
    
    // exporting config object for jest
    if (typeof exports !== 'undefined') {
        module.exports = {
            msalConfig: msalConfig,
            loginRequest: loginRequest,
        };
    }
     ```

1. Find the `Enter_the_Application_Id_Here` value and replace it with the application ID (clientId) of the app you registered in the Microsoft Entra admin center.
1. In **Authority**, find `Enter_the_Tenant_Subdomain_Here` and replace it with the subdomain of your tenant. For example, if your tenant primary domain is *caseyjensen@onmicrosoft.com*, the value you should enter is *casyjensen*.
1. Save the file.

## Creating the redirection file

A redirection file is required to handle the response from the sign-in page. The redirection file is used to extract the access token from the URL fragment and use it to call the protected API.

1. In the *public* folder, create a new file and name it *authRedirect.js*.
1. Open *authRedirect.js* and add the following code snippet:

    ```javascript
    // Create the main myMSALObj instance
    // configuration parameters are located at authConfig.js
    const myMSALObj = new msal.PublicClientApplication(msalConfig);
    
    let username = "";
    
    /**
     * A promise handler needs to be registered for handling the
     * response returned from redirect flow. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
     */
    myMSALObj.handleRedirectPromise()
        .then(handleResponse)
        .catch((error) => {
            console.error(error);
        });
    
    function selectAccount() {
    
        /**
         * See here for more info on account retrieval: 
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
         */
    
        const currentAccounts = myMSALObj.getAllAccounts();
    
        if (!currentAccounts) {
            return;
        } else if (currentAccounts.length > 1) {
            // Add your account choosing logic here
            console.warn("Multiple accounts detected.");
        } else if (currentAccounts.length === 1) {
            welcomeUser(currentAccounts[0].username);
            updateTable(currentAccounts[0]);
        }
    }
    
    function handleResponse(response) {
    
        /**
         * To see the full list of response object properties, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
         */
    
        if (response !== null) {
            welcomeUser(response.account.username);
            updateTable(response.account);
        } else {
            selectAccount();
        }
    }
    
    function signIn() {
    
        /**
         * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
         */
    
        myMSALObj.loginRedirect(loginRequest);
    }
    
    function signOut() {
    
        /**
         * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
         */
    
        // Choose which account to logout from by passing a username.
        const logoutRequest = {
            account: myMSALObj.getAccountByUsername(username),
            postLogoutRedirectUri: '/signout', // remove this line if you would like navigate to index page after logout.
    
        };
    
        myMSALObj.logoutRedirect(logoutRequest);
    }
    ```

1. Save the file.

## Creating the authPopup.js file

The application uses *authPopup.js* to handle the authentication flow when the user signs in using the pop-up window. The pop-up window is used when the user is already signed in and the application needs to get an access token for a different resource. 

1. In the *public* folder, create a new file and name it *authPopup.js*.
1. Open *authPopup.js* and add the following code snippet:

    ```javascript
    // Create the main myMSALObj instance
    // configuration parameters are located at authConfig.js
    const myMSALObj = new msal.PublicClientApplication(msalConfig);
    
    let username = "";
    
    function selectAccount () {
    
        /**
         * See here for more info on account retrieval: 
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
         */
    
        const currentAccounts = myMSALObj.getAllAccounts();
    
        if (!currentAccounts  || currentAccounts.length < 1) {
            return;
        } else if (currentAccounts.length > 1) {
            // Add your account choosing logic here
            console.warn("Multiple accounts detected.");
        } else if (currentAccounts.length === 1) {
            username = currentAccounts[0].username
            welcomeUser(currentAccounts[0].username);
            updateTable(currentAccounts[0]);
        }
    }
    
    function handleResponse(response) {
    
        /**
         * To see the full list of response object properties, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
         */
        
        if (response !== null) {
            username = response.account.username
            welcomeUser(username);
            updateTable(response.account);
        } else {
            selectAccount();
        }
    }
    
    function signIn() {
    
        /**
         * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
         */
    
        myMSALObj.loginPopup(loginRequest)
            .then(handleResponse)
            .catch(error => {
                console.error(error);
            });
    }
    
    function signOut() {
    
        /**
         * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
         */
    
        // Choose which account to logout from by passing a username.
        const logoutRequest = {
            account: myMSALObj.getAccountByUsername(username),
            mainWindowRedirectUri: '/signout'
        };
    
        myMSALObj.logoutPopup(logoutRequest);
    }
    
    selectAccount();
    ```

1. Save the file.

## Next steps

> [!div class="nextstepaction"]
> [Configure a single-page application User Interface and Sign-In](how-to-single-page-app-vanillajs-sign-in-sign-out.md)
