---
title: Initialize MSAL.js client apps | Azure
titleSuffix: Microsoft identity platform
description: Learn about initializing client applications using the Microsoft Authentication Library for JavaScript (MSAL.js).
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/21/2020
ms.author: marsma
ms.reviewer: saeeda
ms.custom: aaddev
# Customer intent: As an application developer, I want to learn about initializing a client application in MSAL.js to
# enable support for authentication and authorization in a JavaScript "user-agent" application.
---

# Initialize client applications using MSAL.js

This article describes initializing Microsoft Authentication Library for JavaScript (MSAL.js) with an instance of a user-agent application.

The user-agent application is a form of public client application in which the client code is executed in a user-agent such as a web browser. Such clients do not store secrets because the browser context is openly accessible.

To learn more about the client application types and application configuration options, see [Public and confidential client apps in MSAL](msal-client-applications.md).

## Prerequisites

Before initializing an application, you first need to [register it with the Azure portal](scenario-spa-app-registration.md), establishing a trust relationship between your application and the Microsoft identity platform.

After registering your app, you'll need some or all of the following values that can be found in the Azure portal.

- **Application (client) ID**, a GUID that uniquely identifies your application within the Microsoft identity platform.
- **Authority**, which is the identity provider URL (the *instance*) and the *sign-in audience* for your application. The instance and sign-in audience, when concatenated, make up the *authority*.
- **Directory (tenant) ID** if you're building a line-of-business application solely for your organization, often referred to as a *single-tenant application*.
- **Redirect URI** if you're building a web app. The `redirectUri` specifies where the identity provider (the Microsoft identity platform) should return the security tokens it has issued.

## Initializing applications

You can use MSAL.js as follows in a plain JavaScript/Typescript application. Initialize the MSAL authentication context by instantiating a `UserAgentApplication` with a configuration object. The minimum required config to initialize MSAL.js is the `clientID` of your application, shown as the **Application (client) ID** on the **Overview** page of the app registration in the Azure portal.

For authentication methods with redirect flows (`loginRedirect` and `acquireTokenRedirect`) in MSAL.js 1.2.x or earlier, you must explicitly register a callback for success or error through the `handleRedirectCallback()` method. Explicitly registering the callback is required in MSAL.js 1.2.x and earlier because redirect flows do not return promises like the methods with a pop-up experience do. Registering the callback is optional in MSAL.js version 1.3.x and later.

```javascript
const msalConfig = {
    auth: {
        clientId: "enter_client_id_here",
        authority: "https://login.microsoftonline.com/common",
        knownAuthorities: [],
        redirectUri: "enter_redirect_uri_here",
        postLogoutRedirectUri: "enter_postlogout_uri_here",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
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
            piiLoggingEnabled: false
        },
        windowHashTimeout: 60000,
        iframeHashTimeout: 6000,
        loadFrameTimeout: 0
    };
}

// Create an instance of PublicClientApplication
const msalInstance = new PublicClientApplication(msalConfig);

// Register a redirect callback for Success or Error (when using redirect methods)
// **Required** in MSAL.js 1.2.x and earlier
// **Optional** in MSAL.js 1.3.x and later
function authCallback(error, response) {
    // Handle redirect response in this callback
}

msalInstance.handleRedirectCallback(authCallback);
```

MSAL.js is designed to have a single instance and configuration of the [`PublicClientApplication`][msal-js-publicclientapplication] to represent a single authentication context. Multiple instances are not recommended because they cause conflicting cache entries and behavior in the browser.

## Configuration options

The MSAL.js [`Configuration`][msal-js-configuration] object provides several configurable options for use in instantiating the [`PublicClientApplication`][msal-js-publicclientapplication].

For more information, see the MSAL.js API reference documentation for these types:

- [`PublicClientApplication`][msal-js-publicclientapplication] in [`msal-browser`][msal-browser]
- [`Configuration`][msal-js-configuration] in [`msal-core`][msal-core]

## Next steps

This code sample on GitHub demonstrates instantiation of a PublicClientApplication with a Configuration object:

[Azure-Samples/ms-identity-javascript-v2](https://github.com/Azure-Samples/ms-identity-javascript-v2)

[msal-browser]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/
[msal-core]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-core/
[msal-js-configuration]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-core/modules/_configuration_.html
[msal-js-publicclientapplication]: https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/classes/_app_publicclientapplication_.publicclientapplication.html