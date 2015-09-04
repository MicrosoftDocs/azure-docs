<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="How to build a web application with Sign-In, Sign-Up, and Profile Managment using Azure AD B2C."
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
	ms.date="09/03/2015"
	ms.author="dastrock"/>

# Azure AD B2C Preview: Build a .NET web app

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-web-switcher](../../includes/active-directory-b2c-devquickstarts-web-switcher.md)]-->

With Azure AD B2C, you can add powerful self-service identity managment features to your web app in a few short steps.  This article will show you how
to create a .NET MVC web app that includes user sign-up, sign-in, and profile management.  It will include support for sign-up & sign-in with social accounts
such as Facebook & Google, as well as local accounts with a username and password.  If you're new to Azure AD B2C, this is a good place to
start.

> [AZURE.NOTE]
	This information applies to the Azure AD B2C preview.  For information on how to integrate with the generally available Azure AD service, 
	please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

A typical consumer facing app might have several identity managment flows - sign-up, sign-in, profile/preference managment, de-activation, and so on.
In Azure AD B2C, each of these user flows is represented as a **policy**.  A policy is basically a group of settings that describes how a user
flow should be executed.  For instance, your app might use a sign-up policy that requires the user to provide their first name, last name,
and email address during registration.  Policies can be used to control a several different behaviors, like: 

- which flow should be executed (sign-up, sign-in, etc).
- flow-specific information, like the data that should be collected from the user on sign up.
- which types of accounts can be used (username & password, Facebook, Google, LinkedIn).
- whether or not the user should complete multi-factor authentication.
- the information that your app should receive when the flow completes.

Every time your app wants to execute a policy, your app simply sends an HTTP authentication request to Azure AD, passing a policy identifier in the request.
You can either craft these authentication requests yourself using our [OpenID Connect or OAuth 2.0 protocol reference](), or use our [open source libraries]()
to do the job for you.  After a policy has been successfully completed, your app will receive back a security token from Azure AD, which can be used to sign the user
into the app, modify UI, update application data, etc.  Every flow in Azure AD B2C is, in fact, an authentication request.  It's just that the steps the user must
take to complete the request vary from policy to policy.  To learn more about policies in Azure AD B2C, check 
out [the policy reference article](active-directory-b2c-reference-policies.md).

For .NET web applications, you can use Microsoft's OWIN library to implement OpenID Connect authentication and execute policies.  In this article, we'll use OWIN to:

- Implement a sign-up, sign-in, and edit profile flow using policies.
- Display some information about the user.
- Sign the user out of the app.

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIdConnect-DotNet).  To follow along, you can 
[download a skeleton project as a .zip](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIdConnect-DotNet/archive/skeleton.zip) or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIdConnect-DotNet.git```

The completed app also [available as a .zip here](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIdConnect-DotNet/archive/complete.zip) or on the
`complete` branch of the same repo.

## 1. Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all your users, apps, groups, and so on.  If you don't have
one already, go [create a B2C directory](active-directory-b2c-get-started.md) before moving on.

## 2. Create an application

Now you need to create an app in your B2C directory, which gives Azure AD some information that it needs to securely communicate with your app.  To create an app,
follow [these instructions](active-directory-b2c-app-registration.md).  Be sure to

- Enter `https://localhost:44316/` as a **Reply URL** - the default URL for this code sample.
- Copy down the **Application ID** that is assigned to your app.  You will need it shortly.

## 3. Set up your IDPs

When you create your policies, you can choose which types of accounts you want to support - each type of account corresponds to an **identity provider**, or IDP.
For each IDP you want to support, you will need to register an application in their system and obtain a client ID.  For the purposes of the tutorial, we recommend 
that you choose one or two social IDPs to support in addition to local accounts:

- [Set up Facebook as an IDP](active-directory-b2c-setup-fb-app.md)
- [Set up Google as an IDP](active-directory-b2c-setup-goog-app.md)
- [Set up Amazon as an IDP](active-directory-b2c-setup-amzn-app.md)
- [Set up LinkedIn as an IDP](active-directory-b2c-setup-li-app.md) 

While configuring your IDPs, be sure to choose "Email" or "Username" for your tenant's local accounts, depending on your preference. 

## 4. Create your policies

This tutorial contains three user flows - sign-up, sign-in, and edit profile.  You will need to create one policy of each type, as described in the 
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy).  When creating your three policies, be sure to:

