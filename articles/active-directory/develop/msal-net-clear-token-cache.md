---
title: Clear the token cache (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
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
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how how to clear the token cache so I can .
---

# Clear the token cache using MSAL.NET

When you [acquire an access token](msal-acquire-cache-tokens.md) using Microsoft Authentication Library for .NET (MSAL.NET), the token is cached. When the application needs a token, it should first call the `AcquireTokenSilent` method to verify if an acceptable token is in the cache. 

Clearing the cache is achieved by removing the accounts from the cache. This does not remove the session cookie which is in the browser, though.  The following example instantiates a public client application, gets the accounts for the application, and removes the accounts.

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
