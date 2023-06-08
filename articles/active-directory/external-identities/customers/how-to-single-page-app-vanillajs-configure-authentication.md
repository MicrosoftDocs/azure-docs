---
title: Configure a Vanilla JavaScript single-page app for authentication
description: Learn how to configure authentication for a Vanilla JavaScript single-page app (SPA) with your Azure Active Directory (AD) for customers tenant.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.author: owenrichards
ms.service: active-directory
ms.subservice: ciam
ms.topic: tutorial
ms.date: 05/25/2023

#Customer intent: As a developer, I want to learn how to configure Vanilla JavaScript single-page app (SPA) to sign in and sign out users with my Azure Active Directory (AD) for customers tenant.
---

# Handle authentication flows in a Vanilla JavaScript single-page app

In the [previous article](./tutorial-single-page-app-vanillajs-sign-in-prepare-app.md), you created a Vanilla JavaScript (JS) single-page application (SPA) and a server to host it, and configured the file for authentication.

In this tutorial you'll;

> [!div class="checklist"]
> * Add code to *authRedirect.js* to handle the authentication flow
> * Add code to *authPopup.js* to handle the authentication flow

## Prerequisites

* Completion of the prerequisites and steps in [Prepare a single-page application for authentication](tutorial-single-page-app-vanillajs-sign-in-prepare-app.md).

## Adding code to the redirection file

A redirection file is required to handle the response from the sign-in page. It is used to extract the access token from the URL fragment and use it to call the protected API. It is also used to handle errors that occur during the authentication process.

1. Open *public/authRedirect.js* and add the following code snippet:

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

## Adding code to the *authPopup.js* file

The application uses *authPopup.js* to handle the authentication flow when the user signs in using the pop-up window. The pop-up window is used when the user is already signed in and the application needs to get an access token for a different resource.

1. Open *public/authPopup.js* and add the following code snippet:

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
> [Sign in and sign out of the Vanilla JS SPA](./tutorial-single-page-app-vanillajs-sign-in-sign-in-sign-out.md)