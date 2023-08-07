---
title: Acquire a token from the cache (MSAL.NET) 
description: Learn how to acquire an access token silently (from the token cache) using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 01/16/2023
ms.author: dmwendia
ms.reviewer: saeeda
ms.custom: devx-track-csharp, aaddev, engagement-fy23, devx-track-dotnet
#Customer intent: As an application developer, I want to learn how how to use the AcquireTokenSilent method so I can acquire tokens from the cache.
---

# Get a token from the token cache using MSAL.NET

When you acquire an access token using the Microsoft Authentication Library for .NET (MSAL.NET), the token is cached. When the application needs a token, it should first attempt to fetch it from the cache.

You can monitor the source of the tokens by inspecting the [`AuthenticationResult.AuthenticationResultMetadata.TokenSource`](/dotnet/api/microsoft.identity.client.authenticationresultmetadata.tokensource?view=msal-dotnet-latest&preserve-view=true) property.

## Websites and web APIs

ASP.NET Core and ASP.NET Classic websites should integrate with [Microsoft.Identity.Web](microsoft-identity-web.md), a wrapper for MSAL.NET. Memory token caching or distributed token caching can be configured as described in [token cache serialization](msal-net-token-cache-serialization.md?tabs=aspnetcore). 

Web APIs on ASP.NET Core should use Microsoft.Identity.Web. Web APIs on ASP.NET classic, use MSAL directly, by calling `AcquireTokenOnBehalfOf` and should configure memory or distributed caching. For more information, see [Token cache serialization in MSAL.NET](msal-net-token-cache-serialization.md?tabs=aspnet). There's no reason to call the `AcquireTokenSilent` API as there's no API to clear the cache. Cache size can be managed by setting eviction policies on the underlying cache store, such as MemoryCache, Redis etc.

## Web service / Daemon apps 

Applications that request tokens for an app identity, with no user involved, by calling `AcquireTokenForClient` can either rely on MSAL's internal caching, define their own memory token caching or distributed token caching. For instructions and more information, see [Token cache serialization in MSAL.NET](msal-net-token-cache-serialization.md?tabs=aspnet). 

Since no user is involved, there's no reason to call `AcquireTokenSilent`. `AcquireTokenForClient` will look in the cache on its own as there's no API to clear the cache. Cache size is proportional with the number of tenants and resources you need tokens for. Cache size can be managed by setting eviction policies on the underlying cache store, such as MemoryCache, Redis, etc.

## Desktop, command-line, and mobile applications

Desktop, command-line, and mobile applications should first call the `AcquireTokenSilent` method to verify if an acceptable token is in the cache. In many cases, it's possible to acquire another token with more scopes based on a token in the cache. It's also possible to refresh a token when it's getting close to expiration (as the token cache also contains a refresh token).

For authentication flows that require a user interaction, MSAL caches the access, refresh, and ID tokens, and the `IAccount` object, which represents information about a single account. Learn more about [IAccount](/dotnet/api/microsoft.identity.client.iaccount?view=msal-dotnet-latest&preserve-view=true). For application flows, such as [client credentials](msal-authentication-flows.md#client-credentials), only access tokens are cached, because the `IAccount` object and ID token require a user, and the refresh token isn't applicable.

The recommended pattern is to call the `AcquireTokenSilent` method first.  If `AcquireTokenSilent` fails, then acquire a token using other methods.

In the following example, the application first attempts to acquire a token from the token cache. If a `MsalUiRequiredException` exception is thrown, the application acquires a token interactively. 

```csharp
var accounts = await app.GetAccountsAsync();

AuthenticationResult result = null;
try
{
     result = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                       .ExecuteAsync();
}
catch (MsalUiRequiredException ex)
{
    // A MsalUiRequiredException happened on AcquireTokenSilent.
    // This indicates you need to call AcquireTokenInteractive to acquire a token
    Debug.WriteLine($"MsalUiRequiredException: {ex.Message}");

    try
    {
        result = await app.AcquireTokenInteractive(scopes)
                          .ExecuteAsync();
    }
    catch (MsalException msalex)
    {
        ResultText.Text = $"Error Acquiring Token:{System.Environment.NewLine}{msalex}";
    }
}
catch (Exception ex)
{
    ResultText.Text = $"Error Acquiring Token Silently:{System.Environment.NewLine}{ex}";
    return;
}

if (result != null)
{
    string accessToken = result.AccessToken;
    // Use the token
}
```

### Clearing the cache

In public client applications, removing accounts from the cache will clear it. However, this doesn't remove the session cookie, which is in the browser.

```csharp
var accounts = (await app.GetAccountsAsync()).ToList();

// clear the cache
while (accounts.Any())
{
   await app.RemoveAsync(accounts.First());
   accounts = (await app.GetAccountsAsync()).ToList();
}
```
