---
title: Web API that calls web APIs - Microsoft identity platform | Azure
description: Learn how to build a web API that calls web APIs.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform for developers.
---

# A web API that calls web APIs: Call an API

After you have a token, you can call a protected web API. You do this from the controller of your web API.

## Controller code

# [ASP.NET Core](#tab/aspnetcore)

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

# [Java](#tab/java)

The following code continues the example code that's shown in [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md). The code is called in the actions of the API controllers. It calls the downstream API MS Graph.

After you've acquired the token, use it as a bearer token to call the downstream API.

```Java
private String callMicrosoftGraphMeEndpoint(String accessToken){
    RestTemplate restTemplate = new RestTemplate();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    headers.set("Authorization", "Bearer " + accessToken);

    HttpEntity<String> entity = new HttpEntity<>(null, headers);

    String result = restTemplate.exchange("https://graph.microsoft.com/v1.0/me", HttpMethod.GET,
            entity, String.class).getBody();

    return result;
}
```

# [Python](#tab/python)
A sample demonstrating this flow with MSAL Python is not yet available.

---

## Next steps

> [!div class="nextstepaction"]
> [A web API that calls web APIs: Move to production](scenario-web-api-call-api-production.md)
