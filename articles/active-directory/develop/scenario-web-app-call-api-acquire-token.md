---
title: Get a token in a web app that calls web APIs
description: Learn how to acquire a token for a web app that calls web APIs
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/06/2022
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform.
---

# A web app that calls web APIs: Acquire a token for the app

You've built your client application object. Now, you use it to acquire a token to call a web API. In ASP.NET or ASP.NET Core, calling a web API is done in the controller:

- Get a token for the web API by using the token cache. To get this token, you call the Microsoft Authentication Library (MSAL) `AcquireTokenSilent` method (or the equivalent in Microsoft.Identity.Web).
- Call the protected API, passing the access token to it as a parameter.

# [ASP.NET Core](#tab/aspnetcore)

*Microsoft.Identity.Web* adds extension methods that provide convenience services for calling Microsoft Graph or a downstream web API. These methods are explained in detail in [A web app that calls web APIs: Call an API](scenario-web-app-call-api-call-api.md). With these helper methods, you don't need to manually acquire a token.

If, however, you do want to manually acquire a token, the following code shows an example of using *Microsoft.Identity.Web* to do so in a home controller. It calls Microsoft Graph using the REST API (instead of the Microsoft Graph SDK). Usually, you don't need to get a token, you need to build an Authorization header that you add to your request. To get an authorization header, you inject the `IAuthorizationHeaderProvider` service by dependency injection in your controller's constructor (or your page constructor if you use Blazor), and you use it in your controller actions. This interface has methods that produce a string containing the protocol (Bearer, Pop, ...) and a token. To get an authorization header to call an API on behalf of the user, use (`CreateAuthorizationHeaderForUserAsync`). To get an authorization header to call a downstream API on behalf of the application itself, in a daemon scenario, use (`CreateAuthorizationHeaderForAppAsync`).

The controller methods are protected by an `[Authorize]` attribute that ensures only authenticated users can use the web app.

```csharp
[Authorize]
public class HomeController : Controller
{
 readonly IAuthorizationHeaderProvider authorizationHeaderProvider;

 public HomeController(IAuthorizationHeaderProvider authorizationHeaderProvider)
 {
  this.authorizationHeaderProvider = authorizationHeaderProvider;
 }

 // Code for the controller actions (see code below)

}
```

ASP.NET Core makes `IAuthorizationHeaderProvider` available by dependency injection.

Here's simplified code for the action of the `HomeController`, which gets a token to call Microsoft Graph:

```csharp
[AuthorizeForScopes(Scopes = new[] { "user.read" })]
public async Task<IActionResult> Profile()
{
 // Acquire the access token.
 string[] scopes = new string[]{"user.read"};
 string accessToken = await authorizationHeaderProvider.CreateAuthorizationHeaderForUserAsync(scopes);

 // Use the access token to call a protected web API.
 HttpClient client = new HttpClient();
 client.DefaultRequestHeaders.Add("Authorization", authorizationHeader);
 string json = await client.GetStringAsync(url);
}
```

To better understand the code required for this scenario, see the phase 2 ([2-1-Web app Calls Microsoft Graph](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-1-Call-MSGraph)) step of the [ms-identity-aspnetcore-webapp-tutorial](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial) tutorial.

The `AuthorizeForScopes` attribute on top of the controller action (or of the Razor page if you use a Razor template) is provided by Microsoft.Identity.Web. It ensures that the user is asked for consent if needed, and incrementally.

There are other complex variations, such as:

- Calling several APIs.
- Processing incremental consent and Conditional Access.

These advanced steps are covered in chapter 3 of the [3-WebApp-multi-APIs](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/3-WebApp-multi-APIs) tutorial.

# [ASP.NET](#tab/aspnet)

The code for ASP.NET is similar to the code shown for ASP.NET Core:

- A controller action, protected by an [Authorize] attribute, extracts the tenant ID and user ID of the `ClaimsPrincipal` member of the controller. (ASP.NET uses `HttpContext.User`.)
*Microsoft.Identity.Web* adds extension methods to the Controller that provide convenience services to call Microsoft Graph or a downstream web API, or to get an authorization header, or even a token. The methods used to call an API directly are explained in detail in [A web app that calls web APIs: Call an API](scenario-web-app-call-api-call-api.md). With these helper methods, you don't need to manually acquire a token.

If, however, you do want to manually acquire a token or build an authorization header, the following code shows how to use *Microsoft.Identity.Web* to do so in a controller. It calls an API (Microsoft Graph) using the REST API instead of the Microsoft Graph SDK. 

To get an authorization header, you get an `IAuthorizationHeaderProvider` service from the controller using an extension method `GetAuthorizationHeaderProvider`. To get an authorization header to call an API on behalf of the user, use `CreateAuthorizationHeaderForUserAsync`. To get an authorization header to call a downstream API on behalf of the application itself, in a daemon scenario, use `CreateAuthorizationHeaderForAppAsync`.

The controller methods are protected by an `[Authorize]` attribute that ensures only authenticated users can use the web app.


The following snippet shows the action of the `HomeController`, which gets an authorization header to call Microsoft Graph as a REST API:


