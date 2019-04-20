---
title: web API that calls Web APIs - acquiring a token for the app | Azure
description: Learn how to build a web API that calls Web APIs (acquiring a token for the app)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/18/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web API that calls Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web API that calls Web APIs - acquiring a token for the app

Now you have built you client application object, you'll use it to acquire a token that you'll, then, use to call a Web API.

## Code in the controller

Here is an example of code that will be called in the actions of the API controllers, calling a downstream API (here named todolist)

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

`BuildConfidentialClient()` is similar to what you've seen in the previous article [Web API that calls Web APIs - app configuration](scenario-web-api-call-api-app-configuration.md). It instantiates a `IConfidentialClientApplication` with a cache containing only information for one account, which account is is provided by the `GetAccountIdentifier` method:

The `GetAccountIdentifier` method uses the claims associated with the identity of the user for which the Web API received the JWT:

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
> [Calling a Web API](scenario-web-api-call-api-call-api.md)
