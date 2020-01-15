---
title: Web API that calls web APIs - Microsoft identity platform | Azure
description: Learn how to build a web API that calls web APIs.
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
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# A web API that calls web APIs: Call an API

After you have a token, you can call a protected web API. You do this from the controller of your ASP.NET or ASP.NET Core web API.

## Controller code

The following code continues the example code that's shown in [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md). The code is called in the actions of the API controllers. It calls a downstream API named *todolist*.

After you've acquired the token, use it as a bearer token to call the downstream API.

```csharp
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

// After the token has been returned by Microsoft Authentication Library (MSAL), add it to the HTTP authorization header before making the call to access the To Do list service.
_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

// Call the To Do list service.
HttpResponseMessage response = await _httpClient.GetAsync(TodoListBaseAddress + "/api/todolist");
...
}
```

## Next steps

> [!div class="nextstepaction"]
> [A web API that calls web APIs: Move to production](scenario-web-api-call-api-production.md)
