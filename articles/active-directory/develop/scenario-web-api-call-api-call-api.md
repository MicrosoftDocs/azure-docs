---
title: web API that calls Web APIs - calling a Web API | Azure
description: Learn how to build a web API that calls Web APIs (calling a Web API)
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

# Web API that calls Web APIs - calling a Web API

Now that you have a token, you can call a protected Web API.

## Code in the controller

Here is the continuation of the example of code shown in [Protected Web API calls Web APIs - acquiring a token](scenario-web-api-call-api-acquire-token.md), called in the actions of the API controllers, calling a downstream API (here named todolist)

You just use the acquire token as a bearer token to call the downstream API.

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
