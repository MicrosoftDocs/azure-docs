---
title: Clear the token cache (MSAL.NET)
description: Learn how to clear the token cache using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 05/07/2019
ms.author: marsma
ms.reviewer: saeeda
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to learn how how to clear the token cache so I can .
---

# Clear the token cache using MSAL.NET

When you [acquire an access token](msal-acquire-cache-tokens.md) using the Microsoft Authentication Library for .NET (MSAL.NET), the token is cached. When the application needs a token:

- public client applications - desktop apps and mobile apps - should call the `AcquireTokenSilent` method 
- web sites, which use the `AcquireTokenByAuthorizationCode` should also call the `AcquireTokenSilent` method 
- web apis, which use the `AcquireTokenOnBehalfOf` method, do not need to do anything. MSAL will look in the cache on its own. 
- service principals and daemon apps, which use the `AcquireTokenForClient` method, do not need to do anything. MSAL will look in the cache on its own.

Public client apps and web sites clear the cache, which use `AcquireTokenSilent`, by removing the accounts from the cache. This does not remove the session cookie which is in the browser.

Web APIs and service principals cannot clear the cache. To control the cache size, see https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-net-token-cache-serialization?tabs=aspnet. To bypass the cache in certain circumstances, use the `WithForceRefresh` method on the `AcquireTokenOnBehalfOf` or `AcquireTokenForClient` APIs. It is not recommended to always bypass the cache, because AAD will throttle the application on excessive use.

The following example instantiates a public client application, gets the accounts for the application, and removes the accounts.

```csharp
private readonly IPublicClientApplication _app;
private static readonly string ClientId = ConfigurationManager.AppSettings["ida:ClientId"];
private static readonly string Authority = string.Format(CultureInfo.InvariantCulture, AadInstance, Tenant);

_app = PublicClientApplicationBuilder.Create(ClientId)
                .WithAuthority(Authority)
                .Build();

var accounts = (await _app.GetAccountsAsync()).ToList();

// clear the cache
while (accounts.Any())
{
   await _app.RemoveAsync(accounts.First());
   accounts = (await _app.GetAccountsAsync()).ToList();
}

```

To learn more about acquiring and caching tokens, read [acquire an access token](msal-acquire-cache-tokens.md).
