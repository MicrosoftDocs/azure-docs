---
title: Get a token for a web API that calls web APIs | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a web API that calls web APIs that require acquiring a token for the app.
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

# A web API that calls web APIs: Acquire a token for the app

After you've built a client application object, use it to acquire a token that you can use to call a web API.

## Code in the controller

# [ASP.NET Core](#tab/aspnetcore)

Here's an example of code that's called in the actions of the API controllers. It calls a downstream API named *todolist*.

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
}
```

`BuildConfidentialClient()` is similar to the scenario in [A web API that calls web APIs: App configuration](scenario-web-api-call-api-app-configuration.md). `BuildConfidentialClient()` instantiates `IConfidentialClientApplication` with a cache that contains information for only one account. The account is provided by the `GetAccountIdentifier` method.

The `GetAccountIdentifier` method uses the claims that are associated with the identity of the user for whom the web API received the JSON Web Token (JWT):

```csharp
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

# [Java](#tab/java)
Here's an example of code that's called in the actions of the API controllers. It calls the downstream API - Microsoft Graph.

```java
@RestController
public class ApiController {

    @Autowired
    MsalAuthHelper msalAuthHelper;

    @RequestMapping("/graphMeApi")
    public String graphMeApi() throws MalformedURLException {

        String oboAccessToken = msalAuthHelper.getOboToken("https://graph.microsoft.com/.default");

        return callMicrosoftGraphMeEndpoint(oboAccessToken);
    }

}
```

# [Python](#tab/python)

A Python web API will need to use some middleware to validate the bearer token received from the client. The web API can then obtain the access token for downstream API using MSAL Python library by calling the [`acquire_token_on_behalf_of`](https://msal-python.readthedocs.io/en/latest/?badge=latest#msal.ConfidentialClientApplication.acquire_token_on_behalf_of) method. A sample demonstrating this flow with MSAL Python is not yet available.

---

## Next steps

> [!div class="nextstepaction"]
> [A web API that calls web APIs: Call an API](scenario-web-api-call-api-call-api.md)
