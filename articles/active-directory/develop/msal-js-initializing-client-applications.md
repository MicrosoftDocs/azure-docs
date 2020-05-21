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
// Construct the configuration object
const config = {
    auth: {
        clientId: "abcd-ef12-gh34-ikkl-ashdjhlhsdg"
    }
}

// Create an instance of UserAgentApplication
const myMSALObj = new UserAgentApplication(config);

function authCallback(error, response) {
    // Handle redirect response in this callback
}

// Register a redirect callback for Success or Error (when using redirect methods)
// **Required** in MSAL.js 1.2.x and earlier
// **Optional** in MSAL.js 1.3.x and later
myMSALObj.handleRedirectCallback(authCallback);
```

MSAL.js is designed to have a single instance and configuration of the `UserAgentApplication` to represent a single authentication context. Multiple instances are not recommended because they cause conflicting cache entries and behavior in the browser.

## Configuration options

The MSAL.js configuration object, shown at the bottom of this code snippet, provides several configurable options for use in instantiating the `UserAgentApplication`.

```javascript
type storage = "localStorage" | "sessionStorage";

// Protocol Support
export type AuthOptions = {
    clientId: string;
    authority?: string;
    validateAuthority?: boolean;
    knownAuthorities?: Array<string>;
    redirectUri?: string | (() => string);
    postLogoutRedirectUri?: string | (() => string);
    navigateToLoginRequestUrl?: boolean;
};

// Cache Support
export type CacheOptions = {
    cacheLocation?: CacheLocation;
    storeAuthStateInCookie?: boolean;
};

// Telemetry support
export type TelemetryOptions = {
    applicationName: string;
    applicationVersion: string;
    telemetryEmitter: TelemetryEmitter
};

// Library-specific support
export type SystemOptions = {
    logger?: Logger;
    loadFrameTimeout?: number;
    tokenRenewalOffsetSeconds?: number;
    navigateFrameWait?: number;
    telemetry?: TelemetryOptions
};

// Developer app/framework-specific environment support
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

The following table describes the available configurable options supported by the `config` object.

| AuthOptions | Required | Description |
| ----------- | :------: | :---------- |
| `clientId` | Required | The **Application (client) ID** of your application. Find this value on the application registration's overview page in **App registrations** in the Azure portal.
| `authority` | Optional | A URL specifying the endpoint from which MSAL requests security tokens. Default: `https://login.microsoftonline.com/common`<p/>In **Azure AD**, `authority` is in the form `https://<instance>/<audience>`. `<instance>` is the identity provider domain (for example, `https://login.microsoftonline.com`) and `<audience>` is an identifier representing the sign-in audience. `audience` can be one of the following:<p/><li>`https://login.microsoftonline.com/<tenant>` - Sign in users of a specific organization (single-tenant). `tenant` is a domain associated with tenant, like `contoso.onmicrosoft.com`, or the tenant's **Directory (tenant) ID** (a GUID).</li><li>`https://login.microsoftonline.com/common` - Sign in users with work and school accounts or a Microsoft personal account (MSA).</li><li>`https://login.microsoftonline.com/organizations/` - Sign in users with work and school accounts.</li><li>`https://login.microsoftonline.com/consumers/` - Sign in users with personal Microsoft accounts (MSA) *only*.</li><br/>In **Azure AD B2C**, `authority` is in the form `https://<instance>/tfp/<tenant>/<policyName>/`. `<instance>` is `tenant-name.b2clogin.com`, `<tenant>` is `tenant-name.onmicrosoft.com` (or the tenant ID GUID), and `policyName` is the name of the B2C user flow or custom policy (for example, `B2C_1_signupsignin1`). |
| `validateAuthority` | Optional | Whether to validate the token issuer. Default: `true`. |
| `knownAuthorities` | Optional | Array of URIs that are known to be valid. In Azure AD B2C scenarios, this value is required if `validateAuthority` is set to `true`.  |
| `redirectUri` | Optional | The URI of your application to where authentication responses can be sent and received by the app. It must exactly match one of the redirect URIs you register in the portal. Default: `window.location.href`. |
| `postLogoutRedirectUri` | Optional | Redirects the client to `postLogoutRedirectUri` after sign out. Default: `window.location.href`. |
| `navigateToLoginRequestUrl` | Optional | Disable default navigation to start page after login. Used only for redirect flows. Default: `true`. |
| **CacheOptions** | **Required** | **Description** |
| `cacheLocation` | Optional | Sets browser storage to either `localStorage` or `sessionStorage`. Default: `sessionStorage`. |
| `storeAuthStateInCookie` | Optional | Introduced in MSAL.js v0.2.2 as a fix for the [authentication loop issues](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser#1-issues-due-to-security-zones) in Microsoft Internet Explorer and Microsoft Edge. Enable the flag `storeAuthStateInCookie` to true to take advantage of this fix. When this is enabled, MSAL.js stores the auth request state required for validation of the auth flows in the browser cookies. Default: `false`. |
| **TelemetryOptions** | **Required** | **Description** |
| `applicationName` | Required | Name of the consuming app's application. |
| `applicationVersion` | Required | Version of the consuming application. |
| `telemetryEmitter` | Required | Function to which telemetry events should be flushed. |
| **SystemOptions** | **Required** | **Description** |
| `logger` | Optional | Logger object with a callback instance that can be provided by the developer to consume and publish logs in a custom manner. For details on passing a logger object, see [Logging in MSAL applications](msal-logging.md). |
| `loadFrameTimeout` | Optional | The number of milliseconds of inactivity before a token renewal response from Azure AD should be considered timed-out. Default: `6000` (6 seconds). |
| `tokenRenewalOffsetSeconds` | Optional | The window of offset, in seconds, needed to renew the token before expiry. Default: `300` (5 minutes). |
| `navigateFrameWait` | Optional | The wait time, in milliseconds, before timeout when loading a hidden iframe in silent calls. If this is set to `0`, hidden iframes are rendered synchronously. Default: `500` (0.5 second). |
| `telemetry` | Optional | `TelemetryOptions` object. |
| **FrameworkOptions** | **Required** | **Description** |
| `isAngular` | Optional | Whether the application uses the Angular framework. MSAL uses this to broadcast tokens. Default: `false`. |
| `unprotectedResources` | Optional | Array of URIs that are unprotected resources. MSAL won't attach a token to outgoing requests sent to these URIs. Default: `null`. |
| `protectedResourceMap` | Optional | A mapping of resources-to-scopes used by MSAL for automatically attaching access tokens in web API calls. A single access token is obtained for the resource. You can map a specific resource path as follows: `{"https://graph.microsoft.com/v1.0/me", ["user.read"]}`, or the app URL of the resource: `{"https://graph.microsoft.com/", ["user.read", "mail.send"]}`. This is required for CORS calls. Default: `null`. |
