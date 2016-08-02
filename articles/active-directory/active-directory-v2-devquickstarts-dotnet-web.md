<properties
	pageTitle="Azure AD v2.0 .NET Web App | Microsoft Azure"
	description="How to build a .NET MVC Web App that signs users in with both personal Microsoft Account and work or school accounts."
	services="active-directory"
	documentationCenter=".net"
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="dastrock"/>

# Add sign-in to an .NET MVC web app

With the v2.0 endpoint, you can quickly add authentication to your web apps with support for both personal Microsoft accounts and work or school accounts.  In ASP.NET web apps, you can accomplish this using Microsoft's OWIN middleware included in .NET Framework 4.5.

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

 Here we'll build an web app that uses OWIN to sign the user in, display some information about the user, and sign the user out of the app.
 
 ## Download
The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIdConnect-DotNet).  To follow along, you can [download the app's skeleton as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIdConnect-DotNet/archive/skeleton.zip) or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIdConnect-DotNet.git```

The completed app is provided at the end of this tutorial as well.

## Register an app
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Copy down the **Application Id** assigned to your app, you'll need it soon.
- Add the **Web** platform for your app.
- Enter the correct **Redirect URI**. The redirect uri indicates to Azure AD where authentication responses should be directed - the default for this tutorial is `https://localhost:44326/`.

## Install & configure OWIN authentication
Here, we'll configure the OWIN middleware to use the OpenID Connect authentication protocol.  OWIN will be used to issue sign-in and sign-out requests, manage the user's session, and get information about the user, amongst other things.

-	To begin, open the `web.config` file in the root of the project, and enter your app's configuration values in the `<appSettings>` section.
    -	The `ida:ClientId` is the **Application Id** assigned to your app in the registration portal.
    -	The `ida:RedirectUri` is the **Redirect Uri** you entered in the portal.

-	Next, add the OWIN middleware NuGet packages to the project using the Package Manager Console.

```
PM> Install-Package Microsoft.Owin.Security.OpenIdConnect
PM> Install-Package Microsoft.Owin.Security.Cookies
PM> Install-Package Microsoft.Owin.Host.SystemWeb
```

-	Add an "OWIN Startup Class" to the project called `Startup.cs`  Right click on the project --> **Add** --> **New Item** --> Search for "OWIN".  The OWIN middleware will invoke the `Configuration(...)` method when your app starts.
-	Change the class declaration to `public partial class Startup` - we've already implemented part of this class for you in another file.  In the `Configuration(...)` method, make a call to ConfigureAuth(...) to set up authentication for your web app  

```C#
[assembly: OwinStartup(typeof(Startup))]

namespace TodoList_WebApp
{
	public partial class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			ConfigureAuth(app);
		}
	}
}
```

-	Open the file `App_Start\Startup.Auth.cs` and implement the `ConfigureAuth(...)` method.  The parameters you provide in `OpenIdConnectAuthenticationOptions` will serve as coordinates for your app to communicate with Azure AD.  You'll also need to set up Cookie Authentication - the OpenID Connect middleware uses cookies underneath the covers.

```C#
public void ConfigureAuth(IAppBuilder app)
			 {
					 app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

					 app.UseCookieAuthentication(new CookieAuthenticationOptions());

					 app.UseOpenIdConnectAuthentication(
							 new OpenIdConnectAuthenticationOptions
							 {
									 // The `Authority` represents the v2.0 endpoint - https://login.microsoftonline.com/common/v2.0 
									 // The `Scope` describes the permissions that your app will need.  See https://azure.microsoft.com/documentation/articles/active-directory-v2-scopes/
									 // In a real application you could use issuer validation for additional checks, like making sure the user's organization has signed up for your app, for instance.

									 ClientId = clientId,
									 Authority = String.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0 "),
									 RedirectUri = redirectUri,
									 Scope = "openid email profile",
									 ResponseType = "id_token",
									 PostLogoutRedirectUri = redirectUri,
									 TokenValidationParameters = new TokenValidationParameters
									 {
											 ValidateIssuer = false,
									 },
									 Notifications = new OpenIdConnectAuthenticationNotifications
									 {
											 AuthenticationFailed = OnAuthenticationFailed,
									 }
							 });
			 }
```

## Send authentication requests
Your app is now properly configured to communicate with the v2.0 endpoint using the OpenID Connect authentication protocol.  OWIN has taken care of all of the ugly details of crafting authentication messages, validating tokens from Azure AD, and maintaining user session.  All that remains is to give your users a way to sign in and sign out.

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

// BUGBUG: Ending a session with the v2.0 endpoint is not yet supported.  Here, we just end the session with the web app.  
public void SignOut()
{
    // Send an OpenID Connect sign-out request.
    HttpContext.GetOwinContext().Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
    Response.Redirect("/");
}
```

-	Now, open `Views\Shared\_LoginPartial.cshtml`.  This is where you'll show the user your app's sign-in and sign-out links, and print out the user's name in a view.

```HTML
@if (Request.IsAuthenticated)
{
    <text>
        <ul class="nav navbar-nav navbar-right">
            <li class="navbar-text">

                @*The 'preferred_username' claim can be used for showing the user's primary way of identifying themselves.*@

                Hello, @(System.Security.Claims.ClaimsPrincipal.Current.FindFirst("preferred_username").Value)!
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

## Display user information
When authenticating users with OpenID Connect, the v2.0 endpoint returns an id_token to the app that contains [claims](active-directory-v2-tokens.md#id_tokens), or assertions about the user.  You can use these claims to personalize your app:

- Open the `Controllers\HomeController.cs` file.  You can access the user's claims in your controllers via the `ClaimsPrincipal.Current` security principal object.

```C#
[Authorize]
public ActionResult About()
{
    ViewBag.Name = ClaimsPrincipal.Current.FindFirst("name").Value;

    // The object ID claim will only be emitted for work or school accounts at this time.
    Claim oid = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier");
    ViewBag.ObjectId = oid == null ? string.Empty : oid.Value;

    // The 'preferred_username' claim can be used for showing the user's primary way of identifying themselves
    ViewBag.Username = ClaimsPrincipal.Current.FindFirst("preferred_username").Value;

    // The subject or nameidentifier claim can be used to uniquely identify the user
    ViewBag.Subject = ClaimsPrincipal.Current.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;

    return View();
}
```

## Run

Finally, build and run your app!   Sign in with either a personal Microsoft Account or a work or school account, and notice how the user's identity is reflected in the top navigation bar.  You now have a web app secured using industry standard protocols that can authenticate users with both their personal and work/school accounts.

For reference, the completed sample (without your configuration values) [is provided as a .zip here](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIdConnect-DotNet/archive/complete.zip), or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIdConnect-DotNet.git```

## Next steps

You can now move onto more advanced topics.  You may want to try:

[Secure a Web API with the the v2.0 endpoint >>](active-directory-devquickstarts-webapi-dotnet.md)

For additional resources, check out:
- [The v2.0 developer guide >>](active-directory-appmodel-v2-overview.md)
- [StackOverflow "azure-active-directory" tag >>](http://stackoverflow.com/questions/tagged/azure-active-directory)

## Get security updates for our products

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.
