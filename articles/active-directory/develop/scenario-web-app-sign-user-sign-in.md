---
title: Write a web app that signs in/out users - Microsoft identity platform | Azure
description: Learn how to build a web app that signs in/out users
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
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web app that signs in users by using the Microsoft identity platform for developers.
---

# Web app that signs in users: Sign-in and sign-out

Learn how to add sign-in to the code for your web app that signs in users. Then, learn how to let them sign out.

## Sign-in

Sign-in consists of two parts:

- The sign-in button on the HTML page
- The sign-in action in the code-behind in the controller

### Sign-in button

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core, the sign-in button is exposed in `Views\Shared\_LoginPartial.cshtml`. It's displayed only when there's no authenticated account. That is, it's displayed when the user hasn't yet signed in or has signed out.

```html
@using Microsoft.Identity.Web
@if (User.Identity.IsAuthenticated)
{
 // Code omitted code for clarity
}
else
{
    <ul class="nav navbar-nav navbar-right">
        <li><a asp-area="AzureAD" asp-controller="Account" asp-action="SignIn">Sign in</a></li>
    </ul>
}
```

# [ASP.NET](#tab/aspnet)

In ASP.NET MVC, the sign-out button is exposed in `Views\Shared\_LoginPartial.cshtml`. It's displayed only when there's an authenticated account. That is, it's displayed when the user has previously signed in.

```html
@if (Request.IsAuthenticated)
{
 // Code omitted code for clarity
}
else
{
    <ul class="nav navbar-nav navbar-right">
        <li>@Html.ActionLink("Sign in", "SignIn", "Account", routeValues: null, htmlAttributes: new { id = "loginLink" })</li>
    </ul>
}
```

# [Java](#tab/java)

In our Java quickstart, the sign-in button is located in the [main/resources/templates/index.html](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/master/src/main/resources/templates/index.html) file.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>HomePage</title>
</head>
<body>
<h3>Home Page</h3>

<form action="/msal4jsample/secure/aad">
    <input type="submit" value="Login">
</form>

</body>
</html>
```

# [Python](#tab/python)

In the Python quickstart, there's no sign-in button. The code-behind automatically prompts the user for sign-in when it's reaching the root of the web app. See [app.py#L14-L18](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/0.1.0/app.py#L14-L18).

```Python
@app.route("/")
def index():
    if not session.get("user"):
        return redirect(url_for("login"))
    return render_template('index.html', user=session["user"])
```

---

### `SignIn` action of the controller

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET, selecting the **Sign-in** button in the web app triggers the `SignIn` action on the `AccountController` controller. In previous versions of the ASP.NET core templates, the `Account` controller was embedded with the web app. That's no longer the case because the controller is now part of the ASP.NET Core framework.

The code for `AccountController` is available from the ASP.NET Core repository
in [AccountController.cs](https://github.com/aspnet/AspNetCore/blob/master/src/Azure/AzureAD/Authentication.AzureAD.UI/src/Areas/AzureAD/Controllers/AccountController.cs). The account control challenges the user by redirecting to the Microsoft identity platform endpoint. For details, see the [SignIn](https://github.com/aspnet/AspNetCore/blob/f3e6b74623d42d5164fd5f97a288792c8ad877b6/src/Azure/AzureAD/Authentication.AzureAD.UI/src/Areas/AzureAD/Controllers/AccountController.cs#L23-L31) method provided as part of ASP.NET Core.

# [ASP.NET](#tab/aspnet)

In ASP.NET, signing out is triggered from the `SignOut()` method on a controller (for instance, [AccountController.cs#L16-L23](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/Controllers/AccountController.cs#L16-L23)). This method isn't part of the ASP.NET framework (contrary to what happens in ASP.NET Core). It sends an OpenID sign-in challenge after proposing a redirect URI.

```csharp
public void SignIn()
{
    // Send an OpenID Connect sign-in request.
    if (!Request.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(new AuthenticationProperties { RedirectUri = "/" }, OpenIdConnectAuthenticationDefaults.AuthenticationType);
    }
}
```

# [Java](#tab/java)

In Java, sign-out is handled by calling the Microsoft identity platform `logout` endpoint directly and providing the `post_logout_redirect_uri` value. For details, see [AuthPageController.java#L30-L48](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/java/com/microsoft/azure/msalwebsample/AuthPageController.java#L30-L48).

```Java
@Controller
public class AuthPageController {

