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
ms.date: 07/16/2019
ms.author: dmwendia
ms.reviewer: saeeda
ms.custom: devx-track-csharp, aaddev
#Customer intent: As an application developer, I want to learn how how to use the AcquireTokenSilent method so I can acquire tokens from the cache.
---

# Get a token from the token cache using MSAL.NET

When you acquire an access token using the Microsoft Authentication Library for .NET (MSAL.NET), the token is cached. When the application needs a token, it should first call the `AcquireTokenSilent` method to verify if an acceptable token is in the cache. In many cases, it's possible to acquire another token with more scopes based on a token in the cache. It's also possible to refresh a token when it's getting close to expiration (as the token cache also contains a refresh token).

For authentication flows that require a user interaction, MSAL caches the access, refresh, and ID tokens, as well as the `IAccount` object, which represents information about a single account. Learn more about [IAccount](/dotnet/api/microsoft.identity.client.iaccount?view=azure-dotnet&preserve-view=true). For application flows, such as [client credentials](msal-authentication-flows.md#client-credentials), only access tokens are cached, because the `IAccount` object and ID token require a user, and the refresh token is not applicable.

The recommended pattern is to call the `AcquireTokenSilent` method first.  If `AcquireTokenSilent` fails, then acquire a token using other methods.

In the following example, the application first attempts to acquire a token from the token cache.  If a `MsalUiRequiredException` exception is thrown, the application acquires a token interactively. 

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
