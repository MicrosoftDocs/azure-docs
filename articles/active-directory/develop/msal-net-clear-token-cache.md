---
title: Clear the token cache by using Microsoft Authentication Library for .NET - Azure
description: Learn how to clear the token cache using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how how to clear the token cache so I can .
ms.collection: M365-identity-device-management
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
