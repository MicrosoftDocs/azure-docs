---
title: Authentication, sign-up, password reset in Azure Active Directory B2C | Microsoft Docs
description: How to build a web application that has sign-up/sign-in, profile edit, and password reset using Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/17/2017
ms.author: davidmu
ms.component: B2C
---

# Create an ASP.NET web app with Azure Active Directory B2C sign-up, sign-in, profile edit, and password reset

This tutorial shows you how to:

> [!div class="checklist"]
> * Add Azure AD B2C identity features to your web app
> * Register your web app in your Azure AD B2C directory
> * Create a user sign-up/sign-in, profile edit, and password reset policy for your web app

## Prerequisites

- You must connect your B2C Tenant to an Azure account. You can create a free Azure account [here](https://azure.microsoft.com/).
- You need [Microsoft Visual Studio](https://www.visualstudio.com/) or a similar program to view and modify the sample code.

## Create an Azure AD B2C tenant

Before you can use Azure AD B2C, you must create a tenant. A tenant is a container for all your users, apps, groups, and more. If you don't have one already, create a B2C tenant before you continue in this guide.

[!INCLUDE [active-directory-b2c-create-tenant](../../includes/active-directory-b2c-create-tenant.md)]

> [!NOTE]
> 
> You need to connect the Azure AD B2C tenant to your Azure subscription. After selecting **Create**, select the **Link an existing Azure AD B2C Tenant to my Azure subscription** option, and then in the **Azure AD B2C Tenant** drop down, select the tenant you want to associate.

## Create and register an application

Next, you need to create and register the app in your Azure AD B2C tenant. This provides information that Azure AD B2C needs to securely communicate with your app. 

Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**. You should now be using the tenant that you previously created.

[!INCLUDE [active-directory-b2c-register-web-api](../../includes/active-directory-b2c-register-web-api.md)]

When you are done, you will have both an API and a native application in your application settings.

## Create policies on your B2C tenant

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). This code sample contains three identity experiences: **sign-up & sign-in**, **profile edit**, and **password reset**.  You need to create one policy of each type, as described in the [policy reference article](active-directory-b2c-reference-policies.md). For each policy, be sure to select the Display name attribute or claim, and to copy down the name of your policy for later use.

### Add your identity providers

From your settings, select **Identity Providers** and choose Username signup or Email signup.

### Create a sign-up and sign-in policy

[!INCLUDE [active-directory-b2c-create-sign-in-sign-up-policy](../../includes/active-directory-b2c-create-sign-in-sign-up-policy.md)]

### Create a profile editing policy

[!INCLUDE [active-directory-b2c-create-profile-editing-policy](../../includes/active-directory-b2c-create-profile-editing-policy.md)]

### Create a password reset policy

[!INCLUDE [active-directory-b2c-create-password-reset-policy](../../includes/active-directory-b2c-create-password-reset-policy.md)]

After you create your policies, you're ready to build your app.

## Download the sample code

The code for this tutorial is maintained on [GitHub](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi). You can clone the sample by running:

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi.git
```

After you download the sample code, open the Visual Studio .sln file to get started. The solution file contains two projects: `TaskWebApp` and `TaskService`. `TaskWebApp` is the MVC web application that the user interacts with. `TaskService` is the app's back-end web API that stores each user's to-do list. This article will only discuss the `TaskWebApp` application. To learn how to build `TaskService` using Azure AD B2C, see [our .NET web api tutorial](active-directory-b2c-devquickstarts-api-dotnet.md).

## Update code to use your tenant and policies

Our sample is configured to use the policies and client ID of our demo tenant. To connect it to your own tenant, you need to open `web.config` in the `TaskWebApp` project and replace the following values:

* `ida:Tenant` with your tenant name
* `ida:ClientId` with your web app application ID
* `ida:ClientSecret` with your web app secret key
* `ida:SignUpSignInPolicyId` with your "Sign-up or Sign-in" policy name
* `ida:EditProfilePolicyId` with your "Edit Profile" policy name
* `ida:ResetPasswordPolicyId` with your "Reset Password" policy name

## Launch the app
From within Visual Studio, launch the app. Navigate to the To-Do List tab, and note the URl is:
https://*YourTenantName*.b2clogin.com/*YourTenantName*/oauth2/v2.0/authorize?p=*YourSignUpPolicyName*&client_id=*YourclientID*.....

Sign up for the app by using your email address or user name. Sign out, then sign in again and edit the profile or reset the password. Sign out and sign in as a different user. 

## Add social IDPs

Currently, the app supports only user sign-up and sign-in by using **local accounts**; accounts stored in your B2C directory that use a user name and password. By using Azure AD B2C, you can add support for other **identity providers** (IDPs) without changing any of your code.

To add social IDPs to your app, begin by following the detailed instructions in these articles. For each IDP you want to support, you need to register an application in that system and obtain a client ID.

* [Set up Facebook as an IDP](active-directory-b2c-setup-fb-app.md)
* [Set up Google as an IDP](active-directory-b2c-setup-goog-app.md)
* [Set up Amazon as an IDP](active-directory-b2c-setup-amzn-app.md)
* [Set up LinkedIn as an IDP](active-directory-b2c-setup-li-app.md)

After you add the identity providers to your B2C directory, edit each of your three policies to include the new IDPs, as described in the [policy reference article](active-directory-b2c-reference-policies.md). After you save your policies, run the app again.  You should see the new IDPs added as sign-in and sign-up options in each of your identity experiences.

You can experiment with your policies and observe the effect on your sample app. Add or remove IDPs, manipulate application claims, or change sign-up attributes. Experiment until you can see how policies, authentication requests, and OWIN tie together.

## Sample code walkthrough
The following sections show you how the sample application code is configured. You may use this as a guide in your future app development.

### Add authentication support

You can now configure your app to use Azure AD B2C. Your app communicates with Azure AD B2C by sending OpenID Connect authentication requests. The requests dictate the user experience your app wants to execute by specifying the policy. You can use Microsoft's OWIN library to send these requests, execute policies, manage user sessions, and more.

#### Install OWIN

To begin, add the OWIN middleware NuGet packages to the project by using the Visual Studio Package Manager Console.

```Console
PM> Install-Package Microsoft.Owin.Security.OpenIdConnect
PM> Install-Package Microsoft.Owin.Security.Cookies
PM> Install-Package Microsoft.Owin.Host.SystemWeb
```

#### Add an OWIN startup class

Add an OWIN startup class to the API called `Startup.cs`.  Right-click on the project, select **Add** and **New Item**, and then search for OWIN. The OWIN middleware will invoke the `Configuration(…)` method when your app starts.

In our sample, we changed the class declaration to `public partial class Startup` and implemented the other part of the class in `App_Start\Startup.Auth.cs`. Inside the `Configuration` method, we added a call to `ConfigureAuth`, which is defined in `Startup.Auth.cs`. After the modifications, `Startup.cs` looks like the following:

```CSharp
// Startup.cs

public partial class Startup
{
    // The OWIN middleware will invoke this method when the app starts
    public void Configuration(IAppBuilder app)
    {
        // ConfigureAuth defined in other part of the class
        ConfigureAuth(app);
    }
}
```

#### Configure the authentication middleware

Open the file `App_Start\Startup.Auth.cs` and implement the `ConfigureAuth(...)` method. The parameters you provide in `OpenIdConnectAuthenticationOptions` serve as coordinates for your app to communicate with Azure AD B2C. If you do not specify certain parameters, it will use the default value. For example, we do not specify the `ResponseType` in the sample, so the default value `code id_token` will be used in each outgoing request to Azure AD B2C.

You also need to set up cookie authentication. The OpenID Connect middleware uses cookies to maintain user sessions, among other things.

```CSharp
// App_Start\Startup.Auth.cs

public partial class Startup
{
    // Initialize variables ...

    // Configure the OWIN middleware
    public void ConfigureAuth(IAppBuilder app)
    {
        app.UseCookieAuthentication(new CookieAuthenticationOptions());
        app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

        app.UseOpenIdConnectAuthentication(
            new OpenIdConnectAuthenticationOptions
            {
                // Generate the metadata address using the tenant and policy information
                MetadataAddress = String.Format(AadInstance, Tenant, DefaultPolicy),

                // These are standard OpenID Connect parameters, with values pulled from web.config
                ClientId = ClientId,
                RedirectUri = RedirectUri,
                PostLogoutRedirectUri = RedirectUri,

                // Specify the callbacks for each type of notifications
                Notifications = new OpenIdConnectAuthenticationNotifications
                {
                    RedirectToIdentityProvider = OnRedirectToIdentityProvider,
                    AuthorizationCodeReceived = OnAuthorizationCodeReceived,
                    AuthenticationFailed = OnAuthenticationFailed,
                },

                // Specify the claims to validate
                TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "name"
                },

                // Specify the scope by appending all of the scopes requested into one string (seperated by a blank space)
                Scope = $"openid profile offline_access {ReadTasksScope} {WriteTasksScope}"
            }
        );
    }

    // Implement the "Notification" methods...
}
```

In `OpenIdConnectAuthenticationOptions` above, we define a set of callback functions for specific notifications that are received by the OpenID Connect middleware. These behaviors are defined using a `OpenIdConnectAuthenticationNotifications` object and stored into the `Notifications` variable. In our sample, we define three different callbacks depending on the event.

### Using different policies

The `RedirectToIdentityProvider` notification is triggered whenever a request is made to Azure AD B2C. In the callback function `OnRedirectToIdentityProvider`, we check in the outgoing call if we want to use a different policy. In order to do a password reset or edit a profile, you need to use the corresponding policy such as the password reset policy instead of the default "Sign-up or Sign-in" policy.

In our sample, when a user wants to reset the password or edit the profile, we add the policy we prefer to use into the OWIN context. That can be done by doing the following:

```CSharp
    // Let the middleware know you are trying to use the edit profile policy
    HttpContext.GetOwinContext().Set("Policy", EditProfilePolicyId);
