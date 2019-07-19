---
title: Web app that calls web APIs (acquire a token for the app) - Microsoft identity platform
description: Learn how to build a Web app that calls web APIs (acquiring a token for the app)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a Web app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that calls web APIs - acquire a token for the app

Now you have built you client application object, you'll use it to acquire a token that you'll then use to call a web APIs. In ASP.NET or ASP.NET Core, calling a web API is then done in controller. It's about:

- Getting a token for the web API using the token cache. For this, you call `AcquireTokenSilent`
- Calling the protected API with the access token

## ASP.NET Core

The controller methods are protected by an `[Authorize]` attribute that forces users from being authenticated to use the Web App. Here is the code that calls Microsoft Graph

```CSharp
[Authorize]
public class HomeController : Controller
{
 ...
}
```

Here is a simplified code of the action of the HomeController, which gets a token to call the Microsoft Graph.

```CSharp
public async Task<IActionResult> Profile()
{
 var application = BuildConfidentialClientApplication(HttpContext, HttpContext.User);
 string accountIdentifier = claimsPrincipal.GetMsalAccountId();
 string loginHint = claimsPrincipal.GetLoginHint();

 // Get the account
 IAccount account = await application.GetAccountAsync(accountIdentifier);

 // Special case for guest users as the Guest iod / tenant id are not surfaced.
 if (account == null)
 {
  var accounts = await application.GetAccountsAsync();
  account = accounts.FirstOrDefault(a => a.Username == loginHint);
 }

 AuthenticationResult result;
 result = await application.AcquireTokenSilent(new []{"user.read"}, account)
                            .ExecuteAsync();
 var accessToken = result.AccessToken;
 ...
 // use the access token to call a web API
}
```

If you want to understand in details the total of the code required for this scenario, see the phase 2 [2-1-Web App Calls Microsoft Graph](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-1-Call-MSGraph) step of the [ms-identity-aspnetcore-webapp-tutorial](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial) tutorial

There are numerous additional complexities such as:

- implementing a token cache for the Web App (the tutorial present several implementations)
- Removing the account from the cache when the user signs-out
- Calling several APIs, including having incremental consent

## ASP.NET

Things are similar in ASP.NET:

- A controller action protected by an [Authorize] attribute, will extract the tenant ID and user ID of the `ClaimsPrincipal` member of the controller (ASP.NET uses `HttpContext.User`)
- from there it builds an MSAL.NET `IConfidentialClientApplication`
- IT call the `AcquireTokenSilent` method of the confidential client application 

the code is similar to the code shown for ASP.NET Core

## Next steps

> [!div class="nextstepaction"]
> [Call a web API](scenario-web-app-call-api-call-api.md)
