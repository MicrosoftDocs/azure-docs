<properties
	pageTitle="App Model v2.0 .NET Web App | Microsoft Azure"
	description="How to build a .NET MVC Web App that calls web services using personal Microsoft accounts and work or school accounts for sign-in."
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
	ms.date="09/11/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: Calling a web API from a .NET web app

> [AZURE.NOTE]
	This information applies to the v2.0 endpoint public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

With the v2.0 app model, you can quickly add authentication to your web apps and web APIs with support for both personal Microsoft accounts and work or school accounts.  Here, we'll build an MVC web app that:

- Signs users in using OpenID Connect, with some help from Microsoft's OWIN middleware.
- Gets OAuth 2.0 access tokens for a web API using ADAL.
- Creates, Reads, and Deletes items on a user's "To-Do List", which is hosted on the web api and secured by OAuth 2.0.

This tutorial will focus primarily on getting and using access tokens in a web app, described in full [here](active-directory-v2-flows.md#web-apps).  As prerequisites, you may want to first learn how to [add basic sign-in to a web app](active-directory-v2-devquickstarts-dotnet-web.md) or how to [properly secure a web API](active-directory-v2-devquickstarts-dotnet-api.md).

The basic steps to call the To-Do List Web API from the client are:

1. Register an app
2. Sign the user into the web app using OpenID Connect
3. Use ADAL to get an access token upon user sign-in
4. Call the To-Do List Web API with an access token.

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-WebAPI-OpenIdConnect-DotNet).  

To follow along, you can [download the app's skeleton as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-WebAPI-OpenIdConnect-DotNet/archive/skeleton.zip) or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-WebApp-WebAPI-OpenIdConnect-DotNet.git```

Alternatively, you can [download the completed app as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-WebAPI-OpenIdConnect-DotNet/archive/complete.zip) or clone the completed app:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-WebApp-WebAPI-OpenIdConnect-DotNet.git```

## 1. Register an App
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Copy down the **Application Id** assigned to your app, you'll need it soon.
- Create an **App Secret** of the **Password** type, and copy down its value for later
- Add the **Web** platform for your app.
- Enter the correct **Redirect URI**. The redirect uri indicates to Azure AD where authentication responses should be directed - the default for this tutorial is `https://localhost:44326/`.


## 2. Sign the user in with OpenID Connect
Here, we'll configure the OWIN middleware to use the [OpenID Connect authentication protocol](active-directory-v2-protocols.md#openid-connect-sign-in-flow).  OWIN will be used to issue sign-in and sign-out requests, manage the user's session, and get information about the user, amongst other things.

-	To begin, open the `web.config` file in the root of the `TodoList-WebApp` project, and enter your app's configuration values in the `<appSettings>` section.
    -	The `ida:ClientId` is the **Application Id** assigned to your app in the registration portal.
	- The `ida:ClientSecret` is the **App Secret** you created in the registration portal.
    -	The `ida:RedirectUri` is the **Redirect Uri** you entered in the portal.
- Open the `web.config` file in the root of the `TodoList-Service` project, and replace the `ida:Audience` with the same **Application Id** as above.


-	Now add the OWIN middleware NuGet packages to the `TodoList-WebApp` project using the Package Manager Console.

```
PM> Install-Package Microsoft.Owin.Security.OpenIdConnect -ProjectName TodoList-WebApp
PM> Install-Package Microsoft.Owin.Security.Cookies -ProjectName TodoList-WebApp
PM> Install-Package Microsoft.Owin.Host.SystemWeb -ProjectName TodoList-WebApp
```

-	Open the file `App_Start\Startup.Auth.cs` and add `using` statements for the above libraries.
- In the same file, implement the `ConfigureAuth(...)` method.  The parameters you provide in `OpenIDConnectAuthenticationOptions` will serve as coordinates for your app to communicate with Azure AD.

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
					Authority = String.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0"),
					Scope = "openid offline_access",
					RedirectUri = redirectUri,
					PostLogoutRedirectUri = redirectUri,
					TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = false,
					},

					// The `AuthorizationCodeReceived` notification is used to capture and redeem the authorization_code that the v2.0 endpoint returns to your app.

					Notifications = new OpenIdConnectAuthenticationNotifications
					{
						AuthenticationFailed = OnAuthenticationFailed,
						AuthorizationCodeReceived = OnAuthorizationCodeReceived,
					}

    	});
}
...
```

## 3. Use ADAL to get an access token upon user sign-in
In the `AuthorizationCodeReceived` notification, we want to use [OAuth 2.0 in tandem with OpenID Connect](active-directory-v2-protocols.md#openid-connect-with-oauth-code-flow) to redeem the authorization_code for an access token to the To-Do List Service.  ADAL can make this process easy for you:

- First, install the preview version of ADAL:

```PM> Install-Package Microsoft.Experimental.IdentityModel.Clients.ActiveDirectory -ProjectName TodoList-WebApp -IncludePrerelease```
- And add another `using` statement to the `App_Start\Startup.Auth.cs` file for ADAL.
- Now add a new method, the `OnAuthorizationCodeReceived` event handler.  This handler will use ADAL to acquire an access token to the To-Do List API, and will store the token in ADAL's token cache for later:

```C#
private async Task OnAuthorizationCodeReceived(AuthorizationCodeReceivedNotification notification)
{
		string userObjectId = notification.AuthenticationTicket.Identity.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
		string tenantID = notification.AuthenticationTicket.Identity.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;
		string authority = String.Format(CultureInfo.InvariantCulture, aadInstance, tenantID, string.Empty);
		ClientCredential cred = new ClientCredential(clientId, clientSecret);

		// Here you ask for a token using the web app's clientId as the scope, since the web app and service share the same clientId.
		var authContext = new Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext(authority, new NaiveSessionCache(userObjectId));
		var authResult = await authContext.AcquireTokenByAuthorizationCodeAsync(notification.Code, new Uri(redirectUri), cred, new string[] { clientId });
}
...
```

- In web apps, ADAL has an extensible token cache that can be used to store tokens.  This sample implements the `NaiveSessionCache` which uses http session storage to cache tokens.

<!-- TODO: Token Cache article -->


## 4. Call the To-Do List Web API
Now it's time to actually use the access_token you acquired in step 3.  Open the web app's `Controllers\TodoListController.cs` file, which makes all the CRUD requests to the To-Do List API.

- You can use ADAL again here to fetch access_tokens from the ADAL cache.  First, add a `using` statement for ADAL to this file.

    `using Microsoft.Experimental.IdentityModel.Clients.ActiveDirectory;`

- In the `Index` action, use ADAL's `AcquireTokenSilentAsync` method to get an access_token that can be used to read data from the To-Do List service:

```C#
...
string userObjectID = ClaimsPrincipal.Current.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
string tenantID = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;
string authority = String.Format(CultureInfo.InvariantCulture, Startup.aadInstance, tenantID, string.Empty);
ClientCredential credential = new ClientCredential(Startup.clientId, Startup.clientSecret);

