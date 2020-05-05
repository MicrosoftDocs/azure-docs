---
title: Get a token in a web app that calls web APIs - Microsoft identity platform | Azure
description: Learn how to acquire a token for a web app that calls web APIs
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform for developers.
---

# A web app that calls web APIs: Acquire a token for the app

You've built your client application object. Now, you'll use it to acquire a token to call a web API. In ASP.NET or ASP.NET Core, calling a web API is done in the controller:

- Get a token for the web API by using the token cache. To get this token, you call the MSAL `AcquireTokenSilent` method (or the equivalent in Microsoft.Identity.Web).
- Call the protected API, passing the access token to it as a parameter.

# [ASP.NET Core](#tab/aspnetcore)

The controller methods are protected by an `[Authorize]` attribute that forces users being authenticated to use the web app. Here's the code that calls Microsoft Graph:

```csharp
[Authorize]
public class HomeController : Controller
{
 readonly ITokenAcquisition tokenAcquisition;

 public HomeController(ITokenAcquisition tokenAcquisition)
 {
  this.tokenAcquisition = tokenAcquisition;
 }

 // Code for the controller actions (see code below)

}
```

The `ITokenAcquisition` service is injected by ASP.NET by using dependency injection.

Here's simplified code for the action of the `HomeController`, which gets a token to call Microsoft Graph:

```csharp
public async Task<IActionResult> Profile()
{
 // Acquire the access token.
 string[] scopes = new string[]{"user.read"};
 string accessToken = await tokenAcquisition.GetAccessTokenForUserAsync(scopes);

 // Use the access token to call a protected web API.
 HttpClient client = new HttpClient();
 client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
 string json = await client.GetStringAsync(url);
}
```

To better understand the code required for this scenario, see the phase 2 ([2-1-Web app Calls Microsoft Graph](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-1-Call-MSGraph)) step of the [ms-identity-aspnetcore-webapp-tutorial](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial) tutorial.

There are other complex variations, such as:

- Calling several APIs.
- Processing incremental consent and conditional access.

These advanced steps are covered in chapter 3 of the [3-WebApp-multi-APIs](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/3-WebApp-multi-APIs) tutorial.

# [ASP.NET](#tab/aspnet)

The code for ASP.NET is similar to the code shown for ASP.NET Core:

- A controller action, protected by an [Authorize] attribute, extracts the tenant ID and user ID of the `ClaimsPrincipal` member of the controller. (ASP.NET uses `HttpContext.User`.)
- From there, it builds an MSAL.NET `IConfidentialClientApplication` object.
- Finally, it calls the `AcquireTokenSilent` method of the confidential client application.

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

# [Python](#tab/python)

In the Python sample, the code that calls Microsoft Graph is in [app.py#L53-L62](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/48637475ed7d7733795ebeac55c5d58663714c60/app.py#L53-L62).

The code attempts to get a token from the token cache. Then, after setting the authorization header, it calls the web API. If it can't get a token, it signs the user in again.

```python
@app.route("/graphcall")
def graphcall():
    token = _get_token_from_cache(app_config.SCOPE)
    if not token:
        return redirect(url_for("login"))
    graph_data = requests.get(  # Use token to call downstream service.
        app_config.ENDPOINT,
        headers={'Authorization': 'Bearer ' + token['access_token']},
        ).json()
    return render_template('display.html', result=graph_data)
```

---

## Next steps

> [!div class="nextstepaction"]
> [Call a web API](scenario-web-app-call-api-call-api.md)
