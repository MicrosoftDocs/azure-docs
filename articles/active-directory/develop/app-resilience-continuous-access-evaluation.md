---
title: "How to use Continuous Access Evaluation enabled APIs in your applications"
description: How to increase app security and resilience by adding support for Continuous Access Evaluation, enabling long-lived access tokens that can be revoked based on critical events and policy evaluation.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/03/2023
ms.author: cwerner
ms.reviewer: jricketts
# Customer intent: As an application developer, I want to learn how to use Continuous Access Evaluation for building resiliency through long-lived, refreshable tokens that can be revoked based on critical events and policy evaluation.
---
# How to use Continuous Access Evaluation enabled APIs in your applications

[Continuous Access Evaluation](../conditional-access/concept-continuous-access-evaluation.md) (CAE) is a Microsoft Entra feature that allows access tokens to be revoked based on [critical events](../conditional-access/concept-continuous-access-evaluation.md#critical-event-evaluation) and [policy evaluation](../conditional-access/concept-continuous-access-evaluation.md#conditional-access-policy-evaluation) rather than relying on token expiry based on lifetime. For some resource APIs, because risk and policy are evaluated in real time, this can increase token lifetime up to 28 hours. These long-lived tokens are proactively refreshed by the Microsoft Authentication Library (MSAL), increasing the resiliency of your applications.

This article shows you how to use CAE-enabled APIs in your applications. Applications not using MSAL can add support for [claims challenges, claims requests, and client capabilities](claims-challenge.md) to use CAE.

## Implementation considerations

To use CAE, both your app and the resource API it's accessing must be CAE-enabled. However, preparing your code to use a CAE enabled resource won't prevent you from using APIs that aren't CAE enabled.

If a resource API implements CAE and your application declares it can handle CAE, your app receives CAE tokens for that resource. For this reason, if you declare your app CAE ready, your application must handle the CAE claim challenge for all resource APIs that accept Microsoft Identity access tokens. If you don't handle CAE responses in these API calls, your app could end up in a loop retrying an API call with a token that is still in the returned lifespan of the token but has been revoked due to CAE.

## The code

The first step is to add code to handle a response from the resource API rejecting the call due to CAE. With CAE, APIs will return a 401 status and a WWW-Authenticate header when the access token has been revoked or the API detects a change in IP address used. The WWW-Authenticate header contains a Claims Challenge that the application can use to acquire a new access token.

For example:

```console
// Line breaks for legibility only

HTTP 401; Unauthorized

Bearer authorization_uri="https://login.windows.net/common/oauth2/authorize",
  error="insufficient_claims",
  claims="eyJhY2Nlc3NfdG9rZW4iOnsibmJmIjp7ImVzc2VudGlhbCI6dHJ1ZSwgInZhbHVlIjoiMTYwNDEwNjY1MSJ9fX0="
```

Your app would check for:

- the API call returning the 401 status
- the existence of a WWW-Authenticate header containing:
  - an "error" parameter with the value "insufficient_claims"
  - a "claims" parameter

# [.NET](#tab/dotnet)

When these conditions are met, the app can extract and decode the claims challenge using MSAL.NET `WwwAuthenticateParameters` class.

```csharp
if (APIresponse.IsSuccessStatusCode)
{
    // ...
}
else
{
    if (APIresponse.StatusCode == System.Net.HttpStatusCode.Unauthorized
        && APIresponse.Headers.WwwAuthenticate.Any())
    {
        string claimChallenge = WwwAuthenticateParameters.GetClaimChallengeFromResponseHeaders(APIresponse.Headers);
```

Your app would then use the claims challenge to acquire a new access token for the resource.

```csharp
try
{
    authResult = await _clientApp.AcquireTokenSilent(scopes, firstAccount)
        .WithClaims(claimChallenge)
        .ExecuteAsync()
        .ConfigureAwait(false);
}
catch (MsalUiRequiredException)
{
    try
    {
        authResult = await _clientApp.AcquireTokenInteractive(scopes)
            .WithClaims(claimChallenge)
            .WithAccount(firstAccount)
            .ExecuteAsync()
            .ConfigureAwait(false);
    }
    // ...
```

Once your application is ready to handle the claim challenge returned by a CAE enabled resource, you can tell Microsoft Identity your app is CAE ready. To do this in your MSAL application, build your Public Client using the Client Capabilities of "cp1".

```csharp
_clientApp = PublicClientApplicationBuilder.Create(App.ClientId)
    .WithDefaultRedirectUri()
    .WithAuthority(authority)
    .WithClientCapabilities(new [] {"cp1"})
    .Build();
```

You can test your application by signing in a user to the application then using the Azure portal to Revoke the user's sessions. The next time the app calls the CAE enabled API, the user will be asked to reauthenticate.

# [JavaScript](#tab/JavaScript)

When these conditions are met, the app can extract the claims challenge from the API response header as follows: 

```javascript
try {
  const response = await fetch(apiEndpoint, options);

  if (response.status === 401 && response.headers.get('www-authenticate')) {
    const authenticateHeader = response.headers.get('www-authenticate');
    const claimsChallenge = parseChallenges(authenticateHeader).claims;
    
    // use the claims challenge to acquire a new access token...
  }
} catch(error) {
  // ...
}

// helper function to parse the www-authenticate header
function parseChallenges(header) {
    const schemeSeparator = header.indexOf(' ');
    const challenges = header.substring(schemeSeparator + 1).split(',');
    const challengeMap = {};

    challenges.forEach((challenge) => {
        const [key, value] = challenge.split('=');
        challengeMap[key.trim()] = window.decodeURI(value.replace(/['"]+/g, ''));
    });

    return challengeMap;
}
```

Your app would then use the claims challenge to acquire a new access token for the resource.

```javascript
const tokenRequest = {
    claims: window.atob(claimsChallenge), // decode the base64 string
    scopes: ['User.Read'],
    account: msalInstance.getActiveAccount()
};

let tokenResponse;

try {
    tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
} catch (error) {
     if (error instanceof InteractionRequiredAuthError) {
        tokenResponse = await msalInstance.acquireTokenPopup(tokenRequest);
    }
}
```

Once your application is ready to handle the claim challenge returned by a CAE-enabled resource, you can tell Microsoft Identity your app is CAE-ready by adding a `clientCapabilities` property in the MSAL configuration.

```javascript
const msalConfig = {
    auth: {
        clientId: 'Enter_the_Application_Id_Here', 
        clientCapabilities: ["CP1"]
        // remaining settings...
    }
}

const msalInstance = new PublicClientApplication(msalConfig);

```

---

You can test your application by signing in a user and then using the Azure portal to revoke the user's session. The next time the app calls the CAE-enabled API, the user will be asked to reauthenticate.

## Code samples

- [Enable your Angular single-page application to sign in users and call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/2-Authorization-I/1-call-graph)
- [Enable your React single-page application to sign in users and call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/2-Authorization-I/1-call-graph)
- [Enable your ASP.NET Core web app to sign in users and call Microsoft Graph](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-1-Call-MSGraph)

## Next steps

- [Continuous access evaluation](../conditional-access/concept-continuous-access-evaluation.md) conceptual overview
- [Claims challenges, claims requests, and client capabilities](claims-challenge.md)
