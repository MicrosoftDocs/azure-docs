<properties
	pageTitle="Azure AD B2C .NET Getting Started | Microsoft Azure"
	description="How to build a .NET MVC Web application that integrates with Azure AD B2C for sign up & sign in."
	services="active-directory"
	documentationCenter=".net"
	authors="swkrish"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/03/2015"
	ms.author="swkrish"/>

# Web application Sign Up & Sign In with Azure AD B2C

[AZURE.INCLUDE [active-directory-devguide](../../includes/active-directory-devguide.md)]

Azure AD B2C makes it easy to add user sign up & sign in to your consumer-facing web application using only a few lines of code. Here, we will build a .NET MVC web application that:

- Allows users to sign up with Facebook or email address (local) accounts.
- Collects information from users during sign up.
- Allows users to sign in with Facebook or email address accounts (with passwords) previously used for sign up.
- Uses OpenID Connect to integrate sign up and sign in with the application, with some help from Microsoft's OWIN middleware.
- Displays the contents of id_tokens received after sign up and sign in.

> [AZURE.NOTE]
Local accounts allow consumers to sign in with arbitrary email addresses (& passwords) into your application; for example, 'joe@comcast.net'. Azure Active Directory B2C also allows local accounts with usernames (& passwords); for example, 'joe'.

Follow the steps below to get this done:

1. Register an application with Azure AD B2C.
2. Create a Sign-up policy and test.
3. Create a Sign-in policy and test.
4. Set up your application to use policies created in your directory.
5. Run the application and issue sign up, sign in and sign out requests to Azure AD B2C.
6. Add a custom user attribute to the directory.
7. Modify the Sign-up policy to use the custom attribute.
8. Register an application with Facebook.
9. Setup Facebook as an Identity Provider in your directory.
10. Modify the Sign-up and Sign-in policies to include Facebook as an Identity Provider.
11. Re-run the application to issue requests to Azure AD B2C.

Before you start, [download the sample](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip). It is a Visual Studio 2013 solution. Also complete the pre-requisites as described [here](active-directory-get-started-b2c.md), if you haven't done so already. Leave the B2C features blade on the [Azure Portal](https://portal.azure.com/) open.

## Step 1: Register an application with Azure AD B2C

To secure your application, you will first need to create an application in your directory and provide Azure AD B2C with a few key pieces of information.

