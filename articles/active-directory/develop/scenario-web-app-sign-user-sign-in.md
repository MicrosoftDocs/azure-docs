---
title: Web app that signs in users (sign in) - Microsoft identity platform
description: Learn how to build a web app that signs-in users (sign in)
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
ms.date: 09/17/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web app that signs-in users using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that signs in users - sign in

Learn how to add sign-in to the code for your web app that signs-in users.

## Sign-in

The code we've reviewed in the previous article [app's code configuration](scenario-web-app-sign-user-app-configuration.md) is all you need to implement sign-in.
Once the user has signed-in to your app, you probably want to enable them to sign out. ASP.NET core handles sign-out for you.

## What sign out involves

Signing out from a web app is about more than removing the information about the signed-in account from the web app's state.
The web app must also redirect the user to the Microsoft identity platform `logout` endpoint to sign out. When your web app redirects the user to the `logout` endpoint, this endpoint clears the user's session from the browser. If your app didn't go to the `logout` endpoint, the user would reauthenticate to your app without entering their credentials again, because they would have a valid single sign-in session with the Microsoft identity platform endpoint.

To learn more, see the [Send a sign-out request](v2-protocols-oidc.md#send-a-sign-out-request) section in the [Microsoft identity platform and the OpenID Connect protocol](v2-protocols-oidc.md) conceptual documentation.

### Application registration

# [ASP.NET Core](#tab/aspnetcore)

During the application registration, you'll have registered a **post logout URI**. In our tutorial, you registered `https://localhost:44321/signout-oidc` in the **Logout URL** field of the **Advanced Settings** section in the **Authentication** page. For details see, [
Register the webApp app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-1-MyOrg#register-the-webapp-app-webapp)

# [ASP.NET](#tab/aspnet)

During the application registration, you'll have registered a **post logout URI**. In our tutorial, you registered `https://localhost:44308/Account/EndSession` in the **Logout URL** field of the **Advanced Settings** section in the **Authentication** page. For details see, 
[Register the webApp app](https://github.com/Azure-Samples/active-directory-dotnet-web-single-sign-out#register-the-service-app-webapp-distributedsignout-dotnet)

# [Java](#tab/java)

During the application registration, you'll register a **post logout URI**. In our tutorial, you registered `http://localhost:8080/msal4jsample/` in the **Logout URL** field of the **Advanced Settings** section in the **Authentication** page.

# [Python](#tab/python)

During the application registration you don't need to register a logout URL. The sample does not implement global sign-out

---

### Sign-out button

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core, the sign-out button is exposed in `Views\Shared\_LoginPartial.cshtml` and only displayed when there's an authenticated account (that is when the user has previously signed in).

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

In ASP.NET MVC, the sign-out button is exposed in `Views\Shared\_LoginPartial.cshtml` and only displayed when there's an authenticated account (that is when the user has previously signed in).

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

In our Java quickstart, the sign-out button is located in the main/resources/templates/auth_page.html file

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

In the Python quickstart, the sign-out button is located in the [templates/display.html](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/e1199b4c3cdcb637cf0d8306832efbd85492e123/templates/display.html#L18-L20) file

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Acquire Token Result </title>
</head>
<body>
    {% if cond  %}
        <p1><b>Your information</b> </p1>
        <table>
        {% for key, value in auth_result.items() %}
           <tr>
                <th> {{ key }} </th>
                <td> {{ value }} </td>
           </tr>
        {% endfor %}
        </table>
        <form action="/logout" >
            <input type="submit" value=" Logout"/>
        </form>
    {% else %}
        <p1><b> {{auth_result}} </b> </p1>
        <form action="/authenticate" >
            <input type="submit" value=" Sign-in"/>
        </form>
    {% endif %}
</body>
</html>
```

---

### `Signout()` action of the controller

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET, pressing the **Sign-out** button on the web app triggers the `SignOut` action on the `AccountController` controller. In previous versions of the ASP.NET core templates, the `Account` controller was embedded with the web app, but it's no longer the case as it's now part of the ASP.NET Core framework itself.

The code for the `AccountController` is available from the ASP.NET core repository at
from [AccountController.cs](https://github.com/aspnet/AspNetCore/blob/master/src/Azure/AzureAD/Authentication.AzureAD.UI/src/Areas/AzureAD/Controllers/AccountController.cs). The account control:

- Sets an OpenID redirect URI to `/Account/SignedOut` so that the controller is called back when Azure AD has performed the sign-out
- Calls `Signout()`, which lets the OpenIdConnect middleware contact the Microsoft identity platform `logout` endpoint which:

  - Clears the session cookie from the browser, and
  - finally calls back the **logout URL**, which, by default, displays the signed out view page [SignedOut.html](https://github.com/aspnet/AspNetCore/blob/master/src/Azure/AzureAD/Authentication.AzureAD.UI/src/Areas/AzureAD/Pages/Account/SignedOut.cshtml) also provided as part of ASP.NET Core.

# [ASP.NET](#tab/aspnet)

In ASP.NET, signing out is triggered from the `SignOut()` method on a Controller (for instance AccountController). This method isn't part of the ASP.NET framework (contrary to what happens in ASP.NET Core). It doesn't use `async`, and that's why it:

- sends an OpenId sign-out challenge
- clears the cache
- redirects to the page it wants

```CSharp
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

In Java, the sign-out is handled by calling the Microsoft identity platform logout endpoint directly
and providing the post_logout_redirect_uri.

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

```Python
@app.route("/logout")
def logout():
    return flask.redirect(flask.url_for('index'))
```

---

### Intercepting the call to the `logout` endpoint

The post logout URI enables applications to participate to the global sign-out.

# [ASP.NET Core](#tab/aspnetcore)

The ASP.NET Core OpenIdConnect middleware enables your app to intercept the call to the Microsoft identity platform `logout` endpoint by providing an OpenIdConnect event named `OnRedirectToIdentityProviderForSignOut`. See [Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L151-L156](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/faa94fd49c2da46b22d6694c4f5c5895795af26d/Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L151-L156) for an example of how to subscribe to this event (to clear the token cache)

```CSharp
               // Handling the global sign-out
                options.Events.OnRedirectToIdentityProviderForSignOut = async context =>
                {
                    // Forget about the signed-in user
                };
```

# [ASP.NET](#tab/aspnet)

In ASP.NET you delegate to the middleware to execute the sign-out, clearing the session cookie:

```CSharp
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

In our Java quickstart, the post sign out redirect URI just displays the index.html page 

# [Python](#tab/python)

In the Python quickstart, the post sign out redirect URI just displays the index.html page.

---

## Protocol

If you want to learn more about sign-out, read the protocol documentation, that is available from [Open ID Connect](./v2-protocols-oidc.md).

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-web-app-sign-user-production.md)
