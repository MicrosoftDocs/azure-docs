<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="How to build a .NET Web API by using Azure Active Directory B2C, secured by using OAuth 2.0 access tokens for authentication."
	services="active-directory-b2c"
	documentationCenter=".net"
	authors="dstrockis"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="05/16/2016"
	ms.author="dastrock"/>

# Azure Active Directory B2C preview: Build a .NET web API

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-web-switcher](../../includes/active-directory-b2c-devquickstarts-web-switcher.md)]-->

With Azure Active Directory (Azure AD) B2C, you can secure a web API by using OAuth 2.0 access tokens. These tokens allow your client apps that use Azure AD B2C to authenticate to the API. This article shows you how to create a .NET Model-View-Controller (MVC) "to-do list" API that allows users to CRUD tasks. The web API is secured using Azure AD B2C and only allows authenticated users to manage their to-do list.

## Create an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant. A directory is a container for all of your users, apps, groups, and more. If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue in this guide.

## Create an application

Next, you need to create an app in your B2C directory. This gives Azure AD information that it needs to securely communicate with your app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md). Be sure to:

- Include a **web app** or **web API** in the application.
- Use the **redirect uniform resource identifier** `https://localhost:44316/` for the web app. This is the default location of the web app client for this code sample.
- Copy the **application ID** that is assigned to your app. You'll need it later.

 [AZURE.INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). The client in this code sample contains three identity experiences: sign up, sign in, and edit profile. You will need to create a policy for each type, as described in the [policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy). When you create your three policies, be sure to:

- Choose either **User ID sign-up** or **Email sign-up** in the identity providers blade.
- Choose **Display name** and other sign-up attributes in your sign-up policy.
- Choose **Display name** and **Object ID** claims as application claims for every policy. You can choose other claims as well.
- Copy the **Name** of each policy after you create it. You'll need these policy names later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you have successfully created the three policies, you're ready to build your app.

## Download the code

