---
title: Sign in users to a Vanilla JS Single-page application using Microsoft Entra - Configure application for authentication
description: Learn how to configure vanilla JavaScript single-page app (SPA) for authentication and authorization with Azure AD CIAM.

services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.author: owenrichards
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/19/2023
ms.custom: developer

#Customer intent: As a developer, I want to learn how to configure vanilla JavaScript single-page app (SPA) to sign in and sign out users with my CIAM tenant.
---

# Create components for authentication and authorization

Authentication and authorization are handled by the [Microsoft Authentication Library for JavaScript (MSAL.js)](/javascript/api/overview/). The library is used to authenticate users and acquire access tokens from Azure AD CIAM. An access token is then used to authorize users to access protected resources.

In this article:
> [!div class="checklist"]
>
> * Create a configuration file for authentication
> * Create a sign-in and sign-out button
> * Create a sign-in and sign-out function
> * Create a function to get an access token and call a protected API

## Prerequisites

* Completion of the prerequisites and steps in [Prepare a Single-page application for authentication](how-to-single-page-app-vanillajs-prepare-app.md).

## Creating the authentication configuration file

1. In the **Explorer** pane, right-click the project folder and select **New Folder**. Name the folder **public**.
1. Right-click the **public** folder and select **New File**. Name the file *authConfig.js*.
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
            authority: 'https://login.microsoftonline.com/Enter_the_Tenant_Id_Here', // Defaults to "https://login.microsoftonline.com/common"
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
     * Scopes you add here will be prompted for user consent during sign-in.
     * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
     * For more information about OIDC scopes, visit: 
     * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
     */
    const loginRequest = {
        scopes: [],
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

1. Replace the following values with the values from the Admin center.
    * `clientId` - The identifier of the application, also referred to as the client. Replace `Enter_the_Application_Id_Here` with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `authority` - This is composed of two parts:
        * The *Instance* is endpoint of the cloud provider. Check with the different available endpoints in [National clouds](../develop\authentication-national-cloud.md#azure-ad-authentication-endpoints).
        * The *Tenant ID* is the identifier of the tenant where the application is registered. Replace the `_Enter_the_Tenant_Info_Here` with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
1. Save the file.

## Creating the redirection file

1. Right-click the *public* folder and select **New File**. Name the file *authRedirect.js*.
1. Open *authConfig.js* and add the following code snippet:

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
            username = currentAccounts[0].username;
            welcomeUser(username);
            updateTable();
        }
    }
    
    function handleResponse(response) {
    
        /**
         * To see the full list of response object properties, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
         */
    
        if (response !== null) {
            username = response.account.username;
            welcomeUser(username);
            updateTable();
        } else {
            selectAccount();
    
            /**
             * If you already have a session that exists with the authentication server, you can use the ssoSilent() API
             * to make request for tokens without interaction, by providing a "login_hint" property. To try this, comment the 
             * line above and uncomment the section below.
             */
    
            // myMSALObj.ssoSilent(silentRequest).
            //     then(() => {
            //         const currentAccounts = myMSALObj.getAllAccounts();
            //         username = currentAccounts[0].username;
            //         welcomeUser(username);
            //         updateTable();
            //     }).catch(error => {
            //         console.error("Silent Error: " + error);
            //         if (error instanceof msal.InteractionRequiredAuthError) {
            //             signIn();
            //         }
            //     });
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

1. Right-click the **public** folder and select **New File**. Name the file *authRedirect.js*.
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
            username = currentAccounts[0].username;
            welcomeUser(username);
            updateTable();
        }
    }
    
    function handleResponse(response) {
    
        /**
         * To see the full list of response object properties, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
         */
    
        if (response !== null) {
            username = response.account.username;
            welcomeUser(username);
            updateTable();
        } else {
            selectAccount();
    
            /**
             * If you already have a session that exists with the authentication server, you can use the ssoSilent() API
             * to make request for tokens without interaction, by providing a "login_hint" property. To try this, comment the 
             * line above and uncomment the section below.
             */
    
            // myMSALObj.ssoSilent(silentRequest).
            //     then(() => {
            //         const currentAccounts = myMSALObj.getAllAccounts();
            //         username = currentAccounts[0].username;
            //         welcomeUser(username);
            //         updateTable();
            //     }).catch(error => {
            //         console.error("Silent Error: " + error);
            //         if (error instanceof msal.InteractionRequiredAuthError) {
            //             signIn();
            //         }
            //     });
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

## Creating the claimUtils.js file

1. Right-click the **public** folder and select **New File**. Name the file *claimUtils.js*.
1. Open *claimUtils.js* and add the following code snippet:

    ```javascript
    /**
     * Populate claims table with appropriate description
     * @param {Object} claims ID token claims
     * @returns claimsObject
     */
    const createClaimsTable = (claims) => {
        let claimsObj = {};
        let index = 0;
    
        Object.keys(claims).forEach((key) => {
            if (typeof claims[key] !== 'string' && typeof claims[key] !== 'number') return;
            switch (key) {
                case 'aud':
                    populateClaim(
                        key,
                        claims[key],
                        "Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Azure portal.",
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'iss':
                    populateClaim(
                        key,
                        claims[key],
                        'Identifies the issuer, or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI will end in /v2.0. The GUID that indicates that the user is a consumer user from a Microsoft account is 9188040d-6c67-4c5b-b112-36a304b66dad.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'iat':
                    populateClaim(
                        key,
                        changeDateFormat(claims[key]),
                        'Issued At indicates when the authentication for this token occurred.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'nbf':
                    populateClaim(
                        key,
                        changeDateFormat(claims[key]),
                        'The nbf (not before) claim identifies the time (as UNIX timestamp) before which the JWT must not be accepted for processing.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'exp':
                    populateClaim(
                        key,
                        changeDateFormat(claims[key]),
                        "The exp (expiration time) claim identifies the expiration time (as UNIX timestamp) on or after which the JWT must not be accepted for processing. It's important to note that in certain circumstances, a resource may reject the token before this time. For example, if a change in authentication is required or a token revocation has been detected.",
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'name':
                    populateClaim(
                        key,
                        claims[key],
                        "The principal about which the token asserts information, such as the user of an application. This value is immutable and can't be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource. By default, the subject claim is populated with the object ID of the user in the directory",
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'preferred_username':
                    populateClaim(
                        key,
                        claims[key],
                        'The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it is mutable, this value must not be used to make authorization decisions. It can be used for username hints, however, and in human-readable UI as a username. The profile scope is required in order to receive this claim.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'nonce':
                    populateClaim(
                        key,
                        claims[key],
                        'The nonce matches the parameter included in the original /authorize request to the IDP. If it does not match, your application should reject the token.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'oid':
                    populateClaim(
                        key,
                        claims[key],
                        'The oid (user’s object id) is the only claim that should be used to uniquely identify a user in an Azure AD tenant. The token might have one or more of the following claim, that might seem like a unique identifier, but is not and should not be used as such.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'tid':
                    populateClaim(
                        key,
                        claims[key],
                        'The tenant ID. You will use this claim to ensure that only users from the current Azure AD tenant can access this app.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'upn':
                    populateClaim(
                        key,
                        claims[key],
                        '(user principal name) – might be unique amongst the active set of users in a tenant but tend to get reassigned to new employees as employees leave the organization and others take their place or might change to reflect a personal change like marriage.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'email':
                    populateClaim(
                        key,
                        claims[key],
                        'Email might be unique amongst the active set of users in a tenant but tend to get reassigned to new employees as employees leave the organization and others take their place.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'acct':
                    populateClaim(
                        key,
                        claims[key],
                        'Available as an optional claim, it lets you know what the type of user (homed, guest) is. For example, for an individual’s access to their data you might not care for this claim, but you would use this along with tenant id (tid) to control access to say a company-wide dashboard to just employees (homed users) and not contractors (guest users).',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'sid':
                    populateClaim(key, claims[key], 'Session ID, used for per-session user sign-out.', index, claimsObj);
                    index++;
                    break;
                case 'sub':
                    populateClaim(
                        key,
                        claims[key],
                        'The sub claim is a pairwise identifier - it is unique to a particular application ID. If a single user signs into two different apps using two different client IDs, those apps will receive two different values for the subject claim.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'ver':
                    populateClaim(
                        key,
                        claims[key],
                        'Version of the token issued by the Microsoft identity platform',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'auth_time':
                    populateClaim(
                        key,
                        claims[key],
                        'The time at which a user last entered credentials, represented in epoch time. There is no discrimination between that authentication being a fresh sign-in, a single sign-on (SSO) session, or another sign-in type.',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'at_hash':
                    populateClaim(
                        key,
                        claims[key],
                        'An access token hash included in an ID token only when the token is issued together with an OAuth 2.0 access token. An access token hash can be used to validate the authenticity of an access token',
                        index,
                        claimsObj
                    );
                    index++;
                    break;
                case 'uti':
                case 'rh':
                    index++;
                    break;
                default:
                    populateClaim(key, claims[key], '', index, claimsObj);
                    index++;
            }
        });
    
        return claimsObj;
    };
    
    /**
     * Populates claim, description, and value into an claimsObject
     * @param {string} claim
     * @param {string} value
     * @param {string} description
     * @param {number} index
     * @param {Object} claimsObject
     */
    const populateClaim = (claim, value, description, index, claimsObject) => {
        let claimsArray = [];
        claimsArray[0] = claim;
        claimsArray[1] = value;
        claimsArray[2] = description;
        claimsObject[index] = claimsArray;
    };
    
    /**
     * Transforms Unix timestamp to date and returns a string value of that date
     * @param {string} date Unix timestamp
     * @returns
     */
    const changeDateFormat = (date) => {
        let dateObj = new Date(date * 1000);
        return `${date} - [${dateObj.toString()}]`;
    };
    ```

1. Save the file.

## Next steps

> [!div class="nextstepaction"]
> [Configure a Single-page application User Interface and Sign-In](how-to-single-page-app-vanillajs-sign-in-sign-out.md)
