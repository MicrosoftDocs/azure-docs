---
title: Write a web app that signs in/out users
description: Learn how to build a web app that signs in/out users
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 07/14/2020
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web app that signs in users by using the Microsoft identity platform.
---

# Web app that signs in users: Sign-in and sign-out

Learn how to add sign-in to the code for your web app that signs in users. Then, learn how to let them sign out.

## Sign-in

Sign-in consists of two parts:

- The sign-in button on the HTML page
- The sign-in action in the code-behind in the controller

### Sign-in button

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core, for Microsoft identity platform applications, the **Sign in** button is exposed in `Views\Shared\_LoginPartial.cshtml` (for an MVC app) or `Pages\Shared\_LoginPartial.cshtm` (for a Razor app). It's displayed only when the user isn't authenticated. That is, it's displayed when the user hasn't yet signed in or has signed out. On the contrary, The **Sign out** button is displayed when the user is already signed-in. Note that the Account controller is defined in the **Microsoft.Identity.Web.UI** NuGet package, in the Area named **MicrosoftIdentity**

```html
<ul class="navbar-nav">
  @if (User.Identity.IsAuthenticated)
  {
    <li class="nav-item">
        <span class="navbar-text text-dark">Hello @User.Identity.Name!</span>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignOut">Sign out</a>
    </li>
  }
  else
  {
    <li class="nav-item">
        <a class="nav-link text-dark" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignIn">Sign in</a>
    </li>
  }
</ul>
```

# [ASP.NET](#tab/aspnet)

In ASP.NET MVC, the **Sign in** button is exposed in `Views\Shared\_LoginPartial.cshtml`. It's displayed only when the user isn't authenticated. That is, it's displayed when the user hasn't yet signed in or has signed out.

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

In the Java quickstart, the sign-in button is located in the [main/resources/templates/index.html](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/master/msal-java-webapp-sample/src/main/resources/templates/index.html) file.

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

# [Node.js](#tab/nodejs)

In the Node.js quickstart, the code for the sign-in button is located in *index.hbs* template file.

:::code language="hbs" source="~/ms-identity-node/App/views/index.hbs" range="10-11":::

This template is served via the main (index) route of the app:

:::code language="js" source="~/ms-identity-node/App/routes/index.js" range="6-15":::

# [Python](#tab/python)

In the Python quickstart, the code for the sign-in link is located in *login.html* template file.

:::code language="python" source="~/ms-identity-python-webapp-tutorial/templates/login.html" range="19-19":::

When an unauthenticated user visits the home page, the `index` route in *app.py* redirects the user to the `login` route.

:::code language="python" source="~/ms-identity-python-webapp-tutorial/app.py" range="49-57" highlight="7-8":::

The `login` route figures out the appropriate `auth_uri` and renders the *login.html* template.

:::code language="python" source="~/ms-identity-python-webapp-tutorial/app.py" range="28-33":::

---

### `SignIn` action of the controller

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET, selecting the **Sign-in** button in the web app triggers the `SignIn` action on the `AccountController` controller. In previous versions of the ASP.NET core templates, the `Account` controller was embedded with the web app. That's no longer the case because the controller is now part of the **Microsoft.Identity.Web.UI** NuGet package. See [AccountController.cs](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web.UI/Areas/MicrosoftIdentity/Controllers/AccountController.cs) for details.

This controller also handles the Azure AD B2C applications.

# [ASP.NET](#tab/aspnet)

