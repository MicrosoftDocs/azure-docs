<properties
	pageTitle="Azure AD .NET Getting Started | Microsoft Azure"
	description="How to build a .NET MVC Web App that integrates with Azure AD for sign in."
	services="active-directory"
	documentationCenter=".net"
	authors="dstrockis"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="dastrock"/>

# Web App Sign In & Sign Out with Azure AD

Azure AD makes it simple and straightforward to outsource your web app's identity management, providing single sign-in and sign-out with only a few lines of code.  In Asp.NET web apps, you can accomplish this using Microsoft's implementation of the community-driven OWIN middleware included in .NET Framework 4.5.  Here we'll use OWIN to:
-	Sign the user into the app using Azure AD as the identity provider.
-	Display some information about the user.
-	Sign the user out of the app.

In order to do this, you'll need to:

1. Register an application with Azure AD
2. Set up your app to use the OWIN authentication pipeline.
3. Use OWIN to issue sign-in and sign-out requests to Azure AD.
4. Print out data about the user.

To get started, [download the app skeleton](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip).  You'll also need an Azure AD tenant in which to register your application.  If you don't have one already, [learn how to get one](active-directory-howto-tenant.md).

## *1.	Register an Application with Azure AD*
To enable your app to authenticate users, you'll first need to register a new application in your tenant.

- Sign into the Azure Management Portal.
- In the left hand nav, click on **Active Directory**.
- Select the tenant where you wish to register the application.
- Click the **Applications** tab, and click add in the bottom drawer.
- Follow the prompts and create a new **Web Application and/or WebAPI**.
    - The **name** of the application will describe your application to end-users
    -	The **Sign-On URL** is the base URL of your app.  The skeleton's default is `https://localhost:44320/`.
    - The **App ID URI** is a unique identifier for your application.  The convention is to use `https://<tenant-domain>/<app-name>`, e.g. `https://contoso.onmicrosoft.com/my-first-aad-app`
- Once you've completed registration, AAD will assign your app a unique client identifier.  You'll need this value in the next sections, so copy it from the Configure tab.

## *2. Set up your app to use the OWIN authentication pipeline*
Here, we'll configure the OWIN middleware to use the OpenID Connect authentication protocol.  OWIN will be used to issue sign-in and sign-out requests, manage the user's session, and get information about the user, amongst other things.

-	To begin, add the OWIN middleware NuGet packages to the project using the Package Manager Console.

```
PM> Install-Package Microsoft.Owin.Security.OpenIdConnect
PM> Install-Package Microsoft.Owin.Security.Cookies
PM> Install-Package Microsoft.Owin.Host.SystemWeb
```

-	Add an OWIN Startup class to the project called `Startup.cs`  Right click on the project --> **Add** --> **New Item** --> Search for "OWIN".  The OWIN middleware will invoke the `Configuration(...)` method when your app starts.
-	Change the class declaration to `public partial class Startup` - we've already implemented part of this class for you in another file.  In the `Configuration(...)` method, make a call to ConfgureAuth(...) to set up authentication for your web app  

```C#
public partial class Startup
{
    public void Configuration(IAppBuilder app)
    {
        ConfigureAuth(app);
    }
}
```

-	Open the file `App_Start\Startup.Auth.cs` and implement the `ConfigureAuth(...)` method.  The parameters you provide in `OpenIDConnectAuthenticationOptions` will serve as coordinates for your app to communicate with Azure AD.  You'll also need to set up Cookie Authentication - the OpenID Connect middleware uses cookies underneath the covers.

```C#
public void ConfigureAuth(IAppBuilder app)
{
    app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

    app.UseCookieAuthentication(new CookieAuthenticationOptions());

    app.UseOpenIdConnectAuthentication(
        new OpenIdConnectAuthenticationOptions
        {
            ClientId = clientId,
            Authority = authority,
            PostLogoutRedirectUri = postLogoutRedirectUri,
        });
}
```

-	Finally, open the `web.config` file in the root of the project, and enter your configuration values in the `<appSettings>` section.
    -	Your app's `ida:ClientId` is the Guid you copied from the Azure Portal in Step 1.
    -	The `ida:Tenant` is the name of your Azure AD tenant, e.g. "contoso.onmicrosoft.com".
    -	Your `ida:PostLogoutRedirectUri` indicates to Azure AD where a user should be redirected after a sign-out request successfully completes.

## *3. Use OWIN to issue sign-in and sign-out requests to Azure AD*
Your app is now properly configured to communicate with Azure AD using the OpenID Connect authentication protocol.  OWIN has taken care of all of the ugly details of crafting authentication messages, validating tokens from Azure AD, and maintaining user session.  All that remains is to give your users a way to sign in and sign out.

- You can use authorize tags in your controllers to require that user signs in before accessing a certain page.  Open `Controllers\HomeController.cs`, and add the `[Authorize]` tag to the About controller.

```C#
[Authorize]
public ActionResult About()
{
  ...
```

-	You can also use OWIN to directly issue authentication requests from within your code.  Open `Controllers\AccountController.cs`.  In the SignIn() and SignOut() actions, issue OpenID Connect challenge and sign-out requests, respectively.

```C#
public void SignIn()
{
    // Send an OpenID Connect sign-in request.
    if (!Request.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(new AuthenticationProperties { RedirectUri = "/" }, OpenIdConnectAuthenticationDefaults.AuthenticationType);
    }
}
public void SignOut()
{
    // Send an OpenID Connect sign-out request.
    HttpContext.GetOwinContext().Authentication.SignOut(
        OpenIdConnectAuthenticationDefaults.AuthenticationType, CookieAuthenticationDefaults.AuthenticationType);
}
```

-	Now, open `Views\Shared\_LoginPartial.cshtml`.  This is where you'll show the user your app's sign-in and sign-out links, and print out the user's name in a view.

```HTML
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

## *4.	Display user information*
When authenticating users with OpenID Connect, Azure AD returns an id_token to the application that contains "claims," or assertions about the user.  You can use these claims to personalize your app:

- Open the `Controllers\HomeController.cs` file.  You can access the user's claims in your controllers via the `ClaimsPrincipal.Current` security principal object.

```C#
public ActionResult About()
{
    ViewBag.Name = ClaimsPrincipal.Current.FindFirst(ClaimTypes.Name).Value;
    ViewBag.ObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
    ViewBag.GivenName = ClaimsPrincipal.Current.FindFirst(ClaimTypes.GivenName).Value;
    ViewBag.Surname = ClaimsPrincipal.Current.FindFirst(ClaimTypes.Surname).Value;
    ViewBag.UPN = ClaimsPrincipal.Current.FindFirst(ClaimTypes.Upn).Value;

    return View();
}
```

Finally, build and run your app!  If you haven't already, now is the time to create a new user in your tenant with a *.onmicrosoft.com domain.  Sign in with that user, and notice how the user's identity is reflected in the top navigation bar.  Sign out, and sign back in as another user in your tenant.  If you're feeling particularly ambitious, register and run another instance of this application (with its own clientId), and watch see single-sign on in action.

For reference, the completed sample (without your configuration values) [is provided here](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip).  

You can now move onto more advanced topics.  You may want to try:

[Secure a Web API with Azure AD >>](active-directory-devquickstarts-webapi-dotnet.md)

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- [CloudIdentity.com >>](https://cloudidentity.com)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)
