---
title: Web app that calls web APIs (code configuration) - Microsoft identity platform
description: Learn how to build a Web app that calls web APIs (app's code configuration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a Web app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that calls web APIs - code configuration

As seen in the [Web app signs-in users scenario](scenario-web-app-sign-user-overview.md), given that signing in user is delegated to the Open ID connect (OIDC) middleware, you want to hook-up in the OIDC process. The way to do that is different depending on the framework you used (here ASP.NET and ASP.NET Core), but in the end, you'll subscribe to middleware OIDC events. The principle is that:

- You'll let ASP.NET or ASP.NET core request an authorization code. By doing this ASP.NET/ASP.NET core will let the user sign in and consent,
- You'll subscribe to the reception of the authorization code by the Web app.
- When the auth code is received, you'll use MSAL libraries to redeem the code and the resulting access tokens and refresh tokens store in the token cache. From there, the cache can be used in other parts of the application to acquire other tokens silently.

## Libraries supporting Web App scenarios

The libraries supporting the authorization code flow for Web Apps are:

| MSAL library | Description |
|--------------|-------------|
| ![MSAL.NET](media/sample-v2-code/logo_NET.png) <br/> MSAL.NET  | Supported platforms are .NET Framework and .NET Core platforms (not UWP, Xamarin.iOS, and Xamarin.Android as those platforms are used to build public client applications) |
| ![Python](media/sample-v2-code/logo_python.png) <br/> MSAL.Python | Development in progress - in public preview |
| ![Java](media/sample-v2-code/logo_java.png) <br/> MSAL.Java | Development in progress - in public preview |

## ASP.NET Core configuration

In ASP.NET Core, things happen in the `Startup.cs` file. You'll want to subscribe to the `OnAuthorizationCodeReceived` open ID connect event, and from this event, call MSAL.NET's method `AcquireTokenFromAuthorizationCode` which has the effect of storing in the token cache, the access token for the requested scopes, and a refresh token that will be used to refresh the access token when it's close to expiry, or to get a token on behalf of the same user, but for a different resource.

The comments in the code below will help you understand some tricky aspects of weaving MSAL.NET and ASP.NET Core. Full details are provided in the [ASP.NET Core Web app incremental tutorial, chapter 2](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-1-Call-MSGraph)

```CSharp
  services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
  {
   // Response type. We ask ASP.NET to request an Auth Code, and an IDToken
   options.ResponseType = OpenIdConnectResponseType.CodeIdToken;

   // This "offline_access" scope is needed to get a refresh token when users sign in with
   // their Microsoft personal accounts
   // (it's required by MSAL.NET and automatically provided by Azure AD when users
   // sign in with work or school accounts, but not with their Microsoft personal accounts)
   options.Scope.Add(OidcConstants.ScopeOfflineAccess);
   options.Scope.Add("user.read"); // for instance

   // Handling the auth redemption by MSAL.NET so that a token is available in the token cache
   // where it will be usable from Controllers later (through the TokenAcquisition service)
   var handler = options.Events.OnAuthorizationCodeReceived;
   options.Events.OnAuthorizationCodeReceived = async context =>
   {
    // As AcquireTokenByAuthorizationCode is asynchronous we want to tell ASP.NET core
    // that we are handing the code even if it's not done yet, so that it does 
    // not concurrently call the Token endpoint.
    context.HandleCodeRedemption();

    // Call MSAL.NET AcquireTokenByAuthorizationCode
    var application = BuildConfidentialClientApplication(context.HttpContext,
                                                         context.Principal);
    var result = await application.AcquireTokenByAuthorizationCode(scopes.Except(scopesRequestedByMsalNet), context.ProtocolMessage.Code)
                                  .ExecuteAsync();

    // Do not share the access token with ASP.NET Core otherwise ASP.NET will cache it
    // and will not send the OAuth 2.0 request in case a further call to
    // AcquireTokenByAuthorizationCodeAsync in the future for incremental consent 
    // (getting a code requesting more scopes)
    // Share the ID Token so that the identity of the user is known in the application (in 
    // HttpContext.User)
    context.HandleCodeRedemption(null, result.IdToken);

    // Call the previous handler if any
    await handler(context);
   };
```

In ASP.NET Core, building the confidential client application uses information that is in the HttpContext. This HttpContext knows about the URL for the Web App, and the signed-in user (in a  `ClaimsPrincipal`). It also uses the ASP.NET Core configuration, which has an "AzureAD" section, and which is bound to the `_applicationOptions` data structure. Finally the application needs to maintain token caches.

```CSharp
/// <summary>
/// Creates an MSAL Confidential client application
/// </summary>
/// <param name="httpContext">HttpContext associated with the OIDC response</param>
/// <param name="claimsPrincipal">Identity for the signed-in user</param>
/// <returns></returns>
private IConfidentialClientApplication BuildConfidentialClientApplication(HttpContext httpContext, ClaimsPrincipal claimsPrincipal)
{
 var request = httpContext.Request;

 // Find the URI of the application)
 string currentUri = UriHelper.BuildAbsolute(request.Scheme, request.Host, request.PathBase, azureAdOptions.CallbackPath ?? string.Empty);

 // Updates the authority from the instance (including national clouds) and the tenant
 string authority = $"{azureAdOptions.Instance}{azureAdOptions.TenantId}/";

 // Instantiates the application based on the application options (including the client secret)
 var app = ConfidentialClientApplicationBuilder.CreateWithApplicationOptions(_applicationOptions)
               .WithRedirectUri(currentUri)
               .WithAuthority(authority)
               .Build();

 // Initialize token cache providers. In the case of Web applications, there must be one
 // token cache per user (here the key of the token cache is in the claimsPrincipal which
 // contains the identity of the signed-in user)
 if (this.UserTokenCacheProvider != null)
 {
  this.UserTokenCacheProvider.Initialize(app.UserTokenCache, httpContext, claimsPrincipal);
 }
 if (this.AppTokenCacheProvider != null)
 {
  this.AppTokenCacheProvider.Initialize(app.AppTokenCache, httpContext);
 }
 return app;
}
```

`AcquireTokenByAuthorizationCode` really redeems the authorization code requested by ASP.NET and gets the tokens that are added to MSAL.NET user token cache. From there, they're then, used, in the ASP.NET Core controllers.

## ASP.NET Configuration

The way ASP.NET handles things is similar, except that the configuration of OpenIdConnect and the subscription to the `OnAuthorizationCodeReceived` event happens in the `App_Start\Startup.Auth.cs` file. You'll find similar concepts, except that here you'll need to specify the RedirectUri in the config file, which is a bit less robust:

```CSharp
private void ConfigureAuth(IAppBuilder app)
{
 app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

 app.UseCookieAuthentication(new CookieAuthenticationOptions { });

 app.UseOpenIdConnectAuthentication(
 new OpenIdConnectAuthenticationOptions
 {
  Authority = Globals.Authority,
  ClientId = Globals.ClientId,
  RedirectUri = Globals.RedirectUri,
  PostLogoutRedirectUri = Globals.RedirectUri,
  Scope = Globals.BasicSignInScopes, // a basic set of permissions for user sign in & profile access
  TokenValidationParameters = new TokenValidationParameters
  {
   NameClaimType = "name",
  },
  Notifications = new OpenIdConnectAuthenticationNotifications()
  {
   AuthorizationCodeReceived = OnAuthorizationCodeReceived,
  }
 });
}
```

```CSharp
private async Task OnAuthorizationCodeReceived(AuthorizationCodeReceivedNotification context)
{
 // Upon successful sign in, get & cache a token using MSAL
 string userId = context.AuthenticationTicket.Identity.FindFirst(ClaimTypes.NameIdentifier).Value;
 IConfidentialClientApplication clientapp;
 clientApp = ConfidentialClientApplicationBuilder.Create(Globals.ClientId)
                  .WithClientSecret(Globals.ClientSecret)
                  .WithRedirectUri(Globals.RedirectUri)
                  .WithAuthority(new Uri(Globals.Authority))
                  .Build();

  EnablePersistence(HttpContext, clientApp.UserTokenCache, clientApp.AppTokenCache);

 AuthenticationResult result = await clientapp.AcquireTokenByAuthorizationCode(scopes, context.Code)
                                              .ExecuteAsync();
}
```

### MSAL.NET Token cache for a ASP.NET (Core) Web app

In web apps (or web APIs as a matter of fact), the token cache implementation is different from the Desktop applications token cache implementations (which are often [file based](scenario-desktop-acquire-token.md#file-based-token-cache). It can use the ASP.NET/ASP.NET Core session, or a Redis cache, or a database, or even Azure Blob storage. In the code snippet above this is the object of the `EnablePersistence(HttpContext, clientApp.UserTokenCache, clientApp.AppTokenCache);` method call, which binds a cache service. The detail of what happens here is beyond the scope of this scenario guide, but links are provided below.

> [!IMPORTANT]
> A very important thing to realize is that for web Apps and web APIs, there should be one token cache per user (per account). You need to serialize the token cache for each account.

Examples of how to use token caches for Web apps and web APIs are available in the [ASP.NET Core Web app tutorial](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial) in the phase [2-2 Token Cache](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-2-TokenCache). For implementations have a look at the following folder [TokenCacheProviders](https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet/tree/master/src/Microsoft.Identity.Client.Extensions.Web/TokenCacheProviders) in the [microsoft-authentication-extensions-for-dotnet](https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet) library (in the [Microsoft.Identity.Client.Extensions.Web](https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet/tree/master/src/Microsoft.Identity.Client.Extensions.Web) folder.

## Next steps

At this point, when the user signs-in a token is stored in the token cache. Let's see how it's then used in other parts of the Web app.

> [!div class="nextstepaction"]
> [Sign in to the Web App](scenario-web-app-call-api-sign-in.md)
