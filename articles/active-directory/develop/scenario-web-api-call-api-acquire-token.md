---
title: Web API that calls other web APIs (acquire a token for the app) - Microsoft identity platform
description: Learn how to build a web API that calls other web APIs (acquiring a token for the app).
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
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web API that calls web APIs - acquire a token for the app

Once you've built a client application object, use it to acquire a token that you can use to call a web API.

## Code in the controller

Here's an example of code that will be called in the actions of the API controllers, calling a downstream API (named todolist).

```CSharp
private async Task GetTodoList(bool isAppStarting)
{
 ...
 //
 // Get an access token to call the To Do service.
 //
 AuthenticationResult result = null;
 try
 {
  app = BuildConfidentialClient(HttpContext, HttpContext.User);
  result = await app.AcquireTokenSilent(Scopes, account)
                     .ExecuteAsync()
                     .ConfigureAwait(false);
 }
...
}
```

`BuildConfidentialClient()` is similar to what you've seen in the article [Web API that calls web APIs - app configuration](scenario-web-api-call-api-app-configuration.md). `BuildConfidentialClient()` instantiates `IConfidentialClientApplication` with a cache that contains only information for one account. The account is provided by the `GetAccountIdentifier` method.

The `GetAccountIdentifier` method uses the claims associated with the identity of the user for which the web API received the JWT:

```CSharp
public static string GetMsalAccountId(this ClaimsPrincipal claimsPrincipal)
{
 string userObjectId = GetObjectId(claimsPrincipal);
 string tenantId = GetTenantId(claimsPrincipal);

 if (    !string.IsNullOrWhiteSpace(userObjectId)
      && !string.IsNullOrWhiteSpace(tenantId))
 {
  return $"{userObjectId}.{tenantId}";
 }

 return null;
}
```

## Next steps

> [!div class="nextstepaction"]
> [Calling a web API](scenario-web-api-call-api-call-api.md)
