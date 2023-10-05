---
title: Initialize MSAL.js client apps
description: Learn about initializing client applications using the Microsoft Authentication Library for JavaScript (MSAL.js).
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/16/2023
ms.author: owenrichards
ms.reviewer: saeeda
ms.custom: aaddev, devx-track-js, engagement-fy23
# Customer intent: As an application developer, I want to learn about initializing a client application in MSAL.js to enable support for authentication and authorization in a JavaScript single-page application (SPA).
---

# Initialize client applications using MSAL.js

This article describes initializing the Microsoft Authentication Library for JavaScript (MSAL.js) with an instance of a user-agent application.

The user-agent application is a form of public client application in which the client code is executed in a user-agent such as a web browser. Clients such as these don't store secrets because the browser context is openly accessible.

To learn more about the client application types and application configuration options, see [Public and confidential client apps in MSAL](msal-client-applications.md).

## Prerequisites

Before initializing an application, you first need to [register it in the Microsoft Entra admin center](scenario-spa-app-registration.md), establishing a trust relationship between your application and the Microsoft identity platform.

After registering your app, you'll need some or all of the following values that can be found in the Microsoft Entra admin center.

| Value                   | Required | Description                                                                                                                                                                |
| :---------------------- | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application (client) ID | Required | A GUID that uniquely identifies your application within the Microsoft identity platform.                                                                                   |
| Authority               | Optional | The identity provider URL (the _instance_) and the _sign-in audience_ for your application. The instance and sign-in audience, when concatenated, make up the _authority_. |
| Directory (tenant) ID   | Optional | Specify Directory (tenant) ID if you're building a line-of-business application solely for your organization, often referred to as a _single-tenant application_.          |
| Redirect URI            | Optional | If you're building a web app, the `redirectUri` specifies where the identity provider (the Microsoft identity platform) should return the security tokens it has issued.   |

## Initialize MSAL.js 2.x apps

Initialize the MSAL.js authentication context by instantiating a [PublicClientApplication][msal-js-publicclientapplication] with a [Configuration][msal-js-configuration] object. The minimum required configuration property is the `clientID` of the application, shown as **Application (client) ID** on the **Overview** page of the app registration in the Microsoft Entra admin center.

Here's an example configuration object and instantiation of a `PublicClientApplication`:

```javascript
const msalConfig = {
  auth: {
    clientId: "Enter_the_Application_Id_Here",
    authority: "https://login.microsoftonline.com/Enter_the_Tenant_Info_Here",
    knownAuthorities: [],
    redirectUri: "https://localhost:{port}/redirect",
    postLogoutRedirectUri: "https://localhost:{port}/redirect",
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean
      ): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
  },
};

// Create an instance of PublicClientApplication
const msalInstance = new PublicClientApplication(msalConfig);

// Handle the redirect flows
msalInstance
  .handleRedirectPromise()
  .then((tokenResponse) => {
    // Handle redirect response
  })
  .catch((error) => {
    // Handle redirect error
  });
```

### `handleRedirectPromise`

Invoke [handleRedirectPromise][msal-js-handleredirectpromise] when the application uses redirect flows. When using redirect flows, `handleRedirectPromise` should be run on every page load.

Three outcomes are possible from the promise:

- `.then` is invoked and `tokenResponse` is truthy: The application is returning from a redirect operation that was successful.
- `.then` is invoked and `tokenResponse` is falsy (`null`): The application isn't returning from a redirect operation.
- `.catch` is invoked: The application is returning from a redirect operation and there was an error.

## Initialize MSAL.js 1.x apps

Initialize the MSAL 1.x authentication context by instantiating a UserAgentApplication with a configuration object. The minimum required configuration property is the `clientID` of your application, shown as **Application (client) ID** on the **Overview** page of the app registration in the Microsoft Entra admin center.

For authentication methods with redirect flows (loginRedirect and acquireTokenRedirect) in MSAL.js 1.2.x or earlier, you must explicitly register a callback for success or error through the `handleRedirectCallback()` method. Explicitly registering the callback is required in MSAL.js 1.2.x and earlier because redirect flows don't return promises like the methods with a pop-up experience do. Registering the callback is _optional_ in MSAL.js version 1.3.x and later.

```javascript
// Configuration object constructed
const msalConfig = {
  auth: {
    clientId: "Enter_the_Application_Id_Here",
  },
};

// Create UserAgentApplication instance
const msalInstance = new UserAgentApplication(msalConfig);

function authCallback(error, response) {
  // Handle redirect response
}

// Register a redirect callback for Success or Error (when using redirect methods)
// **REQUIRED** in MSAL.js 1.2.x and earlier
// **OPTIONAL** in MSAL.js 1.3.x and later
msalInstance.handleRedirectCallback(authCallback);
```

## Single instance and configuration

Both MSAL.js 1.x and 2.x are designed to have a single instance and configuration of the `UserAgentApplication` or `PublicClientApplication`, respectively, to represent a single authentication context.

Multiple instances of `UserAgentApplication` or `PublicClientApplication` aren't recommended as they can cause conflicting cache entries and behavior in the browser.

## Next steps

The MSAL.js 2.x code sample on GitHub demonstrates instantiation of a [PublicClientApplication][msal-js-publicclientapplication] with a [Configuration][msal-js-configuration] object:

[Azure-Samples/ms-identity-javascript-v2](https://github.com/Azure-Samples/ms-identity-javascript-v2)

<!-- LINKS - External -->

[msal-browser]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/
[msal-core]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-core/
[msal-js-configuration]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_browser.PublicClientApplication.html#constructor
[msal-js-handleredirectpromise]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.PublicClientApplication.html#handleredirectpromise 
[msal-js-publicclientapplication]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.PublicClientApplication.html
