---
title: Handle errors and exceptions in MSAL.js
description: Learn how to handle errors and exceptions, Conditional Access claims challenges, and retries in MSAL.js applications.
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/26/2020
ms.author: dmwendia
ms.reviewer: saeeda, hahamil
ms.custom: aaddev, devx-track-js
---
# Handle errors and exceptions in MSAL.js

[!INCLUDE [Active directory error handling introduction](./includes/error-handling-and-tips/error-handling-introduction.md)]

## Error handling in MSAL.js

MSAL.js provides error objects that abstract and classify the different types of common errors. It also provides an interface to access specific details of the errors such as error messages to handle them appropriately.

### Error object

```javascript
export class AuthError extends Error {
    // This is a short code describing the error
    errorCode: string;
    // This is a descriptive string of the error,
    // and may also contain the mitigation strategy
    errorMessage: string;
    // Name of the error class
    this.name = "AuthError";
}
```

By extending the error class, you have access to the following properties:
- `AuthError.message`:  Same as the `errorMessage`.
- `AuthError.stack`: Stack trace for thrown errors.

### Error types

The following error types are available:

- `AuthError`: Base error class for the MSAL.js library, also used for unexpected errors.

- `ClientAuthError`: Error class which denotes an issue with Client authentication. Most errors that come from the library are ClientAuthErrors. These errors result from things like calling a login method when login is already in progress, the user cancels the login, and so on.

- `ClientConfigurationError`: Error class, extends `ClientAuthError` thrown before requests are made when the given user config parameters are malformed or missing.

- `ServerError`: Error class, represents the error strings sent by the authentication server. These errors may be invalid request formats or parameters, or any other errors that prevent the server from authenticating or authorizing the user.

- `InteractionRequiredAuthError`: Error class, extends `ServerError` to represent server errors, which require an interactive call. This error is thrown by `acquireTokenSilent` if the user is required to interact with the server to provide credentials or consent for authentication/authorization. Error codes include `"interaction_required"`, `"login_required"`, and `"consent_required"`.

For error handling in authentication flows with redirect methods (`loginRedirect`, `acquireTokenRedirect`), you'll need to handle the redirect promise, which is called with success or failure after the redirect using the `handleRedirectPromise()` method as follows:

```javascript
const msal = require('@azure/msal-browser');
const myMSALObj = new msal.PublicClientApplication(msalConfig);

// Register Callbacks for redirect flow
myMSALObj.handleRedirectPromise()
    .then(function (response) {
        //success response
    })
    .catch((error) => {
        console.log(error);
    })
myMSALObj.acquireTokenRedirect(request);
```

The methods for pop-up experience (`loginPopup`, `acquireTokenPopup`) return promises, so you can use the promise pattern (`.then` and `.catch`) to handle them as shown:

```javascript
myMSALObj.acquireTokenPopup(request).then(
    function (response) {
        // success response
    }).catch(function (error) {
        console.log(error);
    });
```

### Errors that require interaction

An error is returned when you attempt to use a non-interactive method of acquiring a token such as `acquireTokenSilent`, but MSAL couldn't do it silently.

Possible reasons are:

- you need to sign in
- you need to consent
- you need to go through a multi-factor authentication experience.

The remediation is to call an interactive method such as `acquireTokenPopup` or `acquireTokenRedirect`:

```javascript
// Request for Access Token
myMSALObj.acquireTokenSilent(request).then(function (response) {
    // call API
}).catch( function (error) {
    // call acquireTokenPopup in case of acquireTokenSilent failure
    // due to interaction required
    if (error instanceof InteractionRequiredAuthError) {
        myMSALObj.acquireTokenPopup(request).then(
            function (response) {
                // call API
            }).catch(function (error) {
                console.log(error);
            });
    }
});
```

[!INCLUDE [Active directory error handling claims challenges](./includes/error-handling-and-tips/error-handling-claims-challenges.md)]

When getting tokens silently (using `acquireTokenSilent`) using MSAL.js, your application may receive errors when a [Conditional Access claims challenge](v2-conditional-access-dev-guide.md) such as MFA policy is required by an API you're trying to access.

The pattern to handle this error is to make an interactive call to acquire token in MSAL.js such as `acquireTokenPopup` or `acquireTokenRedirect` as in the following example:

```javascript
myMSALObj.acquireTokenSilent(accessTokenRequest).then(function(accessTokenResponse) {
    // call API
}).catch(function(error) {
    if (error instanceof InteractionRequiredAuthError) {
    
        // extract, if exists, claims from the error object
        if (error.claims) {
            accessTokenRequest.claims = error.claims,
        
        // call acquireTokenPopup in case of InteractionRequiredAuthError failure
        myMSALObj.acquireTokenPopup(accessTokenRequest).then(function(accessTokenResponse) {
            // call API
        }).catch(function(error) {
            console.log(error);
        });
    }
});
```

Interactively acquiring the token prompts the user and gives them the opportunity to satisfy the required Conditional Access policy.

When calling an API requiring Conditional Access, you can receive a claims challenge in the error from the API. In this case, you can pass the claims returned in the error to the `claims` parameter in the [access token request object](msal-js-pass-custom-state-authentication-request.md) to satisfy the appropriate policy. 

See [How to use Continuous Access Evaluation enabled APIs in your applications](./app-resilience-continuous-access-evaluation.md) for more detail.

### Using other frameworks

Using toolkits like Tauri for registered single page applications (SPAs) with the identity platform are not recognized for production apps. SPAs only support URLs that start with `https` for production apps and `http://localhost` for local development. Prefixes like `tauri://localhost` cannot be used for browser apps. This format can only be supported for mobile or web apps as they have a confidential component unlike browser apps.

[!INCLUDE [Active directory error handling retries](./includes/error-handling-and-tips/error-handling-retries.md)]

## Next steps

Consider enabling [Logging in MSAL.js](msal-logging-js.md) to help you diagnose and debug issues