```

And you can implement the callback function `OnRedirectToIdentityProvider` by doing the following:

```CSharp
/*
*  On each call to Azure AD B2C, check if a policy (e.g. the profile edit or password reset policy) has been specified in the OWIN context.
*  If so, use that policy when making the call. Also, don't request a code (since it won't be needed).
*/
private Task OnRedirectToIdentityProvider(RedirectToIdentityProviderNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> notification)
{
    var policy = notification.OwinContext.Get<string>("Policy");

    if (!string.IsNullOrEmpty(policy) && !policy.Equals(DefaultPolicy))
    {
        notification.ProtocolMessage.Scope = OpenIdConnectScopes.OpenId;
        notification.ProtocolMessage.ResponseType = OpenIdConnectResponseTypes.IdToken;
        notification.ProtocolMessage.IssuerAddress = notification.ProtocolMessage.IssuerAddress.Replace(DefaultPolicy, policy);
    }

    return Task.FromResult(0);
}
```

### Handling authorization codes

The `AuthorizationCodeReceived` notification is triggered when an authorization code is received. The OpenID Connect middleware does not support exchanging codes for access tokens. You can manually exchange the code for the token in a callback function. For more information, please look at the [documentation](active-directory-b2c-devquickstarts-web-api-dotnet.md) that explains how.

### Handling errors

The `AuthenticationFailed` notification is triggered when authentication fails. In its callback method, you can handle the errors as you wish. You should however add a check for the error code `AADB2C90118`. During the execution of the "Sign-up or Sign-in" policy, the user has the opportunity to select a **Forgot your password?** link. In this event, Azure AD B2C sends your app that error code indicating that your app should make a request using the password reset policy instead.

```CSharp
/*
* Catch any failures received by the authentication middleware and handle appropriately
*/
private Task OnAuthenticationFailed(AuthenticationFailedNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> notification)
{
    notification.HandleResponse();

    // Handle the error code that Azure AD B2C throws when trying to reset a password from the login page
    // because password reset is not supported by a "sign-up or sign-in policy"
    if (notification.ProtocolMessage.ErrorDescription != null && notification.ProtocolMessage.ErrorDescription.Contains("AADB2C90118"))
    {
        // If the user clicked the reset password link, redirect to the reset password route
        notification.Response.Redirect("/Account/ResetPassword");
    }
    else if (notification.Exception.Message == "access_denied")
    {
        notification.Response.Redirect("/");
    }
    else
    {
        notification.Response.Redirect("/Home/Error?message=" + notification.Exception.Message);
    }

    return Task.FromResult(0);
}
```

### Send authentication requests to Azure AD

Your app is now properly configured to communicate with Azure AD B2C by using the OpenID Connect authentication protocol. OWIN manages the details of crafting authentication messages, validating tokens from Azure AD B2C, and maintaining user session. All that remains is to initiate each user's flow.

When a user selects **Sign up/Sign in**, **Edit profile**, or **Reset password** in the web app, the associated action is invoked in `Controllers\AccountController.cs`:

```CSharp
// Controllers\AccountController.cs

