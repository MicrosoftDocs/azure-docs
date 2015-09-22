<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="How to build a .NET Web API using Azure AD B2C, secured using OAuth 2.0 access tokens for authentication."
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
	ms.topic="article"
	ms.date="09/22/2015"
	ms.author="dastrock"/>
	
# Azure AD B2C Preview: Build a .NET Web API

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-web-switcher](../../includes/active-directory-b2c-devquickstarts-web-switcher.md)]-->

With Azure AD B2C, you can secure a web API using OAuth 2.0 access tokens, enabling your client apps that use Azure AD B2C to authenticate to the API.  This article will show you how
to create a .NET MVC "To-Do List" app that includes user sign-up, sign-in, and profile management.  Each user's to-do list will be stored by a Task Service - a web API that allows authenticated
users to create and read tasks in their to-do list.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## 1. Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all your users, apps, groups, and so on.  If you don't have
one already, go [create a B2C directory](active-directory-b2c-get-started.md) before moving on.

## 2. Create an application

Now you need to create an app in your B2C directory, which gives Azure AD some information that it needs to securely communicate with your app.  To create an app,
follow [these instructions](active-directory-b2c-app-registration.md).  Be sure to

- Include a **web app / web api** in the application.
- For the web app, use the **Redirect Uri** `https://localhost:44316/` - it is the default location of the web app client for this code sample.
- Copy down the **Application ID** that is assigned to your app.  You will need it shortly.

     > [AZURE.IMPORTANT]
    You cannot use applications registered in the **Applications** tab on the [Azure Portal](https://manage.windowsazure.com/) for this.

## 3. Create your policies

In Azure AD B2C, every user experience is defined by a [**policy**](active-directory-b2c-reference-policies.md).  The client in this code sample contains three 
identity experiences - sign-up, sign-in, and edit profile.  You will need to create one policy of each type, as described in the 
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy).  When creating your three policies, be sure to:

- Choose either **User ID signup** or **Email signup** in the identity providers blade.
- Choose the **Display Name** and a few other sign-up attributes in your sign-up policy.
- Choose the **Display Name** and **Object ID** claims as an application claim in every policy.  You can choose other claims as well.
- Copy down the **Name** of each policy after you create it.  It should have the prefix `b2c_1_`.  You'll need those policy names shortly. 

Once you have your three policies successfully created, you're ready to build your app.

