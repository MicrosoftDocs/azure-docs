---
title: Web API that calls web APIs (call APIs) - Microsoft identity platform
description: Learn how to build a web API that calls downstream web APIs (calling a web API).
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

# Web API that calls web APIs - call an API

Once you have a token, you can call a protected web API. This is done from the controller of your ASP.NET/ASP.NET Core web API.

## Controller code

Here's the continuation of the example code shown in [Protected web API calls web APIs - acquiring a token](scenario-web-api-call-api-acquire-token.md), called in the actions of the API controllers, calling a downstream API (named todolist).

Once you acquired the token, use it as a bearer token to call the downstream API.

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

// Once the token has been returned by MSAL, add it to the http authorization header, before making the call to access the To Do list service.
_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

// Call the To Do list service.
HttpResponseMessage response = await _httpClient.GetAsync(TodoListBaseAddress + "/api/todolist");
...
}
```

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-web-api-call-api-production.md)
