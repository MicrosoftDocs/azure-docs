---
title: "How to use Continuous Access Evaluation enabled APIs in your applications | Azure"
titleSuffix: Microsoft identity platform
description: How to increase app security and resilience by adding support for Continuous Access Evaluation, enabling long-lived access tokens that can be revoked based on critical events and policy evaluation.
services: active-directory
author: knicholasa
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/06/2020
ms.author: nichola
ms.reviewer:
# Customer intent: As an application developer, I want to learn how to use Continuous Access Evaluation for building resiliency through long-lived, refreshable tokens that can be revoked based on critical events and policy evaluation.
---
# How to use Continuous Access Evaluation enabled APIs in your applications

[Continuous Access Evaluation](../conditional-access/concept-continuous-access-evaluation.md) (CAE) is an Azure AD feature that allows access tokens to be revoked based on [critical events](../conditional-access/concept-continuous-access-evaluation.md#critical-event-evaluation) and [policy evaluation](../conditional-access/concept-continuous-access-evaluation.md#conditional-access-policy-evaluation-preview) rather than relying on token expiry based on lifetime. For some resource APIs, because risk and policy are evaluated in real time, this can increase token lifetime up to 28 hours. These long-lived tokens will be proactively refreshed by the Microsoft Authentication Library (MSAL), increasing the resiliency of your applications.

This article shows you how to use CAE-enabled APIs in your applications.

## Implementation considerations

To use Continuous Access Evaluation, both your app and the resource API it's accessing must be CAE-enabled. However, preparing your code to use a CAE enabled resource will not prevent you from using APIs that are not CAE enabled.

If a resource API implements CAE and your application declares it can handle CAE, your app will get CAE tokens for that resource. For this reason, if you declare your app CAE ready, your application must handle the CAE claim challenge for all resource APIs that accept Microsoft Identity access tokens. If you do not handle CAE responses in these API calls, your app could end up in a loop retrying an API call with a token that is still in the returned lifespan of the token but has been revoked due to CAE.

## The code

The first step is to add code to handle a response from the resource API rejecting the call due to CAE. With CAE, APIs will return a 401 status and a WWW-Authenticate header when the access token has been revoked or the API detects a change in IP address used. The WWW-Authenticate header contains a Claims Challenge that the application can use to acquire a new access token.

For example:

```console
HTTP 401; Unauthorized
WWW-Authenticate=Bearer
  authorization_uri="https://login.windows.net/common/oauth2/authorize",
  error="insufficient_claims",
  claims="eyJhY2Nlc3NfdG9rZW4iOnsibmJmIjp7ImVzc2VudGlhbCI6dHJ1ZSwgInZhbHVlIjoiMTYwNDEwNjY1MSJ9fX0="
```

Your app would check for:

- the API call returning the 401 status
- the existence of a WWW-Authenticate header containing:
  - an "error" parameter with the value "insufficient_claims"
  - a "claims" parameter

When these conditions are met, the app can extract and decode the claims challenge.

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
        AuthenticationHeaderValue bearer = APIresponse.Headers.WwwAuthenticate.First
            (v => v.Scheme == "Bearer");
        IEnumerable<string> parameters = bearer.Parameter.Split(',').Select(v => v.Trim()).ToList();
        var error = GetParameter(parameters, "error");

        if (null != error && "insufficient_claims" == error)
        {
            var claimChallengeParameter = GetParameter(parameters, "claims");
            if (null != claimChallengeParameter)
            {
                var claimChallengebase64Bytes = System.Convert.FromBase64String(claimChallengeParameter);
                var claimChallenge = System.Text.Encoding.UTF8.GetString(claimChallengebase64Bytes);
                var newAccessToken = await GetAccessTokenWithClaimChallenge(scopes, claimChallenge);
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

## Next steps

To learn more, see [Continuous access evaluation](../conditional-access/concept-continuous-access-evaluation.md).