    @Autowired
    AuthHelper authHelper;

    @RequestMapping("/msal4jsample")
    public String homepage(){
        return "index";
    }

    @RequestMapping("/msal4jsample/secure/aad")
    public ModelAndView securePage(HttpServletRequest httpRequest) throws ParseException {
        ModelAndView mav = new ModelAndView("auth_page");

        setAccountInfo(mav, httpRequest);

        return mav;
    }

    // More code omitted for simplicity
```

# [Python](#tab/python)

Unlike other platforms, MSAL Python takes care of letting the user sign in from the login page. See [app.py#L20-L28](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/e03be352914bfbd58be0d4170eba1fb7a4951d84/app.py#L20-L28).

```Python
@app.route("/login")
def login():
    session["state"] = str(uuid.uuid4())
    auth_url = _build_msal_app().get_authorization_request_url(
        app_config.SCOPE,  # Technically we can use an empty list [] to just sign in
                           # Here we choose to also collect user consent up front
        state=session["state"],
        redirect_uri=url_for("authorized", _external=True))
    return "<a href='%s'>Login with Microsoft Identity</a>" % auth_url
```

The `_build_msal_app()` method is defined in [app.py#L81-L88](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/e03be352914bfbd58be0d4170eba1fb7a4951d84/app.py#L81-L88) as follows:

```Python
def _load_cache():
    cache = msal.SerializableTokenCache()
    if session.get("token_cache"):
        cache.deserialize(session["token_cache"])
    return cache

def _save_cache(cache):
    if cache.has_state_changed:
        session["token_cache"] = cache.serialize()

def _build_msal_app(cache=None):
    return msal.ConfidentialClientApplication(
        app_config.CLIENT_ID, authority=app_config.AUTHORITY,
        client_credential=app_config.CLIENT_SECRET, token_cache=cache)

def _get_token_from_cache(scope=None):
    cache = _load_cache()  # This web app maintains one cache per session
    cca = _build_msal_app(cache)
    accounts = cca.get_accounts()
    if accounts:  # So all accounts belong to the current signed-in user
        result = cca.acquire_token_silent(scope, account=accounts[0])
        _save_cache(cache)
        return result

```

---

After the user has signed in to your app, you'll want to enable them to sign out.

## Sign-out

Signing out from a web app involves more than removing the information about the signed-in account from the web app's state.
The web app must also redirect the user to the Microsoft identity platform `logout` endpoint to sign out. 

When your web app redirects the user to the `logout` endpoint, this endpoint clears the user's session from the browser. If your app didn't go to the `logout` endpoint, the user will reauthenticate to your app without entering their credentials again. The reason is that they'll have a valid single sign-in session with the Microsoft identity platform endpoint.

To learn more, see the [Send a sign-out request](v2-protocols-oidc.md#send-a-sign-out-request) section in the [Microsoft identity platform and the OpenID Connect protocol](v2-protocols-oidc.md) documentation.

### Application registration

# [ASP.NET Core](#tab/aspnetcore)

During the application registration, you register a post-logout URI. In our tutorial, you registered `https://localhost:44321/signout-oidc` in the **Logout URL** field of the **Advanced Settings** section on the **Authentication** page. For details, see [
Register the webApp app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-1-MyOrg#register-the-webapp-app-webapp).

# [ASP.NET](#tab/aspnet)

During the application registration, you register a post-logout URI. In our tutorial, you registered `https://localhost:44308/Account/EndSession` in the **Logout URL** field of the **Advanced Settings** section on the **Authentication** page. For details, see
[Register the webApp app](https://github.com/Azure-Samples/active-directory-dotnet-web-single-sign-out#register-the-service-app-webapp-distributedsignout-dotnet).

# [Java](#tab/java)

During the application registration, you register a post-logout URI. In our tutorial, you registered `http://localhost:8080/msal4jsample/sign_out` in the **Logout URL** field of the **Advanced Settings** section on the **Authentication** page.

# [Python](#tab/python)

During the application registration, you don't need to register an extra logout URL. The app will be called back on its main URL.

---

### Sign-out button

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core, the sign-out button is exposed in `Views\Shared\_LoginPartial.cshtml`. It's displayed only when there's an authenticated account. That is, it's displayed when the user has previously signed in.

```html
@using Microsoft.Identity.Web
@if (User.Identity.IsAuthenticated)
{
    <ul class="nav navbar-nav navbar-right">
        <li class="navbar-text">Hello @User.GetDisplayName()!</li>
        <li><a asp-area="AzureAD" asp-controller="Account" asp-action="SignOut">Sign out</a></li>
    </ul>
}
else
{
    <ul class="nav navbar-nav navbar-right">
        <li><a asp-area="AzureAD" asp-controller="Account" asp-action="SignIn">Sign in</a></li>
    </ul>
}
```

# [ASP.NET](#tab/aspnet)

In ASP.NET MVC, the sign-out button is exposed in `Views\Shared\_LoginPartial.cshtml`. It's displayed only when there's an authenticated account. That is, it's displayed when the user has previously signed in.

```html
@if (Request.IsAuthenticated)
{
    <text>
        <ul class="nav navbar-nav navbar-right">
            <li class="navbar-text">
                Hello, @User.Identity.Name!
            </li>
            <li>
                @Html.ActionLink("Sign out", "SignOut", "Account")
            </li>
        </ul>
    </text>
}
else
{
    <ul class="nav navbar-nav navbar-right">
        <li>@Html.ActionLink("Sign in", "SignIn", "Account", routeValues: null, htmlAttributes: new { id = "loginLink" })</li>
    </ul>
}
```

# [Java](#tab/java)

In our Java quickstart, the sign-out button is located in the main/resources/templates/auth_page.html file.

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<body>

<form action="/msal4jsample/sign_out">
    <input type="submit" value="Sign out">
</form>
...
```

# [Python](#tab/python)

In the Python quickstart, the sign-out button is located in the [templates/index.html#L10](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/e03be352914bfbd58be0d4170eba1fb7a4951d84/templates/index.html#L10) file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
    <h1>Microsoft Identity Python Web App</h1>
    Welcome {{ user.get("name") }}!
    <li><a href='/graphcall'>Call Microsoft Graph API</a></li>
    <li><a href="/logout">Logout</a></li>
</body>
</html>
```

---

### `SignOut` action of the controller

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET, selecting the **Sign-out** button in the web app triggers the `SignOut` action on the `AccountController` controller. In previous versions of the ASP.NET Core templates, the `Account` controller was embedded with the web app. That's no longer the case because the controller is now part of the ASP.NET Core framework.

The code for the `AccountController` is available from the ASP.NET core repository in [AccountController.cs](https://github.com/aspnet/AspNetCore/blob/master/src/Azure/AzureAD/Authentication.AzureAD.UI/src/Areas/AzureAD/Controllers/AccountController.cs). The account control:

- Sets an OpenID redirect URI to `/Account/SignedOut` so that the controller is called back when Azure AD has completed the sign-out.
- Calls `Signout()`, which lets the OpenID Connect middleware contact the Microsoft identity platform `logout` endpoint. The endpoint then:

  - Clears the session cookie from the browser.
  - Calls back the logout URL. By default, the logout URL displays the signed-out view page [SignedOut.html](https://github.com/aspnet/AspNetCore/blob/master/src/Azure/AzureAD/Authentication.AzureAD.UI/src/Areas/AzureAD/Pages/Account/SignedOut.cshtml). This page is also provided as part of ASP.NET Core.

# [ASP.NET](#tab/aspnet)

In ASP.NET, signing out is triggered from the `SignOut()` method on a controller (for instance, [AccountController.cs#L25-L31](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/Controllers/AccountController.cs#L25-L31)). This method isn't part of the ASP.NET framework, contrary to what happens in ASP.NET Core. It:

- Sends an OpenID sign-out challenge.
- Clears the cache.
- Redirects to the page that it wants.

```csharp
/// <summary>
/// Send an OpenID Connect sign-out request.
/// </summary>
public void SignOut()
{
 HttpContext.GetOwinContext()
            .Authentication
            .SignOut(CookieAuthenticationDefaults.AuthenticationType);
 Response.Redirect("/");
}
```

# [Java](#tab/java)

In Java, sign-out is handled by calling the Microsoft identity platform `logout` endpoint directly and providing the `post_logout_redirect_uri` value. For details, see [AuthPageController.java#L50-L60](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/java/com/microsoft/azure/msalwebsample/AuthPageController.java#L50-L60).

```Java
@RequestMapping("/msal4jsample/sign_out")
    public void signOut(HttpServletRequest httpRequest, HttpServletResponse response) throws IOException {

        httpRequest.getSession().invalidate();

        String endSessionEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/logout";

        String redirectUrl = "http://localhost:8080/msal4jsample/";
        response.sendRedirect(endSessionEndpoint + "?post_logout_redirect_uri=" +
                URLEncoder.encode(redirectUrl, "UTF-8"));
    }
```

# [Python](#tab/python)

The code that signs out the user is in [app.py#L46-L52](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/48637475ed7d7733795ebeac55c5d58663714c60/app.py#L47-L48).

```Python
@app.route("/logout")
def logout():
    session.clear()  # Wipe out the user and the token cache from the session
    return redirect(  # Also need to log out from the Microsoft Identity platform
        "https://login.microsoftonline.com/common/oauth2/v2.0/logout"
        "?post_logout_redirect_uri=" + url_for("index", _external=True))
```

---

### Intercepting the call to the `logout` endpoint

The post-logout URI enables applications to participate in the global sign-out.

# [ASP.NET Core](#tab/aspnetcore)

The ASP.NET Core OpenID Connect middleware enables your app to intercept the call to the Microsoft identity platform `logout` endpoint by providing an OpenID Connect event named `OnRedirectToIdentityProviderForSignOut`. For an example of how to subscribe to this event (to clear the token cache), see [Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L151-L156](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/faa94fd49c2da46b22d6694c4f5c5895795af26d/Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L151-L156).

```csharp
    // Handling the global sign-out
    options.Events.OnRedirectToIdentityProviderForSignOut = async context =>
    {
        // Forget about the signed-in user
    };
```

# [ASP.NET](#tab/aspnet)

In ASP.NET, you delegate to the middleware to execute the sign-out, clearing the session cookie:

```csharp
public class AccountController : Controller
{
 ...
 public void EndSession()
 {
  Request.GetOwinContext().Authentication.SignOut();
  Request.GetOwinContext().Authentication.SignOut(Microsoft.AspNet.Identity.DefaultAuthenticationTypes.ApplicationCookie);
  this.HttpContext.GetOwinContext().Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
 }
}
```

# [Java](#tab/java)

In the Java quickstart, the post-logout redirect URI just displays the index.html page.

# [Python](#tab/python)

In the Python quickstart, the post-logout redirect URI just displays the index.html page.

---

## Protocol

If you want to learn more about sign-out, read the protocol documentation that's available from [Open ID Connect](./v2-protocols-oidc.md).

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-web-app-sign-user-production.md)