/*
*  Called when requesting to sign up or sign in
*/
public void SignUpSignIn()
{
    // Use the default policy to process the sign up / sign in flow
    if (!Request.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge();
        return;
    }

    Response.Redirect("/");
}

/*
*  Called when requesting to edit a profile
*/
public void EditProfile()
{
    if (Request.IsAuthenticated)
    {
        // Let the middleware know you are trying to use the edit profile policy (see OnRedirectToIdentityProvider in Startup.Auth.cs)
        HttpContext.GetOwinContext().Set("Policy", Startup.EditProfilePolicyId);

        // Set the page to redirect to after editing the profile
        var authenticationProperties = new AuthenticationProperties { RedirectUri = "/" };
        HttpContext.GetOwinContext().Authentication.Challenge(authenticationProperties);

        return;
    }

    Response.Redirect("/");

}

/*
*  Called when requesting to reset a password
*/
public void ResetPassword()
{
    // Let the middleware know you are trying to use the reset password policy (see OnRedirectToIdentityProvider in Startup.Auth.cs)
    HttpContext.GetOwinContext().Set("Policy", Startup.ResetPasswordPolicyId);

    // Set the page to redirect to after changing passwords
    var authenticationProperties = new AuthenticationProperties { RedirectUri = "/" };
    HttpContext.GetOwinContext().Authentication.Challenge(authenticationProperties);

    return;
}
```

You can also use OWIN to sign out the user from the app. In `Controllers\AccountController.cs` we have:

```CSharp
// Controllers\AccountController.cs

