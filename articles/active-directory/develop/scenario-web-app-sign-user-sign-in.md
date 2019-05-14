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
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web app that signs-in users using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that signs in users - sign in

Learn how to add sign-in to the code for your web app that signs-in users.

## Sign-in

The code we've in the previous article [app's code configuration](scenario-web-app-sign-user-app-configuration.md) is all you need to implement sign-out.
Once the user has signed-in to your app, you probably want to enable them to sign out. ASP.NET core handles sign-out for you.

## What sign out involves

Signing out from a web app is about more than removing the information about the signed-in account from the web app's state.
The web app must also redirect the user to the Microsoft identity platform v2.0 `logout` endpoint to sign out. When your web app redirects the user to the `logout` endpoint, this endpoint clears the user's session from the browser. If your app didn't go to the `logout` endpoint, the user would reauthenticate to your app without entering their credentials again, because they would have a valid single sign-in session with the Microsoft Identity platform v2.0 endpoint.

To learn more, see the [Send a sign-out request](v2-protocols-oidc.md#send-a-sign-out-request) section in the [Microsoft Identity platform v2.0 and the OpenID Connect protocol](v2-protocols-oidc.md) conceptual documentation.

## Application registration

During the application registration, you'll have registered a **post logout URI**. In our tutorial, you registered `https://localhost:44321/signout-oidc` in the **Logout URL** field of the **Advanced Settings** section in the **Authentication** page. For details see, [
Register the webApp app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-1-MyOrg#register-the-webapp-app-webapp)

## ASP.NET Core code

### Signout button

The sign out button is exposed in `Views\Shared\_LoginPartial.cshtml` and only displayed when there's an authenticated account (that is when the user has previously signed in).

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

### `Signout()` action of the `AccountController`

Pressing the **Sign out** button on the web app triggers the `SignOut` action on the `Account` controller. In previous versions of the ASP.NET core templates, the `Account` controller was embedded with the web app, but this is no longer the case as it's now part of the ASP.NET Core framework itself. 

The code for the `AccountController` is available from the ASP.NET core repository at
from [AccountController.cs](https://github.com/aspnet/AspNetCore/blob/master/src/Azure/AzureAD/Authentication.AzureAD.UI/src/Areas/AzureAD/Controllers/AccountController.cs). The account control:

- Sets an OpenID redirect URI to `/Account/SignedOut` so that the controller is called back when Azure AD has performed the sign out
- Calls `Signout()`, which lets the OpenIdConnect middleware contact the Microsoft identity platform `logout` endpoint which:

  - Clears the session cookie from the browser, and
  - Calls finally calls back the **logout URL**, which )by default, displays the signed out view page [SignedOut.html](https://github.com/aspnet/AspNetCore/blob/master/src/Azure/AzureAD/Authentication.AzureAD.UI/src/Areas/AzureAD/Pages/Account/SignedOut.cshtml) also provided as part of ASP.NET Core.

### Intercepting the call to the `logout` endpoint

The ASP.NET Core OpenIdConnect middleware enables your app to intercept the call to the Microsoft identity platform `logout` endpoint by providing an OpenIdConnect event named `OnRedirectToIdentityProviderForSignOut`. The web app uses it to attempt to avoid the select account dialog to be presented to the user when signing out. This interception is done in the `AddAzureAdV2Authentication` of the `Microsoft.Identity.Web` reusable library. See [StartupHelpers.cs L58-L66](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/b87a1d859ff9f9a4a98eb7b701e6a1128d802ec5/Microsoft.Identity.Web/StartupHelpers.cs#L58-L66)

```CSharp
public static IServiceCollection AddAzureAdV2Authentication(this IServiceCollection services,
                                                            IConfiguration configuration)
{
    ...
    services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
    {
        ...
        options.Authority = options.Authority + "/v2.0/";
        ...
        // Attempt to avoid displaying the select account dialog when signing out
        options.Events.OnRedirectToIdentityProviderForSignOut = async context =>
        {
            var user = context.HttpContext.User;
            context.ProtocolMessage.LoginHint = user.GetLoginHint();
            context.ProtocolMessage.DomainHint = user.GetDomainHint();
            await Task.FromResult(0);
        };
    }
}
```

## ASP.NET Code

In ASP.NET, signing out is triggered from the SignOut() method on a Controller (for instance AccountController). This method isn't part of the ASP.NET framework (contrary to what happens in ASP.NET Core), and doesn't use async, and that's why it:

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
 MsalAppBuilder.ClearUserTokenCache();
 Response.Redirect("/");
}
```

## Protocol

If you don't want to use ASP.NET Core or ASP.NET, you can look at the protocol documentation, that is available from [Open ID Connect](./v2-protocols-oidc.md).

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-web-app-sign-user-production.md)
