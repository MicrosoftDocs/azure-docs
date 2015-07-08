<properties
	pageTitle="Azure AD .NET Getting Started | Microsoft Azure"
	description="How to build a .NET MVC Web App that calls web services using Azure AD for authentication."
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
	ms.date="07/07/2015"
	ms.author="dastrock"/>

# Preview: Calling a Web API from a .NET Web App using Azure AD v2.0

> [AZURE.NOTE]
	This information applies to the v2.0 endpoint public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

With the Azure AD v2.0 endpoint, you can quickly add authentication to your web apps and web APIs with support for both Microsoft Accounts and Azure Active Directory.  Here, we'll build an MVC web app that:

- Signs users in using OpenID Connect, with some help from Microsoft's OWIN middleware.
- Gets OAuth 2.0 access tokens for a backend web API using ADAL.
- Creates, Reads, and Deletes items on a user's "To-Do List", which is hosted on the backend web api and secured by OAuth 2.0.

This tutorial will focus primarily on getting and using access tokens in a web app.  We won't spend too much time on [Adding Sign In to a .NET Web App]() or [Securing a .NET Web API]().

The basic steps to call the To-Do List Web API from the client are:

1. Register an app
2. Sign the user into the web app using OpenID Connect
3. Use ADAL to get an access token upon user sign in
4. Call the To-Do List Web API with an access token.

To get started, [download the app skeleton](https://github.com/AzureADQuickStarts/v2-WebApp-WebAPI-OpenIdConnect-DotNet/archive/skeleton.zip)

``` git clone --branch skeleton https://github.com/AzureADQuickStarts/v2-WebApp-WebAPI-OpenIdConnect-DotNet.git```

 or [download the completed sample](https://github.com/AzureADQuickStarts/v2-WebApp-WebAPI-OpenIdConnect-DotNet/archive/complete.zip).

``` git clone --branch complete https://github.com/AzureADQuickStarts/v2-WebApp-WebAPI-OpenIdConnect-DotNet.git```

## *1. Register an App*
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps]().  Make sure to:

- Create an **App Secret** of the **Password** type, and copy down its value for later
- Add the **Web** platform for your app.
- Enter the correct **Redirect URI**. The default for this sample is `https://localhost:44326`.

## *2. Sign the user in with OpenID Connect*
Here, we'll configure the OWIN middleware to use the OpenID Connect authentication protocol.  OWIN will be used to issue sign-in and sign-out requests, manage the user's session, and get information about the user, amongst other things.

-	To begin, open the `web.config` file in the root of the `TodoList-WebApp` project, and enter your app's configuration values in the `<appSettings>` section.
    -	The `ida:ClientId` is the **Application Id** assigned to your app in the registration portal.
	- The `ida:ClientSecret` is the **App Secret** you created in the registration portal.
    -	The `ida:RedirectUri` indicates to Azure AD where authentication responses should be directed - the default for the web app is `https://localhost:44326/`
- In the `web.config` file in the root of the `TodoList-Service` project, and replace the `ida:Audience` with the same **Application Id** as above.


-	Now add the OWIN middleware NuGet packages to the project using the Package Manager Console.

```
PM> Install-Package Microsoft.Owin.Security.OpenIdConnect
PM> Install-Package Microsoft.Owin.Security.Cookies
PM> Install-Package Microsoft.Owin.Host.SystemWeb
```

-	Open the file `App_Start\Startup.Auth.cs` and add `using` statements for the above libraries.
- In the same file, implement the `ConfigureAuth(...)` method.  The parameters you provide in `OpenIDConnectAuthenticationOptions` will serve as coordinates for your app to communicate with the v2.0 endpoint.

```C#
public void ConfigureAuth(IAppBuilder app)
{
    app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

    app.UseCookieAuthentication(new CookieAuthenticationOptions());

    app.UseOpenIdConnectAuthentication(
        new OpenIdConnectAuthenticationOptions
        {
			ClientId = clientId,
			Authority = String.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0"),
			Scope = "openid offline_access",
			RedirectUri = redirectUri,
			PostLogoutRedirectUri = redirectUri,
			TokenValidationParameters = new TokenValidationParameters
			{
				IssuerValidator = ProxyIssuerValidator,
			},
			Notifications = new OpenIdConnectAuthenticationNotifications
			{
				AuthenticationFailed = OnAuthenticationFailed,
				AuthorizationCodeReceived = OnAuthorizationCodeReceived,
			}

        });
}
...
```

-	There are a few different parameters to make note of here:
    - The `Authority` points to the v2.0 endpoint - `https://login.microsoftonline.com/common/v2.0`
	- The `Scope` describes the permissions that your app will need.  You can learn more about scopes including `openid` and `offline_access` in [Scopes in the v2.0 Endpoint]()
	- The `IssuerValidator` in this sample successfully validates all sign in responses that come from `https://login.microsoftonline.com`.  In a real application, you could use this delegate to peform additional validation - like making sure the organization has signed up for your app.
	- The `AuthorizationCodeReceived` notification is used to capture and redeem the authorization_code that the v2.0 endpoint returns to your app.

## *3. Use ADAL to get an access token upon user sign in*
In the `AuthorizationCodeReceived` notification, we want to redeem the authorization_code for an access token to the To-Do List Service.  ADAL can make this process easy for you:

- First, install ADAL:
```
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
```
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
		var authContext = new Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext(authority, false, new NaiveSessionCache(userObjectId));
		var authResult = await authContext.AcquireTokenByAuthorizationCodeAsync(notification.Code, new Uri(redirectUri), cred, new string[] { clientId });
}
...
```

- Note that in this case, the To-Do List web app and web service comprise the same logical application, and share a single client ID.  Therefore the web app needs to request an access_token for itself, represented by using the app's `clientId` as the `scope` parameter in the `AcquireTokenByAuthorizationCodeAsync` method.
- In web apps, ADAL has an [extensible token cache]() that can be used to store tokens.  This sample implements the `NaiveSessionCache` which uses http session storage to cache tokens.  


## *4.	Call the To-Do List Web API*
Now it's time to actually use the access_token you acquired in step 3.  Open the web app's `Controllers\TodoListController.cs` file, which makes all the CRUD requests to the To-Do List API.

- You can use ADAL again here to fetch access_tokens from the ADAL cache.  First, add a `using` statement for ADAL to this file.

    `using Microsoft.IdentityModel.Clients.ActiveDirectory;`

- In the `Index` action, use ADAL's `AcquireTokenSilentAsync` method to get an access_token that can be used to read data from the To-Do List service:

```C#
...
string userObjectID = ClaimsPrincipal.Current.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
string tenantID = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;
string authority = String.Format(CultureInfo.InvariantCulture, Startup.aadInstance, tenantID, string.Empty);
ClientCredential credential = new ClientCredential(Startup.clientId, Startup.clientSecret);

