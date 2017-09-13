---
title: Azure AD .NET web app Getting Started | Microsoft Docs
description: Build a .NET MVC web app that integrates with Azure AD for sign-in.
services: active-directory
documentationcenter: .net
author: dstrockis
manager: mbaldwin
editor: ''

ms.assetid: e15a41a4-dc5d-4c90-b3fe-5dc33b9a1e96
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 01/23/2017
ms.author: dastrock
ms.custom: aaddev

---
# ASP.NET web app sign-in and sign-out with Azure AD
[!INCLUDE [active-directory-devguide](../../../includes/active-directory-devguide.md)]

By providing a single sign-in and sign-out with only a few lines of code, Azure Active Directory (Azure AD) makes it simple for you to outsource web-app identity management. You can sign users in and out of ASP.NET web apps by using the Microsoft implementation of Open Web Interface for .NET (OWIN) middleware. Community-driven OWIN middleware is included in .NET Framework 4.5. This article shows how to use OWIN to:

* Sign users in to web apps by using Azure AD as the identity provider.
* Display some user information.
* Sign users out of the apps.

## Before you get started
* Download the [app skeleton](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/skeleton.zip) or download the [completed sample](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip).
* You also need an Azure AD tenant in which to register the app. If you don't already have an Azure AD tenant, [learn how to get one](active-directory-howto-tenant.md).

When you are ready, follow the procedures in the next four sections.

## Step 1: Register the new app with Azure AD
To set up the app to authenticate users, first register it in your tenant by doing the following:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, click your account name. Under the **Directory** list, select the Active Directory tenant where you want to register the app.
3. Click **More Services** in the left pane, and then select **Azure Active Directory**.
4. Click **App registrations**, and then select **Add**.
5. Follow the prompts to create a new **Web Application and/or WebAPI**.
  * **Name** describes the app to users.
  * **Sign-On URL** is the base URL of the app. The skeleton's default URL is https://localhost:44320/.
6. After you've completed the registration, Azure AD assigns the app a unique application ID. Copy the value from the app page to use in the next sections.
7. From the **Settings** -> **Properties** page for your application, update the App ID URI. The **App ID URI** is a unique identifier for the app. The naming convention is `https://<tenant-domain>/<app-name>` (for example, `https://contoso.onmicrosoft.com/my-first-aad-app`).

## Step 2: Set up the app to use the OWIN authentication pipeline
In this step, you configure the OWIN middleware to use the OpenID Connect authentication protocol. You use OWIN to issue sign-in and sign-out requests, manage user sessions, get user information, and so forth.

1. To begin, add the OWIN middleware NuGet packages to the project by using the Package Manager Console.

     ```
     PM> Install-Package Microsoft.Owin.Security.OpenIdConnect
     PM> Install-Package Microsoft.Owin.Security.Cookies
     PM> Install-Package Microsoft.Owin.Host.SystemWeb
     ```

2. To add an OWIN Startup class to the project called `Startup.cs`, right-click the project, select **Add**, select **New Item**, and then search for **OWIN**. The OWIN middleware invokes the **Configuration(...)** method when the app starts.
3. Change the class declaration to `public partial class Startup`. We've already implemented part of this class for you in another file. In the **Configuration(...)** method, make a call to **ConfgureAuth(...)** to set up authentication for the app.  

     ```C#
     public partial class Startup
     {
         public void Configuration(IAppBuilder app)
         {
             ConfigureAuth(app);
         }
     }
     ```

4. Open the App_Start\Startup.Auth.cs file, and then implement the **ConfigureAuth(...)** method. The parameters you provide in *OpenIDConnectAuthenticationOptions* serve as coordinates for the app to communicate with Azure AD. You also need to set up cookie authentication, because the OpenID Connect middleware uses cookies in the background.

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
                 Notifications = new OpenIdConnectAuthenticationNotifications
                    {
                        AuthenticationFailed = context =>
                        {
                            context.HandleResponse();
                            context.Response.Redirect("/Error?message=" + context.Exception.Message);
                            return Task.FromResult(0);
                        }
                    }
             });
     }
     ```

5. Open the web.config file in the root of the project, and then enter the configuration values in the `<appSettings>` section.
  * `ida:ClientId`: The GUID you copied from the Azure portal in "Step 1: Register the new app with Azure AD."
  * `ida:Tenant`: The name of your Azure AD tenant (for example, contoso.onmicrosoft.com).
  * `ida:PostLogoutRedirectUri`: The indicator that tells Azure AD where a user should be redirected after a sign-out request is successfully completed.

## Step 3: Use OWIN to issue sign-in and sign-out requests to Azure AD
The app is now properly configured to communicate with Azure AD by using the OpenID Connect authentication protocol. OWIN has handled all of the details of crafting authentication messages, validating tokens from Azure AD, and maintaining user sessions. All that remains is to give your users a way to sign in and sign out.

1. You can use authorize tags in your controllers to require users to sign in before they access certain pages. To do so, open Controllers\HomeController.cs, and then add the `[Authorize]` tag to the About controller.

     ```C#
     [Authorize]
     public ActionResult About()
     {
       ...
     ```

2. You can also use OWIN to directly issue authentication requests from within your code. To do so, open Controllers\AccountController.cs. Then, in the SignIn() and SignOut() actions, issue OpenID Connect challenge and sign-out requests.

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

3. Open Views\Shared\_LoginPartial.cshtml to show the user the app sign-in and sign-out links, and to print out the user's name in a view.

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

## Step 4: Display user information
When it authenticates users with OpenID Connect, Azure AD returns an id_token to the app that contains "claims," or assertions about the user. You can use these claims to personalize the app by doing the following:

1. Open the Controllers\HomeController.cs file. You can access the user's claims in your controllers via the `ClaimsPrincipal.Current` security principal object.

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

2. Build and run the app. If you haven't already created a new user in your tenant with an onmicrosoft.com domain, now is the time to do so. Here's how:

  a. Sign in with that user, and note how the user's identity is reflected on the top bar.

  b. Sign out, and then sign back in as another user in your tenant.

  c. If you're feeling particularly ambitious, register and run another instance of this app (with its own clientId), and watch single sign-in in action.

## Next steps
For reference, see [the completed sample](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip) (without your configuration values).

You can now move on to more advanced topics. For example, try [Secure a Web API with Azure AD](active-directory-devquickstarts-webapi-dotnet.md).

[!INCLUDE [active-directory-devquickstarts-additional-resources](../../../includes/active-directory-devquickstarts-additional-resources.md)]