- Choose whichever IDPs you want to use in your app.
- Choose a few sign-up attributes to collect from a user during registration.
- Choose the **Display Name** claim as an application claim in each policy.  You can choose any other claims as well.
- Copy down the **Name** of each policy after you create it.  It should have the prefix `b2c_1_`.  You'll need those policy names shortly. 
- For now, you can ignore the Multifactor authentication and Page UI customization sections.

Once you have your three policies successfully created, you're ready to build your app.  Open up the solution in Visual Studio to get started.

## 5. Install & configure the OWIN authentication pipeline
Here, we'll configure the OWIN middleware to use the OpenID Connect authentication protocol.  OWIN will be used to send authentication requests,
manage the user's session, and get information about the user, amongst other things.

To begin, open the `web.config` file in the root of the project, and enter your app's configuration values in the `<appSettings>` section.

- The `ida:Tenant` is the name of your B2C directory - it usually looks like contoso.onmicrosoft.com.
- The `ida:ClientId` is the **Application Id** assigned to your app in the portal.
- You can leave the `ida:AadInstance` as is.
- The `ida:RedirectUri` is the **Reply URL** you entered in the portal - for instance `https://localhost:44316/`
- The rest of the settings are the names of your sign-up, sign-in, and edit profile policies.

Next, add the OWIN middleware NuGet packages to the project using the Visual Studio Package Manager Console.

```
PM> Install-Package Microsoft.Owin.Security.OpenIdConnect
PM> Install-Package Microsoft.Owin.Security.Cookies
PM> Install-Package Microsoft.Owin.Host.SystemWeb
```

Now, Add an "OWIN Startup Class" to the project called `Startup.cs`  Right click on the project --> **Add** --> **New Item** --> Search for "OWIN".  The OWIN middleware will invoke the `Configuration(...)` method when your app starts.
Change the class declaration to `public partial class Startup` - we've already implemented part of this class for you in another file.  In the `Configuration(...)` method, make a call to ConfigureAuth(...) to set up authentication for your web app  

```C#
public partial class Startup
{
    public void Configuration(IAppBuilder app)
    {
        ConfigureAuth(app);
    }
}
```

Open the file `App_Start\Startup.Auth.cs` and implement the `ConfigureAuth(...)` method.  The parameters you provide in `OpenIdConnectAuthenticationOptions` 
will serve as coordinates for your app to communicate with Azure AD.  You'll also need to set up Cookie Authentication - the OpenID Connect middleware 
uses cookies to maintain the user session, amongst other things.

```C#
        public void ConfigureAuth(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            OpenIdConnectAuthenticationOptions options = new OpenIdConnectAuthenticationOptions
            {
                // These are standard OpenID Connect parameters, with values pulled from web.config
                ClientId = clientId,
                RedirectUri = redirectUri,
                PostLogoutRedirectUri = redirectUri,
                Notifications = new OpenIdConnectAuthenticationNotifications
                { 
                    AuthenticationFailed = AuthenticationFailed,
                },
                Scope = "openid",
                ResponseType = "id_token",

                // The PolicyConfigurationManager takes care of getting the correct Azure AD authentication
                // endpoints from the OpenID Connect metadata endpoint.  It is included in the PolicyAuthHelpers folder.
                ConfigurationManager = new PolicyConfigurationManager("https://login.microsoftonline.com/" + tenant + "/v2.0/.well-known/openid-configuration"),

                // This piece is optional - it is used for displaying the user's name in the navigation bar.
                TokenValidationParameters = new TokenValidationParameters
                {  
                    NameClaimType = "name",
                },
            };

            // The PolicyOpenIdConnectAuthenticationMiddleware is a small extension of the default OpenIdConnectMiddleware
            // included in OWIN.  It is included in this sample in the PolicyAuthHelpers folder, along with a few other
            // supplementary classes related to policies.
            app.Use(typeof(PolicyOpenIdConnectAuthenticationMiddleware), app, options);
                
        }
```

If you're familiar with OWIN and OpenID Connect, you might notice that we've extended the default OpenID Connect middleware into a class called 
`PolicyOpenIdConnectAuthenticationMiddleware`.  This class and a few others are included in the `PolicyAuthHelpers` folder - they are included to make
interacting with Azure AD B2C a bit easier for you, but you are not required to use them.  

## 6. Use OWIN to send authentication requests to Azure AD
Your app is now properly configured to communicate with Azure AD B2C using the OpenID Connect authentication protocol.  OWIN has taken care of all of the ugly details
of crafting authentication messages, validating tokens from Azure AD, and maintaining user session.  All that remains is to initiate each user flow.

