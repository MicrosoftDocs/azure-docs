---
title: "Migrate your JavaScript application from ADAL.js to MSAL.js"
description: How to update your existing JavaScript application to use the Microsoft Authentication Library (MSAL) for authentication and authorization instead of the Active Directory Authentication Library (ADAL).
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 07/06/2021
ms.author: owenrichards
ms.custom: has-adal-ref
#Customer intent: As an application developer, I want to learn how to change the code in my JavaScript application from using ADAL.js as its authentication library to MSAL.js.
---

# How to migrate a JavaScript app from ADAL.js to MSAL.js

[Microsoft Authentication Library for JavaScript](https://github.com/AzureAD/microsoft-authentication-library-for-js) (MSAL.js, also known as *msal-browser*) 2.x is the authentication library we recommend using with JavaScript applications on the Microsoft identity platform. This article highlights the changes you need to make to migrate an app that uses the ADAL.js to use MSAL.js 2.x

> [!NOTE]
> We strongly recommend MSAL.js 2.x over MSAL.js 1.x. The auth code grant flow is more secure and allows single-page applications to maintain a good user experience despite the privacy measures browsers like Safari have implemented to block 3rd party cookies, among other benefits.

## Prerequisites

- You must set the **Platform** / **Reply URL Type** to **Single-page application** on App Registration portal (if you have other platforms added in your app registration, such as **Web**, you need to make sure the redirect URIs do not overlap. See: [Redirect URI restrictions](./reply-url.md))
- You must provide [polyfills](./msal-js-use-ie-browser.md) for ES6 features that MSAL.js relies on (e.g. promises) in order to run your apps on **Internet Explorer**
- Make sure you have migrated your Azure AD apps to [v2 endpoint](azure-ad-endpoint-comparison.md) if you haven't already

## Install and import MSAL

There are two ways to install the MSAL.js 2.x library:

### Via NPM:

```console
npm install @azure/msal-browser
```

Then, depending on your module system, import it as shown below:

```javascript
import * as msal from "@azure/msal-browser"; // ESM

const msal = require('@azure/msal-browser'); // CommonJS
```

### Via CDN:

Load the script in the header section of your HTML document:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="https://alcdn.msauth.net/browser/2.14.2/js/msal-browser.min.js"></script>
  </head>
</html>
```

For alternative CDN links and best practices when using CDN, see: [CDN Usage](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/cdn-usage.md)

## Initialize MSAL

In ADAL.js, you instantiate the [AuthenticationContext](https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/Config-authentication-context#authenticationcontext) class, which then exposes the methods you can use to achieve authentication (`login`, `acquireTokenPopup` etc.). This object serves as the representation of your application's connection to the authorization server or identity provider. When initializing, the only mandatory parameter is the **clientId**:

```javascript
window.config = {
  clientId: "YOUR_CLIENT_ID"
};

var authContext = new AuthenticationContext(config);
```

In MSAL.js, you instantiate the [PublicClientApplication](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_browser.publicclientapplication.html) class instead. Like ADAL.js, the constructor expects a [configuration object](#configure-msal) that contains the `clientId` parameter at minimum. See for more: [Initialize MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md)

```javascript
const msalConfig = {
  auth: {
      clientId: 'YOUR_CLIENT_ID'
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
```

In both ADAL.js and MSAL.js, the authority URI defaults to `https://login.microsoftonline.com/common` if you do not specify it.

> [!NOTE]
> If you use the `https://login.microsoftonline.com/common` authority in v2.0, you will allow users to sign in with any Azure AD organization or a personal Microsoft account (MSA). In MSAL.js, if you want to restrict login to any Azure AD account (same behavior as with ADAL.js), use `https://login.microsoftonline.com/organizations` instead.

## Configure MSAL

Some of the [configuration options in ADAL.js](https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/Config-authentication-context) that are used when initializing [AuthenticationContext](https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/Config-authentication-context#authenticationcontext) are deprecated in MSAL.js, while some new ones are introduced. See the [full list of available options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md). Importantly, many of these options, except for `clientId`, can be overridden during token acquisition, allowing you to set them on a *per-request* basis. For instance, you can use a different **authority URI** or **redirect URI** than the one you set during initialization when acquiring tokens.

Additionally, you no longer need to specify the login experience (that is, whether using pop-up windows or redirecting the page) via the configuration options. Instead, `MSAL.js` exposes `loginPopup` and `loginRedirect` methods through the `PublicClientApplication` instance.

## Enable logging

In ADAL.js, you configure logging separately at any place in your code:

```javascript
window.config = {
  clientId: "YOUR_CLIENT_ID"
};

var authContext = new AuthenticationContext(config);

var Logging = {
  level: 3,
  log: function (message) {
      console.log(message);
  },
  piiLoggingEnabled: false
};


authContext.log(Logging)
```

In MSAL.js, logging is part of the configuration options and is created during the initialization of `PublicClientApplication`:

```javascript
const msalConfig = {
  auth: {
      // authentication related parameters
  },
  cache: {
      // cache related parameters
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
}

const msalInstance = new msal.PublicClientApplication(msalConfig);
```

## Switch to MSAL API

Some of the public methods in ADAL.js have equivalents in MSAL.js:

| ADAL                                | MSAL                              | Notes                                        |
|-------------------------------------|-----------------------------------|----------------------------------------------|
| `acquireToken`                      | `acquireTokenSilent`              | Renamed and now expects an [account](https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#accountinfo) object |
| `acquireTokenPopup`                 | `acquireTokenPopup`               | Now async and returns a promise              |
| `acquireTokenRedirect`              | `acquireTokenRedirect`            | Now async and returns a promise              |
| `handleWindowCallback`              | `handleRedirectPromise`           | Needed if using redirect experience          |
| `getCachedUser`                     | `getAllAccounts`                  | Renamed and now returns an array of accounts.|

Others were deprecated, while MSAL.js offers new methods:

| ADAL                              | MSAL                            | Notes                                            |
|-----------------------------------|---------------------------------|--------------------------------------------------|
| `login`                           | N/A                             | Deprecated. Use `loginPopup` or `loginRedirect`  |
| `logOut`                          | N/A                             | Deprecated. Use `logoutPopup` or `logoutRedirect`|
| N/A                               | `loginPopup`                    |                                                  |
| N/A                               | `loginRedirect`                 |                                                  |
| N/A                               | `logoutPopup`                   |                                                  |
| N/A                               | `logoutRedirect`                |                                                  |
| N/A                               | `getAccountByHomeId`            | Filters accounts by home ID (oid + tenant ID)    |
| N/A                               | `getAccountLocalId`             | Filters accounts by local ID (useful for ADFS)   |
| N/A                               | `getAccountUsername`            | Filters accounts by username (if exists)         |

In addition, as MSAL.js is implemented in TypeScript unlike ADAL.js, it exposes various types and interfaces that you can make use of in your projects. See the [MSAL.js API reference](https://azuread.github.io/microsoft-authentication-library-for-js/ref/) for more.

## Use scopes instead of resources

An important difference between the Azure AD **v1.0** vs. **v2.0** endpoints is about how the resources are accessed. When using ADAL.js with the **v1.0** endpoint, you would first register a permission on app registration portal, and then request an access token for a resource (such as Microsoft Graph) as shown below:

```javascript
authContext.acquireTokenRedirect("https://graph.microsoft.com", function (error, token) {
  // do something with the access token
});
```

MSAL.js supports both **v1.0** and **v2.0** endpoints. The **v2.0** endpoint employs a *scope-centric* model to access resources. Thus, when you request an access token for a resource, you also need to specify the scope for that resource:

```javascript
msalInstance.acquireTokenRedirect({
  scopes: ["https://graph.microsoft.com/User.Read"]
});
```

One advantage of the scope-centric model is the ability to use *dynamic scopes*. When building applications using the v1.0 endpoint, you needed to register the full set of permissions (called *static scopes*) required by the application for the user to consent to at the time of login. In v2.0, you can use the scope parameter to request the permissions at the time you want them (hence, *dynamic scopes*). This allows the user to provide **incremental consent** to scopes. So if at the beginning you just want the user to sign in to your application and you don’t need any kind of access, you can do so. If later you need the ability to read the calendar of the user, you can then request the calendar scope in the acquireToken methods and get the user's consent. See for more: [Resources and scopes](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md)

## Use promises instead of callbacks

In ADAL.js, callbacks are used for any operation after the authentication succeeds and a response is obtained:

```javascript
authContext.acquireTokenPopup(resource, extraQueryParameter, claims, function (error, token) {
  // do something with the access token
});
```

In MSAL.js, promises are used instead:

```javascript
msalInstance.acquireTokenPopup({
      scopes: ["User.Read"] // shorthand for https://graph.microsoft.com/User.Read
  }).then((response) => {
      // do something with the auth response
  }).catch((error) => {
      // handle errors
  });
```

You can also use the **async/await** syntax that comes with ES8:

```javascript
const getAccessToken = async() => {
  try {
      const authResponse = await msalInstance.acquireTokenPopup({
          scopes: ["User.Read"]
      });
  } catch (error) {
      // handle errors
  }
}
```

## Cache and retrieve tokens

Like ADAL.js, MSAL.js caches tokens and other authentication artifacts in browser storage, using the [Web Storage API](https://developer.mozilla.org/docs/Web/API/Web_Storage_API). You are recommended to use `sessionStorage` option (see: [configuration](#configure-msal)) because it is more secure in storing tokens that are acquired by your users, but `localStorage` will give you [Single Sign On](./msal-js-sso.md) across tabs and user sessions.

Importantly, you are not supposed to access the cache directly. Instead, you should use an appropriate MSAL.js API for retrieving authentication artifacts like access tokens or user accounts.

## Renew tokens with refresh tokens

ADAL.js uses the [OAuth 2.0 implicit flow](./v2-oauth2-implicit-grant-flow.md), which does not return refresh tokens for security reasons (refresh tokens have longer lifetime than access tokens and are therefore more dangerous in the hands of malicious actors). Hence, ADAL.js performs token renewal using a hidden Iframe so that the user is not repeatedly prompted to authenticate.

With the auth code flow with PKCE support, apps using MSAL.js 2.x obtain refresh tokens along with ID and access tokens, which can be used to renew them. The usage of refresh tokens is abstracted away, and the developers are not supposed to build logic around them. Instead, MSAL manages token renewal using refresh tokens by itself. Your previous token cache with ADAL.js will not be transferable to MSAL.js, as the token cache schema has changed and incompatible with the schema used in ADAL.js.

## Handle errors and exceptions

When using MSAL.js, the most common type of error you might face is the `interaction_in_progress` error. This error is thrown when an interactive API (`loginPopup`, `loginRedirect`, `acquireTokenPopup`, `acquireTokenRedirect`) is invoked while another interactive API is still in progress. The `login*` and `acquireToken*` APIs are *async* so you will need to ensure that the resulting promises have resolved before invoking another one.

Another common error is `interaction_required`. This error is often resolved by simply initiating an interactive token acquisition prompt. For instance, the web API you are trying to access might have a [conditional access](../conditional-access/overview.md) policy in place, requiring the user to perform [multifactor authentication](../authentication/concept-mfa-howitworks.md) (MFA). In that case, handling `interaction_required` error by triggering `acquireTokenPopup` or `acquireTokenRedirect` will prompt the user for MFA, allowing them to fullfil it.

Yet another common error you might face is `consent_required`, which occurs when permissions required for obtaining an access token for a protected resource are not consented by the user. As in `interaction_required`, the solution for `consent_required` error is often initiating an interactive token acquisition prompt, using either `acquireTokenPopup` or `acquireTokenRedirect`.

See for more: [Common MSAL.js errors and how to handle them](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/errors.md)

## Use the Events API

MSAL.js (>=v2.4) introduces an events API that you can make use of in your apps. These events are related to the authentication process and what MSAL is doing at any moment, and can be used to update UI, show error messages, check if any interaction is in progress and so on. For instance, below is an event callback that will be called when login process fails for any reason:

```javascript
const callbackId = msalInstance.addEventCallback((message) => {
  // Update UI or interact with EventMessage here
  if (message.eventType === EventType.LOGIN_FAILURE) {
      if (message.error instanceof AuthError) {
          // Do something with the error
      }
    }
});
```

For performance, it is important to unregister event callbacks when they are no longer needed. See for more: [MSAL.js Events API](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/events.md)

## Handle multiple accounts

ADAL.js has the concept of a *user* to represent the currently authenticated entity. MSAL.js replaces *users* with *accounts*, given the fact that a user can have more than one account associated with her. This also means that you now need to control for multiple accounts and choose the appropriate one to work with. The snippet below illustrates this process:

```javascript
let homeAccountId = null; // Initialize global accountId (can also be localAccountId or username) used for account lookup later, ideally stored in app state

// This callback is passed into `acquireTokenPopup` and `acquireTokenRedirect` to handle the interactive auth response
function handleResponse(resp) {
  if (resp !== null) {
      homeAccountId = resp.account.homeAccountId; // alternatively: resp.account.homeAccountId or resp.account.username
  } else {
      const currentAccounts = myMSALObj.getAllAccounts();
      if (currentAccounts.length < 1) { // No cached accounts
          return;
      } else if (currentAccounts.length > 1) { // Multiple account scenario
          // Add account selection logic here
      } else if (currentAccounts.length === 1) {
          homeAccountId = currentAccounts[0].homeAccountId; // Single account scenario
      }
  }
}
```

For more information, see: [Accounts in MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/accounts.md)

## Use the wrappers libraries

If you are developing for Angular and React frameworks, you can use [MSAL Angular v2](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular) and [MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react), respectively. These wrappers expose the same public API as MSAL.js while offering framework-specific methods and components that can streamline the authentication and token acquisition processes.

## Run the app

Once your changes are done, run the app and test your authentication scenario:

```console
npm start
```

## Example: Securing web apps with ADAL Node vs. MSAL Node

The snippets below demonstrates the minimal code required for a single-page application authenticating users with the Microsoft identity platform and getting an access token for Microsoft Graph using first ADAL.js and then MSAL.js:

<table>
<tr><td> Using ADAL.js </td><td> Using MSAL.js </td></tr>
<tr>
<td>

```html

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script
    type="text/javascript"
    src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.18/js/adal.min.js">
  </script>
</head>

<div>
  <button id="loginButton">Login</button>
  <button id="logoutButton" style="visibility: hidden;">Logout</button>
  <button id="tokenButton" style="visibility: hidden;">Get Token</button>
</div>

<body>
  <script>

    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const tokenButton = document.getElementById("tokenButton");

    var authContext = new AuthenticationContext({
        instance: 'https://login.microsoftonline.com/',
        clientId: "ENTER_CLIENT_ID",
        tenant: "ENTER_TENANT_ID",
        cacheLocation: "sessionStorage",
        redirectUri: "http://localhost:3000",
        popUp: true,
        callback: function (errorDesc, token, error, tokenType) {
            console.log('Hello ' + authContext.getCachedUser().profile.upn)

            loginButton.style.visibility = "hidden";
            logoutButton.style.visibility = "visible";
            tokenButton.style.visibility = "visible";
        }
    });

    authContext.log({
        level: 3,
        log: function (message) {
            console.log(message);
        },
        piiLoggingEnabled: false
    });

    loginButton.addEventListener('click', function () {
        authContext.login();
    });

    logoutButton.addEventListener('click', function () {
        authContext.logOut();
    });

    tokenButton.addEventListener('click', () => {
        authContext.acquireTokenPopup(
            "https://graph.microsoft.com",
            null, null,
            function (error, token) {
                console.log(error, token);
            }
        )
    });
  </script>
</body>

</html>

```

</td>
<td>

```html

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script
    type="text/javascript"
    src="https://alcdn.msauth.net/browser/2.14.2/js/msal-browser.min.js">
  </script>
</head>

<div>
  <button id="loginButton">Login</button>
  <button id="logoutButton" style="visibility: hidden;">Logout</button>
  <button id="tokenButton" style="visibility: hidden;">Get Token</button>
</div>

<body>
  <script>
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const tokenButton = document.getElementById("tokenButton");

    const pca = new msal.PublicClientApplication({
        auth: {
            clientId: "ENTER_CLIENT_ID",
            authority: "https://login.microsoftonline.com/ENTER_TENANT_ID",
            redirectUri: "http://localhost:3000",
        },
        cache: {
            cacheLocation: "sessionStorage"
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
    });

    loginButton.addEventListener('click', () => {
        pca.loginPopup().then((response) => {
            console.log(`Hello ${response.account.username}!`);

            loginButton.style.visibility = "hidden";
            logoutButton.style.visibility = "visible";
            tokenButton.style.visibility = "visible";
        })
    });

    logoutButton.addEventListener('click', () => {
        pca.logoutPopup().then((response) => {
            window.location.reload();
        })
    });

    tokenButton.addEventListener('click', () => {
        pca.acquireTokenPopup({
            scopes: ["User.Read"]
        }).then((response) => {
            console.log(response);
        })
    });
  </script>
</body>

</html>

```

</td>
</tr>
</table>

## Next steps

- [MSAL.js API reference](https://azuread.github.io/microsoft-authentication-library-for-js/ref/)
- [MSAL.js code samples](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples)
