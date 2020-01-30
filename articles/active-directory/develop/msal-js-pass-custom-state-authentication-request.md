---
title: Pass custom state in authentication requests (MSAL.js) | Azure
titleSuffix: Microsoft identity platform
description: Learn how to pass a custom state parameter value in authentication request using the Microsoft Authentication Library for JavaScript (MSAL.js).
services: active-directory
author: TylerMSFT
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/16/2020
ms.author: twhitney
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about passing custom state in authentication requests so I can create more robust applications.
---

# Pass custom state in authentication requests using MSAL.js

The *state* parameter, as defined by OAuth 2.0, is included in an authentication request and is also returned in the token response to prevent cross-site request forgery attacks. By default, Microsoft Authentication Library for JavaScript (MSAL.js) passes a randomly generated unique *state* parameter value in the authentication requests.

The state parameter can also be used to encode information of the app's state before redirect. You can pass the user's state in the app, such as the page or view they were on, as input to this parameter. The MSAL.js library allows you to pass your custom state as state parameter in the `Request` object:

```javascript
// Request type
export type AuthenticationParameters = {
    scopes?: Array<string>;
    extraScopesToConsent?: Array<string>;
    prompt?: string;
    extraQueryParameters?: QPDict;
    claimsRequest?: string;
    authority?: string;
    state?: string;
    correlationId?: string;
    account?: Account;
    sid?: string;
    loginHint?: string;
    forceRefresh?: boolean;
};
```

> [!Note]
> If you would like to skip a cached token and go to the server, please pass in the boolean `forceRefresh` into the AuthenticationParameters object used to make a login/token request.
> `forceRefresh` should not be used by default, because of the performance impact on your application.
> Relying on the cache will give your users a better experience.
> Skipping the cache should only be used in scenarios where you know the currently cached data does not have up-to-date information.
> Such as an Admin tool that adds roles to a user that needs to get a new token with updated roles.

For example:

```javascript
let loginRequest = {
    scopes: ["user.read", "user.write"],
    state: "page_url"
}

myMSALObj.loginPopup(loginRequest);
```

The passed in state is appended to the unique GUID set by MSAL.js when sending the request. When the response is returned, MSAL.js checks for a state match and then returns the custom passed in state in the `Response` object as `accountState`.

```javascript
export type AuthResponse = {
    uniqueId: string;
    tenantId: string;
    tokenType: string;
    idToken: IdToken;
    accessToken: string;
    scopes: Array<string>;
    expiresOn: Date;
    account: Account;
    accountState: string;
};
```

To learn more, read about [building a single-page application (SPA)](scenario-spa-overview.md) using MSAL.js.