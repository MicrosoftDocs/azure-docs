<properties
	pageTitle="Azure AD v2.0 .NET Web API| Microsoft Azure"
	description="How to build a .NET MVC Web Api that accepts tokens from both personal Microsoft Account and work or school accounts."
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

# Secure an MVC web API

With Azure Active Directory the v2.0 endpoint, you can protect a Web API using [OAuth 2.0](active-directory-v2-protocols.md#oauth2-authorization-code-flow) access tokens, enabling users with both personal Microsoft account and work or school accounts to securely access your Web API.

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

In ASP.NET web APIs, you can accomplish this using Microsoft’s OWIN middleware included in .NET Framework 4.5.  Here we’ll use OWIN to build a "To Do List" MVC Web API that allows clients to create and read tasks from a user's To-Do list.  The web API will validate that incoming requests contain a valid access token and reject any requests that do not pass validation on a protected route.

## Download
The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet).  To follow along, you can [download the app's skeleton as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet/archive/skeleton.zip) or clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet.git
```

The skeleton app includes all the boilerplate code for a simple API, but is missing all of the identity-related pieces. If you don't want to follow along, you can instead clone or [download the completed sample](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet/archive/skeleton.zip).

```
git clone https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet.git
```

## Register an app
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Copy down the **Application Id** assigned to your app, you'll need it soon.

This visual studio solution also contains a "TodoListClient", which is a simple WPF app.  The TodoListClient is used to demonstrate how a user signs-in and how a client can issue requests to your Web API.  In this case, both the TodoListClient and the TodoListService are represented by the same app.  To configure the TodoListClient, you should also:

- Add the **Mobile** platform for your app.
- Copy down the **Redirect URI** from the portal. You must use the default value of `urn:ietf:wg:oauth:2.0:oob`.


## Install OWIN

Now that you’ve registered an app, you need to set up your app to communicate with the v2.0 endpoint in order to validate incoming requests & tokens.

- To begin, open the solution and add the OWIN middleware NuGet packages to the TodoListService project using the Package Manager Console.

```
PM> Install-Package Microsoft.Owin.Security.OAuth -ProjectName TodoListService
PM> Install-Package Microsoft.Owin.Security.Jwt -ProjectName TodoListService
PM> Install-Package Microsoft.Owin.Host.SystemWeb -ProjectName TodoListService
```

## Configure OAuth authentication

- Add an OWIN Startup class to the TodoListService project called `Startup.cs`.  Right click on the project --> **Add** --> **New Item** --> Search for “OWIN”.  The OWIN middleware will invoke the `Configuration(…)` method when your app starts.
- Change the class declaration to `public partial class Startup` - we’ve already implemented part of this class for you in another file.  In the `Configuration(…)` method, make a call to ConfgureAuth(…) to set up authentication for your web app.

```C#
public partial class Startup
{
    public void Configuration(IAppBuilder app)
    {
        ConfigureAuth(app);
    }
}
```

- Open the file `App_Start\Startup.Auth.cs` and implement the `ConfigureAuth(…)` method, which will set up the Web API to accept tokens from the v2.0 endpoint.

```C#
public void ConfigureAuth(IAppBuilder app)
{
		var tvps = new TokenValidationParameters
		{
				// In this app, the TodoListClient and TodoListService
				// are represented using the same Application Id - we use
				// the Application Id to represent the audience, or the
				// intended recipient of tokens.

				ValidAudience = clientId,

				// In a real applicaiton, you might use issuer validation to
				// verify that the user's organization (if applicable) has
				// signed up for the app.  Here, we'll just turn it off.

				ValidateIssuer = false,
		};

		// Set up the OWIN pipeline to use OAuth 2.0 Bearer authentication.
		// The options provided here tell the middleware about the type of tokens
		// that will be recieved, which are JWTs for the v2.0 endpoint.

		// NOTE: The usual WindowsAzureActiveDirectoryBearerAuthenticaitonMiddleware uses a
		// metadata endpoint which is not supported by the v2.0 endpoint.  Instead, this
		// OpenIdConenctCachingSecurityTokenProvider can be used to fetch & use the OpenIdConnect
		// metadata document.

		app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
		{
				AccessTokenFormat = new Microsoft.Owin.Security.Jwt.JwtFormat(tvps, new OpenIdConnectCachingSecurityTokenProvider("https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration")),
		});
}
```

- Now you can use `[Authorize]` attributes to protect your controllers and actions with OAuth 2.0 bearer authentication.  Decorate the `Controllers\TodoListController.cs` class with an authorize tag.  This will force the user to sign in before accessing that page.

```C#
[Authorize]
public class TodoListController : ApiController
{
```

- When an authorized caller successfully invokes one of the `TodoListController` APIs, the action might need access to information about the caller.  OWIN provides access to the claims inside the bearer token via the `ClaimsPrincpal` object.  

```C#
public IEnumerable<TodoItem> Get()
{
    // You can use the ClaimsPrincipal to access information about the
    // user making the call.  In this case, we use the 'sub' or
    // NameIdentifier claim to serve as a key for the tasks in the data store.

    Claim subject = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier);

    return from todo in todoBag
           where todo.Owner == subject.Value
           select todo;
}
```

-	Finally, open the `web.config` file in the root of the TodoListService project, and enter your configuration values in the `<appSettings>` section.
  -	Your `ida:Audience` is the **Application Id** of the app that you entered in the portal.

## Configure the client app
Before you can see the Todo List Service in action, you need to configure the Todo List Client so it can get tokens from the v2.0 endpoint and make calls to the service.

- In the TodoListClient project, open `App.config` and enter your configuration values in the `<appSettings>` section.
  -	Your `ida:ClientId` Application Id you copied from the portal.
	- The `ida:RedirectUri` is the **Redirect Uri** from the portal.

Finally, clean, build and run each project!  You now have a .NET MVC Web API that accepts tokens from both personal Microsoft accounts and work or school accounts.  Sign into the TodoListClient, and call your web api to add tasks to the user's To-Do list.

For reference, the completed sample (without your configuration values) [is provided as a .zip here](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet/archive/complete.zip), or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet.git```

## Next steps
You can now move onto additional topics.  You may want to try:

[Calling a Web API from a Web App >>](active-directory-v2-devquickstarts-webapp-webapi-dotnet.md)

For additional resources, check out:
- [The v2.0 developer guide >>](active-directory-appmodel-v2-overview.md)
- [StackOverflow "azure-active-directory" tag >>](http://stackoverflow.com/questions/tagged/azure-active-directory)

## Get security updates for our products

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.