// Here you ask for a token using the web app's clientId as the scope, since the web app and service share the same clientId.
AuthenticationContext authContext = new AuthenticationContext(authority, false, new NaiveSessionCache(userObjectID));
result = await authContext.AcquireTokenSilentAsync(new string[] { Startup.clientId }, credential, UserIdentifier.AnyUser);
...
```

- The sample then adds the resulting token to the HTTP GET request as the `Authorization` header, which the To-Do List service uses to authenticate the request.
- If the To-Do List service returns a `401 Unauthorized` response, the access_tokens in ADAL have become invalid for some reason.  In this case, you should drop any access_tokens from the ADAL cache and show the user a message that they may need to sign in again, generating a new authorization_code and eventually a new access_token.

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

- Now, you can perform the exact same `AcquireTokenSilentAsync` call in the `Create` and `Delete` actions.  In web apps, you can use this ADAL method to get access_tokens whenever you need them in your app.  ADAL will take care of acquiring, caching, and refreshing tokens for you.

Finally, build and run your app!  Sign in with either a Microsoft Account or an Azure AD Account, and notice how the user's identity is reflected in the top navigation bar.  Add and delete some items from the user's To-Do List to see the OAuth 2.0 secured API calls in action.  You now have a web app & web API, both secured using industry standard protocols, that can authenticate users with both their personal and work/school accounts.

For reference, the completed sample (without your configuration values) [is provided here](https://github.com/AzureADQuickStarts/v2-WebApp-WebAPI-OpenIdConnect-DotNet/archive/complete.zip).  

If you want to move onto other topics, you may want to try:

[Calling Office 365 REST APIs with the v2.0 endoint >>]()

For additional resources, check out:
- [The v2.0 Endpoint Preview >>](active-directory-v2-overview.md)
- [StackOverflow "AADv2.0 Tag" >>]()
