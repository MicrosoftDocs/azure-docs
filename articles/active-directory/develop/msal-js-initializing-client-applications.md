---
title: Initialize MSAL.js client apps | Azure
titleSuffix: Microsoft identity platform
description: Learn about initializing client applications using the Microsoft Authentication Library for JavaScript (MSAL.js).
services: active-directory
author: TylerMSFT
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/12/2019
ms.author: twhitney
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about initializing client applications so I can decide if this platform meets my application development needs and requirements.
---

# Initialize client applications using MSAL.js
This article describes initializing Microsoft Authentication Library for JavaScript (MSAL.js) with an instance of a user-agent application. The user-agent application is a form of public client application in which the client code is executed in a user-agent such as a web browser. These clients do not store secrets, since the browser context is openly accessible. To learn more about the client application types and application configuration options, read the [overview](msal-client-applications.md).

## Prerequisites
Before initializing an application, you first need to [register it with the Azure portal](scenario-spa-app-registration.md) so that your app can be integrated with the Microsoft identity platform. After registration, you may need the following information (which can be found in the Azure portal):

- The client ID (a string representing a GUID for your application)
- The identity provider URL (named the instance) and the sign-in audience for your application. These two parameters are collectively known as the authority.
- The tenant ID if you are writing a line-of-business application solely for your organization (also named single-tenant application).
- For web apps, you'll have to also set the redirectUri where the identity provider will return to your application with the security tokens.

## Initializing applications

You can use MSAL.js as follows in a plain JavaScript/Typescript application. Initialize MSAL authentication context by instantiating `UserAgentApplication` with a configuration object. The minimum required config to initialize MSAL.js is the clientID of your application which you should get from the application registration portal.

For authentication methods with redirect flows (`loginRedirect` and `acquireTokenRedirect`), you will need to explicitly register a callback for success or error through `handleRedirectCallback()` method. This is needed since redirect flows do not return promises as the methods with a pop-up experience do.

```javascript
// Configuration object constructed
const config = {
    auth: {
        clientId: "abcd-ef12-gh34-ikkl-ashdjhlhsdg"
    }
}

// create UserAgentApplication instance
const myMSALObj = new UserAgentApplication(config);

function authCallback(error, response) {
    //handle redirect response
}

// (optional when using redirect methods) register redirect call back for Success or Error
myMSALObj.handleRedirectCallback(authCallback);
```

MSAL.js is designed to have a single instance and configuration of the `UserAgentApplication` to represent a single authentication context. Multiple instances are not recommended as they cause conflicting cache entries and behavior in the browser.

## Configuration options

MSAL.js has a configuration object shown below that provides a grouping of configurable options available for creating an instance of `UserAgentApplication`.

```javascript
type storage = "localStorage" | "sessionStorage";

// Protocol Support
export type AuthOptions = {
    clientId: string;
    authority?: string;
    validateAuthority?: boolean;
    redirectUri?: string | (() => string);
    postLogoutRedirectUri?: string | (() => string);
    navigateToLoginRequestUrl?: boolean;
};

// Cache Support
export type CacheOptions = {
    cacheLocation?: CacheLocation;
    storeAuthStateInCookie?: boolean;
};

// Library support
export type SystemOptions = {
    logger?: Logger;
    loadFrameTimeout?: number;
    tokenRenewalOffsetSeconds?: number;
    navigateFrameWait?: number;
};

// Developer App Environment Support
export type FrameworkOptions = {
    isAngular?: boolean;
    unprotectedResources?: Array<string>;
    protectedResourceMap?: Map<string, Array<string>>;
};

// Configuration Object
export type Configuration = {
    auth: AuthOptions,
    cache?: CacheOptions,
    system?: SystemOptions,
    framework?: FrameworkOptions
};
```

Below is the total set of configurable options that are supported currently in the config object:

- **clientID**: Required. The clientID of your application, you should get this from the application registration portal.

- **authority**: Optional. A URL indicating a directory that MSAL can request tokens from. Default value is: `https://login.microsoftonline.com/common`.
    * In Azure AD, it is of the form https://&lt;instance&gt;/&lt;audience&gt;, where &lt;instance&gt; is the identity provider domain (for example, `https://login.microsoftonline.com`) and &lt;audience&gt; is an identifier representing the sign-in audience. This can be the following values:
        * `https://login.microsoftonline.com/<tenant>`- tenant is a domain associated to the tenant, such as contoso.onmicrosoft.com, or the GUID representing the `TenantID` property of the directory used only to sign in users of a specific organization.
        * `https://login.microsoftonline.com/common`- Used to sign in users with work and school accounts or a Microsoft personal account.
        * `https://login.microsoftonline.com/organizations/`- Used to sign in users with work and school accounts.
        * `https://login.microsoftonline.com/consumers/` - Used to sign in users with only personal Microsoft account (live).
    * In Azure AD B2C, it is of the form `https://<instance>/tfp/<tenant>/<policyName>/`, where instance is the Azure AD B2C domain i.e. {your-tenant-name}.b2clogin.com, tenant is the name of the Azure AD B2C tenant i.e. {your-tenant-name}.onmicrosoft.com, policyName is the name of the B2C policy to apply.


- **validateAuthority**: Optional.  Validate the issuer of tokens. Default is `true`. For B2C applications, since the authority value is known and can be different per policy, the authority validation will not work and has to be set to `false`.

- **redirectUri**: Optional.  The redirect URI of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect URIs you registered in the portal. Defaults to `window.location.href`.

- **postLogoutRedirectUri**: Optional.  Redirects the user to `postLogoutRedirectUri` after sign out. The default is `redirectUri`.

- **navigateToLoginRequestUrl**: Optional. Ability to turn off default navigation to start page after login. Default is true. This is used only for redirect flows.

- **cacheLocation**: Optional.  Sets browser storage to either `localStorage` or `sessionStorage`. The default is `sessionStorage`.

- **storeAuthStateInCookie**: Optional.  This flag was introduced in MSAL.js v0.2.2 as a fix for the [authentication loop issues](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser#1-issues-due-to-security-zones) on Microsoft Internet Explorer and Microsoft Edge. Enable the flag `storeAuthStateInCookie` to true to take advantage of this fix. When this is enabled, MSAL.js will store the auth request state required for validation of the auth flows in the browser cookies. By default this flag is set to `false`.

- **logger**: Optional.  A Logger object with a callback instance that can be provided by the developer to consume and publish logs in a custom manner. For details on passing logger object, see [logging with msal.js](msal-logging.md).

- **loadFrameTimeout**: Optional.  The number of milliseconds of inactivity before a token renewal response from Azure AD should be considered timed out. Default is 6 seconds.

- **tokenRenewalOffsetSeconds**: Optional. The number of milliseconds which sets the window of offset needed to renew the token before expiry. Default is 300 milliseconds.

- **navigateFrameWait**: Optional. The number of milliseconds which sets the wait time before hidden iframes navigate to their destination. Default is 500 milliseconds.

These are only applicable to be passed down from the MSAL Angular wrapper library:
- **unprotectedResources**: Optional.  Array of URIs that are unprotected resources. MSAL will not attach a token to outgoing requests that have these URI. Defaults to `null`.

- **protectedResourceMap**: Optional.  This is mapping of resources to scopes used by MSAL for automatically attaching access tokens in web API calls. A single access token is obtained for the resource. So you can map a specific resource path as follows: {"https://graph.microsoft.com/v1.0/me", ["user.read"]}, or the app URL of the resource as: {"https://graph.microsoft.com/", ["user.read", "mail.send"]}. This is required for CORS calls. Defaults to `null`.