The code for this tutorial [is maintained on GitHub](https://github.com/AzureADQuickStarts/B2C-WebAPI-DotNet). To build the sample as you go, you can [download a skeleton project as a .zip file](https://github.com/AzureADQuickStarts/B2C-WebAPI-DotNet/archive/skeleton.zip). You can also clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-WebAPI-DotNet.git
```

The completed app is also [available as a .zip file](https://github.com/AzureADQuickStarts/B2C-WebAPI-DotNet/archive/complete.zip) or on the `complete` branch of the same repository.

After you download the sample code, open the Visual Studio .sln file to get started. The solution file contains two projects: `TaskWebApp` and `TaskService`. `TaskWebApp` is an MVC web application that the user interacts with. `TaskService` is the app's back-end web API that stores each user's to-do list.

## Configure the task web app

When a user interacts with `TaskWebApp`, the client sends requests to Azure AD and gets back tokens that can be used to call the `TaskService` web API. To sign in the user and get tokens, you need to provide `TaskWebApp` with some information about your app. In the `TaskWebApp` project, open the `web.config` file in the root of the project and replace the values in the `<appSettings>` section.  You can leave the `AadInstance`, `RedirectUri`, and `TaskServiceUrl` values as-is.

```
  <appSettings>
    <add key="webpages:Version" value="3.0.0.0" />
    <add key="webpages:Enabled" value="false" />
    <add key="ClientValidationEnabled" value="true" />
    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
    <add key="ida:Tenant" value="fabrikamb2c.onmicrosoft.com" />
    <add key="ida:ClientId" value="90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6" />
    <add key="ida:AadInstance" value="https://login.microsoftonline.com/{0}/v2.0/.well-known/openid-configuration?p={1}" />
    <add key="ida:RedirectUri" value="https://localhost:44316/" />
    <add key="ida:SignUpPolicyId" value="b2c_1_sign_up" />
    <add key="ida:SignInPolicyId" value="b2c_1_sign_in" />
    <add key="ida:UserProfilePolicyId" value="b2c_1_edit_profile" />
    <add key="api:TaskServiceUrl" value="https://localhost:44332/" />
  </appSettings>
```

This article does not cover building the `TaskWebApp` client.  To learn how to build a web app using Azure AD B2C, see
[our .NET web app tutorial](active-directory-b2c-devquickstarts-web-dotnet.md).

## Secure the API

When you have a client that calls the API on behalf of users, you can secure `TaskService` by using OAuth 2.0 bearer tokens. Your API can accept and validate tokens by using Microsoft's Open Web Interface for .NET (OWIN) library.

### Install OWIN
Begin by installing the OWIN OAuth authentication pipeline:

```
PM> Install-Package Microsoft.Owin.Security.OAuth -ProjectName TaskService
PM> Install-Package Microsoft.Owin.Security.Jwt -ProjectName TaskService
PM> Install-Package Microsoft.Owin.Host.SystemWeb -ProjectName TaskService
```

### Enter your B2C details
Open the `web.config` file in the root of the `TaskService` project and replace the values in the `<appSettings>` section. These values will be used throughout the API and OWIN library.  You can leave the `AadInstance` value unchanged.

```
  <appSettings>
    <add key="webpages:Version" value="3.0.0.0" />
    <add key="webpages:Enabled" value="false" />
    <add key="ClientValidationEnabled" value="true" />
    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
    <add key="ida:AadInstance" value="https://login.microsoftonline.com/{0}/v2.0/.well-known/openid-configuration?p={1}" />
    <add key="ida:Tenant" value="fabrikamb2c.onmicrosoft.com" />
    <add key="ida:ClientId" value="90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6" />
    <add key="ida:SignUpPolicyId" value="b2c_1_sign_up" />
    <add key="ida:SignInPolicyId" value="b2c_1_sign_in" />
    <add key="ida:UserProfilePolicyId" value="b2c_1_edit_profile" />
  </appSettings>
```

### Add an OWIN startup class
Add an OWIN startup class to the `TaskService` project called `Startup.cs`.  Right-click on the project, select **Add** and **New Item**, and then search for OWIN.


```C#
// Startup.cs

// Change the class declaration to "public partial class Startup" - we’ve already implemented part of this class for you in another file.
public partial class Startup
{
	// The OWIN middleware will invoke this method when the app starts
    public void Configuration(IAppBuilder app)
    {
        ConfigureAuth(app);
    }
}
```

### Configure OAuth 2.0 authentication
Open the file `App_Start\Startup.Auth.cs`, and implement the `ConfigureAuth(...)` method:

```C#
// App_Start\Startup.Auth.cs

public partial class Startup
{
    // These values are pulled from web.config
    public static string aadInstance = ConfigurationManager.AppSettings["ida:AadInstance"];
    public static string tenant = ConfigurationManager.AppSettings["ida:Tenant"];
    public static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
    public static string signUpPolicy = ConfigurationManager.AppSettings["ida:SignUpPolicyId"];
    public static string signInPolicy = ConfigurationManager.AppSettings["ida:SignInPolicyId"];
    public static string editProfilePolicy = ConfigurationManager.AppSettings["ida:UserProfilePolicyId"];

    public void ConfigureAuth(IAppBuilder app)
    {   
        app.UseOAuthBearerAuthentication(CreateBearerOptionsFromPolicy(signUpPolicy));
        app.UseOAuthBearerAuthentication(CreateBearerOptionsFromPolicy(signInPolicy));
        app.UseOAuthBearerAuthentication(CreateBearerOptionsFromPolicy(editProfilePolicy));
    }

    public OAuthBearerAuthenticationOptions CreateBearerOptionsFromPolicy(string policy)
    {
        TokenValidationParameters tvps = new TokenValidationParameters
        {
            // This is where you specify that your API only accepts tokens from its own clients
            ValidAudience = clientId,
        };

        return new OAuthBearerAuthenticationOptions
        {
            // This SecurityTokenProvider fetches the Azure AD B2C metadata & signing keys from the OpenIDConnect metadata endpoint
            AccessTokenFormat = new JwtFormat(tvps, new OpenIdConnectCachingSecurityTokenProvider(String.Format(aadInstance, tenant, signUpPolicy))),
            AuthenticationType = policy,
        };
    }
}
```

### Secure the task controller
After the app is configured to use OAuth 2.0 authentication, you can secure your web API by adding an `[Authorize]` tag to the task controller. This is the controller where all to-do list manipulation takes place, so you should secure the entire controller at the class level. You can also add the `[Authorize]` tag to individual actions for more fine-grained control.

```C#
// Controllers\TasksController.cs

[Authorize]
public class TasksController : ApiController
{
	...
}
```

### Get user information from the token
`TasksController` stores tasks in a database where each task has an associated user who "owns" the task. The owner is identified by the user's **object ID**. (This is why you needed to add the object ID as an application claim in all of your policies.)

```C#
// Controllers\TasksController.cs

public IEnumerable<Models.Task> Get()
{
	string owner = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
	IEnumerable<Models.Task> userTasks = db.Tasks.Where(t => t.owner == owner);
	return userTasks;
}
```

## Run the sample app

Finally, build and run both `TaskWebApp` and `TaskService`. Sign up for the app by using an email address or username. Create some tasks on the user's to-do list and notice how they are persisted in the API even after you stop and restart the client.

## Edit your policies

After you have secured an API by using Azure AD B2C, you can experiment with your app's policies and view the effects (or lack thereof) on the API. You can manipulate the application claims in the policies and change the user information that is available in the web API. Any claims that you add will be available to your .NET MVC web API in the `ClaimsPrincipal` object, as described earlier in this article.

<!--

## Next steps

You can now move onto more advanced B2C topics. You may try:

[Call a web API from a web app]()

[Customize the UX of your B2C app]()

-->