When a user clicks the "Sign Up", "Sign In", or "Edit Profile" buttons the web app, the associated action will be invoked in the `Controllers\AccountController.cs`.
In each case, you can use built-in OWIN methods to trigger the right policy:

```C#
		public void SignIn()
        {
            if (!Request.IsAuthenticated)
            {
                // To execute a policy, you simply need to trigger an OWIN challenge.
                // You can indicate which policy to use by adding it to the response header using the PolicyKey provided.
                // The PolicyOpenIdConnectAuthenticationMiddleware will pick it up and send the right request.

                Response.Headers.Add(PolicyOpenIdConnectAuthenticationHandler.PolicyKey, Startup.SignInPolicyId);
                HttpContext.GetOwinContext().Authentication.Challenge(
                    new AuthenticationProperties { RedirectUri = "/" }, OpenIdConnectAuthenticationDefaults.AuthenticationType);
            }
        }

        public void SignUp()
        {
            if (!Request.IsAuthenticated)
            {
                Response.Headers.Add(PolicyOpenIdConnectAuthenticationHandler.PolicyKey, Startup.SignUpPolicyId);
                HttpContext.GetOwinContext().Authentication.Challenge(
                    new AuthenticationProperties { RedirectUri = "/" }, OpenIdConnectAuthenticationDefaults.AuthenticationType);
            }
        }


        public void Profile()
        {
            if (Request.IsAuthenticated)
            {
                Response.Headers.Add(PolicyOpenIdConnectAuthenticationHandler.PolicyKey, Startup.ProfilePolicyId);
                HttpContext.GetOwinContext().Authentication.Challenge(
                    new AuthenticationProperties { RedirectUri = "/" }, OpenIdConnectAuthenticationDefaults.AuthenticationType);
            }
        }
```

You can also use a custom `PolicyAuthorize` tag in your controllers to require that a certain policy is executed if the user is not already signed in.
Open `Controllers\HomeController.cs`, and add the `[PolicyAuthorize]` tag to the Claims controller.  Make sure to replace the example policy included
with your own sign in policy.

```C#

// You can use the PolicyAuthorize decorator to execute a certain policy if the user is not already signed into the app.
[PolicyAuthorize(Policy = "b2c_1_sign_in")]
public ActionResult Claims()
{
  ...
```

Finally, you can use OWIN to sign the user out of the app as well.  Back in `Controllers\AccountController.cs`:  

```C#
public void SignOut()
{
	// To sign out the user, you should issue an OpenIDConnect sign out request using the last policy that the user executed.
	// This is as easy as looking up the current value of the ACR claim, adding it to the response header, and making an OWIN SignOut call.

	Response.Headers.Add(PolicyOpenIdConnectAuthenticationHandler.PolicyKey, ClaimsPrincipal.Current.FindFirst(Startup.AcrClaimType).Value);
	HttpContext.GetOwinContext().Authentication.SignOut(OpenIdConnectAuthenticationDefaults.AuthenticationType, CookieAuthenticationDefaults.AuthenticationType);
}
```

## 7. Display user information
When authenticating users with OpenID Connect, Azure AD returns an id_token to the app that contains **claims**, or assertions about the user.  You can use these claims to personalize your app.  
Open the `Controllers\HomeController.cs` file.  You can access the user's claims in your controllers via the `ClaimsPrincipal.Current` security principal object.

```C#
[PolicyAuthorize(Policy = "b2c_1_sign_in")]
public ActionResult Claims()
{
	Claim displayName = ClaimsPrincipal.Current.FindFirst(ClaimsPrincipal.Current.Identities.First().NameClaimType);
	ViewBag.DisplayName = displayName != null ? displayName.Value : string.Empty;
    return View();
}
```

You can access any claim your application receives in the same way.  A list of all the claims the app recieves has been printed out on the Claims page for your inspection.

Finally, build and run your app!   Sign up using one of the IDPs you configured.  Sign out, and sign back in as the same user.  Edit that user's profile.  Sign out, and sign up
using a different IDP.  If you look in the Azure Management portal, you can see each user being created in your B2C directory upon sign up.  Experiment with the different settings
you can configure for a given policy - add/remove IDPs, manipulate the application claims, change the sign up attributes.  Experiment until you begin to understand how policies,
authentication requests, and OWIN all tie together.

For reference, the completed sample (without your configuration values) [is provided as a .zip here](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIdConnect-DotNet/archive/complete.zip),
or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIdConnect-DotNet.git```

## Next Steps

You can now move onto more advanced B2C topics.  You may want to try:

[Calling a Web API from a Web App >>]()
[Customizing the your B2C App's UX >>]()