In ASP.NET, Sign in is triggered from the `SignIn()` method on a controller (for instance, [AccountController.cs#L16-L23](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/Controllers/AccountController.cs#L16-L23)). This method isn't part of the ASP.NET framework (contrary to what happens in ASP.NET Core). It sends an OpenID sign-in challenge after proposing a redirect URI.

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

# [Node.js](#tab/nodejs)

When the user selects the **Sign in** link, which triggers the `/auth/signin` route, the sign-in controller takes over to authenticate the user with Microsoft identity platform. 

:::code language="js" source="~/ms-identity-node/App/auth/AuthProvider.js" range="15-77, 195-253":::

# [Python](#tab/python)

When the user selects the **Sign in** link, they're brought to the Microsoft identity platform authorization endpoint. 

A successful sign-in redirects the user to the `auth_response` route, which completes the sign-in process using [`auth.complete_login`](https://identity-library.readthedocs.io/en/latest/#identity.web.Auth.complete_log_in), renders errors if any, and redirects the now authenticated user to the home page. 

:::code language="python" source="~/ms-identity-python-webapp-tutorial/app.py" range="36-41":::

---

After the user has signed in to your app, you'll want to enable them to sign out.

## Sign-out

Signing out from a web app involves more than removing the information about the signed-in account from the web app's state.
The web app must also redirect the user to the Microsoft identity platform `logout` endpoint to sign out.

When your web app redirects the user to the `logout` endpoint, this endpoint clears the user's session from the browser. If your app didn't go to the `logout` endpoint, the user will reauthenticate to your app without entering their credentials again. The reason is that they'll have a valid single sign-in session with the Microsoft identity platform.

To learn more, see the [Send a sign-out request](v2-protocols-oidc.md#send-a-sign-out-request) section in the [Microsoft identity platform and the OpenID Connect protocol](v2-protocols-oidc.md) documentation.

### Application registration

# [ASP.NET Core](#tab/aspnetcore)

During the application registration, you register a front-channel logout URL. In our tutorial, you registered `https://localhost:44321/signout-oidc` in the **Front-channel logout URL** field on the **Authentication** page. For details, see [Register the webApp app](scenario-web-app-sign-user-app-registration.md#register-an-app-by-using-the-azure-portal).

# [ASP.NET](#tab/aspnet)

During the application registration, you don't need to register an extra front-channel logout URL. The app will be called back on its main URL. 

# [Java](#tab/java)

No front-channel logout URL is required in the application registration.

# [Node.js](#tab/nodejs)

No front-channel logout URL is required in the application registration.

# [Python](#tab/python)

During the application registration, you don't need to register an extra front-channel logout URL. The app will be called back on its main URL.

---

### Sign-out button

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET, selecting the **Sign out** button in the web app triggers the `SignOut` action on the `AccountController` controller (see below)

```html
<ul class="navbar-nav">
  @if (User.Identity.IsAuthenticated)
  {
    <li class="nav-item">
        <span class="navbar-text text-dark">Hello @User.Identity.Name!</span>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignOut">Sign out</a>
    </li>
  }
  else
  {
    <li class="nav-item">
        <a class="nav-link text-dark" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignIn">Sign in</a>
    </li>
  }
</ul>
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

# [Node.js](#tab/nodejs)

:::code language="hbs" source="~/ms-identity-node/App/views/index.hbs" range="2, 8":::

# [Python](#tab/python)

In the Python quickstart, the sign-out button is located in the *templates/index.html* file.

:::code language="html" source="~/ms-identity-python-webapp-tutorial/templates/index.html" range="20":::


---

### `SignOut` action of the controller

# [ASP.NET Core](#tab/aspnetcore)

In previous versions of the ASP.NET core templates, the `Account` controller was embedded with the web app. That's no longer the case because the controller is now part of the **Microsoft.Identity.Web.UI** NuGet package. See [AccountController.cs](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web.UI/Areas/MicrosoftIdentity/Controllers/AccountController.cs) for details.

- Sets an OpenID redirect URI to `/Account/SignedOut` so that the controller is called back when Microsoft Entra ID has completed the sign-out.
- Calls `Signout()`, which lets the OpenID Connect middleware contact the Microsoft identity platform `logout` endpoint. The endpoint then:

  - Clears the session cookie from the browser.
  - Calls back the post-logout redirect URI. By default, the post-logout redirect URI displays the signed-out view page [SignedOut.cshtml.cs](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web.UI/Areas/MicrosoftIdentity/Pages/Account/SignedOut.cshtml.cs). This page is also provided as part of Microsoft.Identity.Web.

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

# [Node.js](#tab/nodejs)

When the user selects the **Sign out** button, the app triggers the `/auth/signout` route, which destroys the session and redirects the browser to Microsoft identity platform sign-out endpoint.

:::code language="js" source="~/ms-identity-node/App/auth/AuthProvider.js" range="157-175":::

# [Python](#tab/python)

When the user selects **Logout**, the app triggers the `logout` route, which redirects the browser to the Microsoft identity platform sign-out endpoint.

:::code language="python" source="~/ms-identity-python-webapp-tutorial/app.py" range="44-46":::


---

### Intercepting the call to the `logout` endpoint

The post-logout URI enables applications to participate in the global sign-out.

# [ASP.NET Core](#tab/aspnetcore)

The ASP.NET Core OpenID Connect middleware enables your app to intercept the call to the Microsoft identity platform `logout` endpoint by providing an OpenID Connect event named `OnRedirectToIdentityProviderForSignOut`. This is handled automatically by Microsoft.Identity.Web (which clears accounts in the case where your web app calls web apis)

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

# [Node.js](#tab/nodejs)

In the Node quickstart, the post-logout redirect URI is used to redirect the browser back to sample home page after the user completes the logout process with the Microsoft identity platform.

# [Python](#tab/python)

In the Python quickstart, the post-logout redirect URI just displays the *index.html* page.

---

## Protocol

If you want to learn more about sign-out, read the protocol documentation that's available from [OpenID Connect](./v2-protocols-oidc.md).

## Next steps

Move on to the next article in this scenario,
[Move to production](scenario-web-app-sign-user-production.md).