```csharp
[Authorize]
public class HomeController : Controller
{
 [AuthorizeForScopes(Scopes = new[] { "user.read" })]
 public async Task<IActionResult> Profile()
 {
  // Get an authorization header.
  IAuthorizationHeaderProvider authorizationHeaderProvider = this.GetAuthorizationHeaderProvider();
  string[] scopes = new string[]{"user.read"};
  string authorizationHeader = await authorizationHeaderProvider.CreateAuthorizationHeaderForUserAsync(scopes);

  // Use the access token to call a protected web API.
  HttpClient client = new HttpClient();
  client.DefaultRequestHeaders.Add("Authorization", authorizationHeader);
  string json = await client.GetStringAsync(url);
 }
}
```

The following snippet shows the action of the `HomeController`, which gets an access token to call Microsoft Graph as a REST API:

```csharp
[Authorize]
public class HomeController : Controller
{
 [AuthorizeForScopes(Scopes = new[] { "user.read" })]
 public async Task<IActionResult> Profile()
 {
  // Get an authorization header.
  ITokenAcquirer tokenAcquirer = TokenAcquirerFactory.GetDefaultInstance().GetTokenAcquirer();
  string[] scopes = new string[]{"user.read"};
  string token = await await tokenAcquirer.GetTokenForUserAsync(scopes);

  // Use the access token to call a protected web API.
  HttpClient client = new HttpClient();
  client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
  string json = await client.GetStringAsync(url);
 }
}
```


# [Java](#tab/java)

In the Java sample, the code that calls an API is in the getUsersFromGraph method in [AuthPageController.java#L62](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/java/com/microsoft/azure/msalwebsample/AuthPageController.java#L62).

The method attempts to call `getAuthResultBySilentFlow`. If the user needs to consent to more scopes, the code processes the `MsalInteractionRequiredException` object to challenge the user.

```java
@RequestMapping("/msal4jsample/graph/me")
public ModelAndView getUserFromGraph(HttpServletRequest httpRequest, HttpServletResponse response)
        throws Throwable {

    IAuthenticationResult result;
    ModelAndView mav;
    try {
        result = authHelper.getAuthResultBySilentFlow(httpRequest, response);
    } catch (ExecutionException e) {
        if (e.getCause() instanceof MsalInteractionRequiredException) {

            // If the silent call returns MsalInteractionRequired, redirect to authorization endpoint
            // so user can consent to new scopes.
            String state = UUID.randomUUID().toString();
            String nonce = UUID.randomUUID().toString();

            SessionManagementHelper.storeStateAndNonceInSession(httpRequest.getSession(), state, nonce);

            String authorizationCodeUrl = authHelper.getAuthorizationCodeUrl(
                    httpRequest.getParameter("claims"),
                    "User.Read",
                    authHelper.getRedirectUriGraph(),
                    state,
                    nonce);

            return new ModelAndView("redirect:" + authorizationCodeUrl);
        } else {

            mav = new ModelAndView("error");
            mav.addObject("error", e);
            return mav;
        }
    }

    if (result == null) {
        mav = new ModelAndView("error");
        mav.addObject("error", new Exception("AuthenticationResult not found in session."));
    } else {
        mav = new ModelAndView("auth_page");
        setAccountInfo(mav, httpRequest);

        try {
            mav.addObject("userInfo", getUserInfoFromGraph(result.accessToken()));

            return mav;
        } catch (Exception e) {
            mav = new ModelAndView("error");
            mav.addObject("error", e);
        }
    }
    return mav;
}
// Code omitted here
```

# [Node.js](#tab/nodejs)

In the Node.js sample, the code that acquires a token is in the *acquireToken* method of the **AuthProvider** class.

:::code language="js" source="~/ms-identity-node/App/auth/AuthProvider.js" range="79-121":::

This access token is then used to handle requests to the `/profile` endpoint:

:::code language="js" source="~/ms-identity-node/App/routes/users.js" range="29-39":::

# [Python](#tab/python)

In the Python sample, the code that calls the API is in `app.py`.

The code attempts to get a token from the token cache. If it can't get a token, it redirects the user to the sign-in route. Otherwise, it can proceed to call the API.

:::code language="python" source="~/ms-identity-python-webapp-tutorial/app.py" range="60-71":::

---

## Next steps

# [ASP.NET Core](#tab/aspnetcore)

Move on to the next article in this scenario,
[Call a web API](scenario-web-app-call-api-call-api.md?tabs=aspnetcore).

# [ASP.NET](#tab/aspnet)

Move on to the next article in this scenario,
[Call a web API](scenario-web-app-call-api-call-api.md?tabs=aspnet).

# [Java](#tab/java)

Move on to the next article in this scenario,
[Call a web API](scenario-web-app-call-api-call-api.md?tabs=java).

# [Node.js](#tab/nodejs)

Move on to the next article in this scenario,
[Call a web API](scenario-web-app-call-api-call-api.md?tabs=nodejs).

# [Python](#tab/python)

Move on to the next article in this scenario,
[Call a web API](scenario-web-app-call-api-call-api.md?tabs=python).

---