## 4. Download the code

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/B2C-WebAPI-DotNet).  To build the sample as you go, you can 
[download a skeleton project as a .zip](https://github.com/AzureADQuickStarts/B2C-WebAPI-DotNet/archive/skeleton.zip) or clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-WebAPI-DotNet.git
```

The completed app is also [available as a .zip](https://github.com/AzureADQuickStarts/B2C-WebAPI-DotNet/archive/complete.zip) or on the
`complete` branch of the same repo.

Once you've downloaded the sample code, open the Visual Studio `.sln` file to get started.  You'll notice that there are two projects in the solution: a `TaskWebApp` project and a `TaskService` project.  The `TaskWebApp` is an MVC 
web application that the user interacts with.  The `TaskService` is the app's backend web API that stores each user's to-do list. 

## 5. Configure the task web app

When the user interacts with the `TaskWebApp`, the client sends requests to Azure AD and receives back tokens that can be used for calling the `TaskService` web API.
In order to sign the user in and get tokens, you need to provide the `TaskWebApp` with some information about your app.  In the `TaskWebApp` project, open up the `web.config` file in the root 
of the project and replace the values in the `<appSettings>` section:

```
<appSettings>
    <add key="webpages:Version" value="3.0.0.0" />
    <add key="webpages:Enabled" value="false" />
    <add key="ClientValidationEnabled" value="true" />
    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
    <add key="ida:Tenant" value="{Enter the name of your B2C directory, e.g. contoso.onmicrosoft.com}" />
    <add key="ida:ClientId" value="{Enter the Application Id assinged to your app by the Azure portal, e.g.580e250c-8f26-49d0-bee8-1c078add1609}" />
    <add key="ida:ClientSecret" value="{Enter the Application Secret you created in the Azure portal, e.g. yGNYWwypRS4Sj1oYXd0443n}" />
    <add key="ida:AadInstance" value="https://login.microsoftonline.com/{0}{1}{2}" />
    <add key="ida:RedirectUri" value="https://localhost:44316/" />
    <add key="ida:SignUpPolicyId" value="[Enter your sign up policy name, e.g. b2c_1_sign_up]" />
    <add key="ida:SignInPolicyId" value="[Enter your sign in policy name, e.g. b2c_1_sign_in]" />
    <add key="ida:UserProfilePolicyId" value="[Enter your edit profile policy name, e.g. b2c_1_profile_edit" />
    <add key="api:TaskServiceUrl" value="https://localhost:44332/" />
</appSettings>
```

There are also two `[PolicyAuthorize]` decorators in which you need to provide your sign-in policy name.  The `[PolicyAuthorize]` attribute is used to invoke a particular
policy when the user attempts to access a page in the app that requires authentication.

```C#
// Controllers\HomeController.cs

[PolicyAuthorize(Policy = "{Enter the name of your sign in policy, e.g. b2c_1_my_sign_in}")]
public ActionResult Claims()
{
```

```C#
// Controllers\TasksController.cs

[PolicyAuthorize(Policy = "{Enter the name of your sign in policy, e.g. b2c_1_my_sign_in}")]
public class TasksController : Controller
{
```

If you want to learn how a web app like the `TaskWebApp` uses Azure AD B2C, check out our
[Web App Sign In Getting Started article](active-directory-b2c-devquickstarts-web-dotnet.md).

## 6. Secure the API

Now that you have a client that calls the API on behalf of users, you can secure the `TaskService` using OAuth 2.0 bearer tokens.  Your API can accept and validate 
tokens using Microsoft's OWIN library.

#### Install OWIN
Begin by installing the OWIN OAuth authentication pipeline:

```
PM> Install-Package Microsoft.Owin.Security.OAuth -ProjectName TodoListService
PM> Install-Package Microsoft.Owin.Security.Jwt -ProjectName TodoListService
PM> Install-Package Microsoft.Owin.Host.SystemWeb -ProjectName TodoListService
```

#### Enter your B2C details
Open the `web.config` file in the root of the `TaskService` project and replace the values in the `<appSettings>` section.  These values will be used throughout the API and
OWIN library.

```
<appSettings>
    <add key="webpages:Version" value="3.0.0.0" />
    <add key="webpages:Enabled" value="false" />
    <add key="ClientValidationEnabled" value="true" />
    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
    <add key="ida:AadInstance" value="https://login.microsoftonline.com/{0}/{1}/{2}?p={3}" />
    <add key="ida:Tenant" value="{Enter the name of your B2C tenant - it usually looks like constoso.onmicrosoft.com}" />
    <add key="ida:ClientId" value="{Enter the Application ID assigned to your app by the Azure Portal}" />
    <add key="ida:PolicyId" value="{Enter the name of one of the policies you created, like `b2c_1_my_sign_in_policy`}" />
</appSettings> 
```

#### Add an OWIN startup class
Add an OWIN Startup class to the `TaskService` project called `Startup.cs`.  Right click on the project --> **Add** --> **New Item** --> Search for “OWIN”.
  

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

#### Configure OAuth 2.0 authentication
Open the file `App_Start\Startup.Auth.cs`, and implement the `ConfigureAuth(...)` method:

```C#
// App_Start\Startup.Auth.cs

public partial class Startup
{
	// These values are pulled from web.config
	public static string aadInstance = ConfigurationManager.AppSettings["ida:AadInstance"];
	public static string tenant = ConfigurationManager.AppSettings["ida:Tenant"];
	public static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
	public static string commonPolicy = ConfigurationManager.AppSettings["ida:PolicyId"];
	private const string discoverySuffix = ".well-known/openid-configuration";

	public void ConfigureAuth(IAppBuilder app)
	{   
		TokenValidationParameters tvps = new TokenValidationParameters
		{
			// This is where you specify that your API only accepts tokens from its own clients
			ValidAudience = clientId,
		};

		app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
		{   
			// This SecurityTokenProvider fetches the Azure AD B2C metadata & signing keys from the OpenIDConnect metadata endpoint
			AccessTokenFormat = new JwtFormat(tvps, new OpenIdConnectCachingSecurityTokenProvider(String.Format(aadInstance, tenant, "v2.0", discoverySuffix, commonPolicy)))
		});
	}
}
```

#### Secure the task controller
Now that the app is configured to use OAuth 2.0 authentication, all you need to do to secure your web API is add an `[Authorize]` tag to the task controller.
This is the controller where all to-do list manipulation takes place, so we'll secure the entire controller at the class level.
You could also add the `[Authorize]` tag to individual actions for more fine-grained control.

```C#
// Controllers\TasksController.cs

[Authorize]
public class TasksController : ApiController
{
	...
}
```

#### Get user information from the token
The `TaskController` stores tasks in a database, where each task has an associated user that "owns" the task.  The owner is identified by the user's **object ID** (which
is why you had to add the object ID as an application claim in all of your policies):

```C#
// Controllers\TasksController.cs

public IEnumerable<Models.Task> Get()
{
	string owner = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
	IEnumerable<Models.Task> userTasks = db.Tasks.Where(t => t.owner == owner);
	return userTasks;
}
```

## 7. Run the sample app

Finally, build and run both the `TaskWebApp` and the `TaskService`.  Sign up for the app with an email address or username.  Create some tasks on the user's to-do list,
and notice how they are persisted in the API even after you stop and restart the client.

## 8. Edit your policies

Now that you have an API secured with Azure AD B2C, you can play around with your app's policies and view the effect (or lack thereof) on the API.  You can <!--add **identity providers**
to the policies, allowing you users to sign into the Task Client using social accounts.  You can also -->manipulate the **application claims** in the policies, and change
the user information that is available in the Web API.  Any additional claims you add will be available to your .NET MVC web api in the `ClaimsPrincipal` object, as described above.

<!--

## Next Steps

You can now move onto more advanced B2C topics.  You may want to try:

[Calling a Web API from a Web App >>]()

[Customizing the your B2C App's UX >>]()

-->