/*
*  Called when requesting to sign out
*/
public void SignOut()
{
    // To sign out the user, you should issue an OpenIDConnect sign out request.
    if (Request.IsAuthenticated)
    {
        IEnumerable<AuthenticationDescription> authTypes = HttpContext.GetOwinContext().Authentication.GetAuthenticationTypes();
        HttpContext.GetOwinContext().Authentication.SignOut(authTypes.Select(t => t.AuthenticationType).ToArray());
        Request.GetOwinContext().Authentication.GetAuthenticationTypes();
    }
}
```

In addition to explicitly invoking a policy, you can use a `[Authorize]` tag in your controllers that executes a policy if the user is not signed in. Open `Controllers\HomeController.cs` and add the `[Authorize]` tag to the claims controller.  OWIN selects the last policy configured when the `[Authorize]` tag is hit.

```CSharp
// Controllers\HomeController.cs

// You can use the Authorize decorator to execute a certain policy if the user is not already signed into the app.
[Authorize]
public ActionResult Claims()
{
  ...
```

### Display user information

When you authenticate users by using OpenID Connect, Azure AD B2C returns an ID token to the app that contains **claims**. These are assertions about the user. You can use claims to personalize your app.

Open the `Controllers\HomeController.cs` file. You can access user claims in your controllers via the `ClaimsPrincipal.Current` security principal object.

```CSharp
// Controllers\HomeController.cs

[Authorize]
public ActionResult Claims()
{
    Claim displayName = ClaimsPrincipal.Current.FindFirst(ClaimsPrincipal.Current.Identities.First().NameClaimType);
    ViewBag.DisplayName = displayName != null ? displayName.Value : string.Empty;
    return View();
}
```

You can access any claim that your application receives in the same way.  A list of all the claims the app receives is available for you on the **Claims** page.