- On the B2C features blade on the [Azure Portal](https://portal.azure.com/), click on **Applications**.
- Click **+Add** at the top of the blade.
- The **Name** of the application will describe your application to end users. Enter "B2C app".
- Click **Web app / Web API**.
- The **Reply URL** is the location that Azure AD B2C will use to return any tokens your application requests. Enter `https://localhost:44321/`. Click **OK**.
- Click **Create** to register your application.
- Open the application that you just created by clicking on it in the **Applications** blade.
- Click **Properties** and copy the **Client ID** of your application; you will need this value later on. Close out the two blades just opened. Leave the B2C features blade open.

## Step 2: Create a Sign-up policy and test

To enable sign up on your application, you will need to create a Sign-up policy. This policy describes the experiences that users will go through during sign up and the contents of tokens that the application will receive on successful sign ups.

> [AZURE.NOTE]
Policies are units of re-use. You can create multiple policies of the same type and use any policy in any application at run-time. Policies have a consistent developer interface; you invoke them in your applications using standard identity protocol requests and you receive tokens (customized by you) as responses.

- On the B2C features blade, click **Sign-up policies**.
- Click **+Add** at the top of the blade.
- The **Name** determines the sign-up policy name used by your application. Enter "SiUp".
- Click **Identity providers** and select "Email address". Click **OK**.
- Click **Sign-up attributes**. Here you choose attributes that you want to collect from the user during sign up. For the purposes of this tutorial, select "Display Name", "City" and "Postal Code". Click **OK**.
- Click **Application claims**. Here you can choose the claims that you want returned in the tokens back to your application after a successful sign up experience. For now, select "Display Name", "Postal Code", "Identity Provider" and "User's Object ID".
- Click **Create**. Note that the policy just created appears as "B2C_1_SiUp" (the B2C_1_ fragment is automatically added) in the **Sign-up policies** blade.
- Open the policy by clicking on it and click the **Run now** command at the top of the blade.

> [AZURE.NOTE]
The policy "Run now" command allows you to simulate and test user experience without writing a single line of code.

- Select "B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down. Click the **Run now** button.
- A new browser tab opens up and you can run through the user experience of signing up for your application.
- Go back to the browser tab where the Azure Portal is open. Close out the two blades just opened. Leave the B2C features blade open.

## Step 3: Create a Sign-in policy and test

To enable sign in on your application, you will need to create a Sign-in policy. This policy describes the experiences that users will go through during sign in and the contents of tokens that the application will receive on successful sign ins.

- On the B2C features blade, click **Sign-in policies**.
- Click **+Add** at the top of the blade.
- The **Name** determines the sign-in policy name used by your application. Enter "SiIn".
- Click **Identity providers** and select "Email address". Click **OK**.
- Click **Application claims**. Here you can choose the claims that you want returned in the tokens back to your application after a successful sign in experience. For now, select "Display Name", "Postal Code", "Identity Provider" and "User's Object ID".
- Click **Create**. Note that the policy just created appears as "B2C_1_SiIn" (the B2C_1_ fragment is automatically added) in the **Sign-in policies** blade.
- Open the policy by clicking on it and click the **Run now** command at the top of the blade.
- Select "B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down. Click the **Run now** button.
- A new browser tab opens up and you can run through the user experience of signing into your application.
- Go back to the browser tab where the Azure Portal is open. Close out the two blades just opened. Leave the B2C features blade open.










Azure AD makes it simple and straightforward to outsource your web 's identity management, providing single sign-in and sign-out with only a few lines of code.  In Asp.NET web apps, you can accomplish this using Microsoft's implementation of the community-driven OWIN middleware included in .NET Framework 4.5.  Here we'll use OWIN to:
-	Sign the user into the application using Azure AD as the identity provider.
-	Display some information about the user.
-	Sign the user out of the application.

In order to do this, you'll need to:

1. Register an application with Azure AD
2. Set up your application to use the OWIN authentication pipeline.
3. Use OWIN to issue sign-in and sign-out requests to Azure AD.
4. Print out data about the user.

To get started, [download the application skeleton](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip).  You'll also need an Azure AD tenant in which to register your application.  If you don't have one already, [learn how to get one](active-directory-howto-tenant.md).

## *1.	Register an Application with Azure AD*
To enable your application to authenticate users, you'll first need to register a new application in your tenant.

- Sign into the Azure Management Portal.
- In the left hand nav, click on **Active Directory**.
- Select the tenant where you wish to register the application.
- Click the **Applications** tab, and click add in the bottom drawer.
- Follow the prompts and create a new **Web Application and/or WebAPI**.
    - The **name** of the application will describe your application to end-users
    -	The **Sign-On URL** is the base URL of your application.  The skeleton's default is `https://localhost:44320/`.
    - The **application ID URI** is a unique identifier for your application.  The convention is to use `https://<tenant-domain>/<application-name>`, e.g. `https://contoso.onmicrosoft.com/my-first-aad-application`
- Once you've completed registration, AAD will assign your application a unique client identifier.  You'll need this value in the next sections, so copy it from the Configure tab.

## *2. Set up your application to use the OWIN authentication pipeline*
Here, we'll configure the OWIN middleware to use the OpenID Connect authentication protocol.  OWIN will be used to issue sign-in and sign-out requests, manage the user's session, and get information about the user, amongst other things.

-	To begin, add the OWIN middleware NuGet packages to the project using the Package Manager Console.

```
PM> Install-Package Microsoft.Owin.Security.OpenIdConnect
PM> Install-Package Microsoft.Owin.Security.Cookies
PM> Install-Package Microsoft.Owin.Host.SystemWeb
```

-	Add an OWIN Startup class to the project called `Startup.cs`  Right click on the project --> **Add** --> **New Item** --> Search for "OWIN".  The OWIN middleware will invoke the `Configuration(...)` method when your application starts.
-	Change the class declaration to `public partial class Startup` - we've already implemented part of this class for you in another file.  In the `Configuration(...)` method, make a call to ConfgureAuth(...) to set up authentication for your web application  

```C#
public partial class Startup
{
    public void Configuration(IAppBuilder application)
    {
        ConfigureAuth(application);
    }
}
```

-	Open the file `App_Start\Startup.Auth.cs` and implement the `ConfigureAuth(...)` method.  The parameters you provide in `OpenIDConnectAuthenticationOptions` will serve as coordinates for your application to communicate with Azure AD.  You'll also need to set up Cookie Authentication - the OpenID Connect middleware uses cookies underneath the covers.

```C#
public void ConfigureAuth(IAppBuilder application)
{
    application.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

    application.UseCookieAuthentication(new CookieAuthenticationOptions());

    application.UseOpenIdConnectAuthentication(
        new OpenIdConnectAuthenticationOptions
        {
            ClientId = clientId,
            Authority = authority,
            PostLogoutRedirectUri = postLogoutRedirectUri,
        });
}
```

-	Finally, open the `web.config` file in the root of the project, and enter your configuration values in the `<appSettings>` section.
    -	Your application's `ida:ClientId` is the Guid you copied from the Azure Portal in Step 1.
    -	The `ida:Tenant` is the name of your Azure AD tenant, e.g. "contoso.onmicrosoft.com".
    -	Your `ida:PostLogoutRedirectUri` indicates to Azure AD where a user should be redirected after a sign-out request successfully completes.

## *3. Use OWIN to issue sign-in and sign-out requests to Azure AD*
Your application is now properly configured to communicate with Azure AD using the OpenID Connect authentication protocol.  OWIN has taken care of all of the ugly details of crafting authentication messages, validating tokens from Azure AD, and maintaining user session.  All that remains is to give your users a way to sign in and sign out.

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

-	Now, open `Views\Shared\_LoginPartial.cshtml`.  This is where you'll show the user your application's sign-in and sign-out links, and print out the user's name in a view.

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
When authenticating users with OpenID Connect, Azure AD returns an id_token to the application that contains "claims," or assertions about the user.  You can use these claims to personalize your application:

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

Finally, build and run your application!  If you haven't already, now is the time to create a new user in your tenant with a *.onmicrosoft.com domain.  Sign in with that user, and notice how the user's identity is reflected in the top navigation bar.  Sign out, and sign back in as another user in your tenant.  If you're feeling particularly ambitious, register and run another instance of this application (with its own clientId), and watch see single-sign on in action.

For reference, the completed sample (without your configuration values) [is provided here](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip).  

You can now move onto more advanced topics.  You may want to try:

[Secure a Web API with Azure AD >>](active-directory-devquickstarts-webapi-dotnet.md)

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- [CloudIdentity.com >>](https://cloudidentity.com)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)
