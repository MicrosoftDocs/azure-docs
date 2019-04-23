---
title: Initialize client applications (MSAL.js) | Azure
description: Learn about initializing public client and confidential client applications using the Microsoft Authentication Library for JavaScript (MSAL.js). 
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/12/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about initializing client applications so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Initializing client applications using MSAL.js
This article describes initializing user agent applications, a form of public client applications, using Microsoft Authentication Library for JavaScript (MSAL.js).  To learn more about the client application types and application configuration options, read the [overview](msal-client-applications.md).

## Pre-requisites
Before initializing an application, you first need to [register it](quickstart-v2-javascript.md) so that your app can be integrated with the Microsoft identity platform. As part of the registration, you will also need to add the Web platform and check the **Implicit Flow** checkbox.  After registration, you may need the following information (which can be found in the Azure portal):

- The client ID (a string representing a GUID)
- The identity provider URL (named the instance) and the sign-in audience for your application. These two parameters are collectively known as the authority.
- The tenant ID if you are writing a line-of-business application solely for your organization (also named single-tenant application).
- The application secret (client secret string) or certificate (of type X509 certificate) if it's a confidential client app.
- For web apps, and sometimes for public client apps (in particular when your app needs to use a broker), you'll have also set the redirectUri where the identity provider will contact back your application with the security tokens.

## Initializing applications

You can use MSAL.js as follows in a plain JavaScript/Typescript application. Initialize MSAL authentication context by instantiating `UserAgentApplication`. The minimum required config to initialize MSAL is client ID.

```javascript
var userAgentApplication = new Msal.UserAgentApplication(clientId, authority, tokenReceivedCallBack);
```

MSAL.js is designed to have a single instance and configuration of the `UserAgentApplication` to represent a single authentication context. Multiple instances are not recommended as they cause conflicting cache entries and behavior in the browser.

- clientID: The clientID of your application, you should get this from the application registration portal.

- authority: A URL indicating a directory that MSAL can request tokens from. In Azure AD, it is of the form https://&lt;instance&gt;/&lt;tenant&gt;, where &lt;instance&gt; is the directory host (for example, https://login.microsoftonline.com) and &lt;tenant&gt; is an identifier within the directory itself (for example, a domain associated to the tenant, such as contoso.onmicrosoft.com, or the GUID representing the `TenantID` property of the directory) In Azure AD B2C, it is of the form https://&lt;instance&gt;/tfp/&lt;tenantId&gt;/&lt;policyName&gt;/. Default value is: "https://login.microsoftonline.com/common".

- `tokenReceivedCallBack`: The function that will get the call-back once this API is completed (either successfully or with a failure).

## Configuration options
You can pass config options as an optional object to the `UserAgentApplication` constructor as follows:

```javascript
var userAgentApplication = new Msal.UserAgentApplication(clientId, authority, tokenReceivedCallBack, { logger: logger, cacheLocation: 'localStorage'});
```

The config options are defined below:

- `validateAuthority`: Optional.  Validate the issuer of tokens. Default is `true`.

- `cacheLocation`: Optional.  Sets browser storage to either `localStorage` or `sessionStorage`. The default is `sessionStorage`.

- `storeAuthStateInCookie`: Optional.  This flag was introduced in MSAL.js v0.2.2 as a fix for the [authentication loop issues](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser#1-issues-due-to-security-zones) on Microsoft Internet Explorer and Microsoft Edge. Enable the flag `storeAuthStateInCookie` to true to take advantage of this fix. When this is enabled, MSAL.js will store the auth request state required for validation of the auth flows in the browser cookies. By default this flag is set to `false`.

- `redirectUri`: Optional.  The redirect URI of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect URIs you registered in the portal, except that it must be URL encoded. Defaults to "window.location.href".

- `postLogoutRedirectUri`: Optional.  Redirects the user to `postLogoutRedirectUri` after sign out. The default is `redirectUri`.

- `logger`: Optional.  Callback instance that can be provided by the developer to consume and publish logs in a custom manner. Callback method must follow this signature. `loggerCallback(logLevel, message, piiEnabled) { }`

- `level`: Optional.  Configurable log level. Default value is `Info`.

- `piiLoggingEnabled`: Optional.  Enables you to log personal and organizational data if set to true. By default this is set to false, so that your application does not log personal data. Personal data logs are never written to default outputs like Console, Logcat, or NSLog. Default is set to false.

- `correlationId`: Optional.  Set this to a unique identifier used to map the request with the response for debugging purposes. Defaults to RFC4122 version 4 guid (128 bits).

- `loadFrameTimeout`: Optional.  The number of milliseconds of inactivity before a token renewal response from AAD should be considered timed out. Default is 6 seconds.

- `navigateToLoginRequestUrl`: Optional. Ability to turn off default navigation to start page after login. Default is true. This is used only for redirect flows.

- `unprotectedResources`: Optional.  Array of URIs that are unprotected resources. MSAL will not attach a token to outgoing requests that have these URI. Defaults to `null`.

- `protectedResourceMap`: Optional.  This is mapping of resources to scopes used by MSAL for automatically attaching access tokens in web API calls. A single access token is obtained for the resource. So you can map a specific resource path as follows: {"https://graph.microsoft.com/v1.0/me", ["user.read"]}, or the app URL of the resource as: {"https://graph.microsoft.com/", ["user.read", "mail.send"]}. This is required for CORS calls.

- `state`: Optional.  A value included in the request that will also be returned in the token response typically used for preventing [cross-site request forgery attacks](https://tools.ietf.org/html/rfc6749#section-10.12). By default, MSAL.js passes a randomly generated unique value for this purpose. You can also pass the user's state in the app, such as the page or view they were on as input to this parameter. The passed in state appended to the unique guid set by MSAL.js would come back in the `tokenReceivedCallback` as follows:

    ```javascript
    function tokenReceivedCallback(errorDesc, token, error, tokenType, state) {}
    ```