// Here you ask for a token using the web app's clientId as the scope, since the web app and service share the same clientId.
AuthenticationContext authContext = new AuthenticationContext(authority, new NaiveSessionCache(userObjectID));
result = await authContext.AcquireTokenSilentAsync(new string[] { Startup.clientId }, credential, UserIdentifier.AnyUser);
...
```

- The sample then adds the resulting token to the HTTP GET request as the `Authorization` header, which the To-Do List service uses to authenticate the request.
- If the To-Do List service returns a `401 Unauthorized` response, the access_tokens in ADAL have become invalid for some reason.  In this case, you should drop any access_tokens from the ADAL cache and show the user a message that they may need to sign in again, which will restart the token acquisition flow.

```C#
...
// If the call failed with access denied, then drop the current access token from the cache,
// and show the user an error indicating they might need to sign-in again.
if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
{
		var todoTokens = authContext.TokenCache.ReadItems().Where(a => a.Scope.Contains(Startup.clientId));
		foreach (TokenCacheItem tci in todoTokens)
				authContext.TokenCache.DeleteItem(tci);

		return new RedirectResult("/Error?message=Error: " + response.ReasonPhrase + " You might need to sign in again.");
}
...
```

- Similarly, if ADAL is unable to return an access_token for any reason, you should instruct the user to sign in again.  This is as simple as catching any `AdalException`:

```C#
...
catch (AdalException ee)
{
		// If ADAL could not get a token silently, show the user an error indicating they might need to sign in again.
		return new RedirectResult("/Error?message=An Error Occurred Reading To Do List: " + ee.Message + " You might need to log out and log back in.");
}
...
```

- The exact same `AcquireTokenSilentAsync` call is implementd in the `Create` and `Delete` actions.  In web apps, you can use this ADAL method to get access_tokens whenever you need them in your app.  ADAL will take care of acquiring, caching, and refreshing tokens for you.

Finally, build and run your app!  Sign in with either a Microsoft Account or an Azure AD Account, and notice how the user's identity is reflected in the top navigation bar.  Add and delete some items from the user's To-Do List to see the OAuth 2.0 secured API calls in action.  You now have a web app & web API, both secured using industry standard protocols, that can authenticate users with both their personal and work/school accounts.

For reference, the completed sample (without your configuration values) [is provided here](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-WebAPI-OpenIdConnect-DotNet/archive/complete.zip).  

## Next Steps

For additional resources, check out:
- [The App Model v2.0 Preview >>](active-directory-appmodel-v2-overview.md)
- [StackOverflow "adal" tag >>](http://stackoverflow.com/questions/tagged/adal)
