---
title: Configure a web app that calls web APIs
description: Learn how to configure the code of a web app that calls web APIs
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/08/2023
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform.
---

# A web app that calls web APIs: Code configuration

As shown in the [Web app that signs in users](scenario-web-app-sign-user-overview.md) scenario, the web app uses the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md) to sign the user in. This flow has two steps:

1. Request an authorization code. This part delegates a private dialogue with the user to the Microsoft identity platform. During that dialogue, the user signs in and consents to the use of web APIs. When the private dialogue ends successfully, the web app receives an authorization code on its redirect URI.
1. Request an access token for the API by redeeming the authorization code.

The [Web app that signs in users](scenario-web-app-sign-user-overview.md) scenarios covered only the first step. Here you learn how to modify your web app so that it not only signs users in but also now calls web APIs.

## Microsoft libraries supporting web apps

The following Microsoft libraries support web apps:

[!INCLUDE [active-directory-develop-libraries-webapp](./includes/libraries/libraries-webapp.md)]

Select the tab for the platform you're interested in:

# [ASP.NET Core](#tab/aspnetcore)

## Client secrets or client certificates

[!INCLUDE [web-app-client-credentials.md](./includes/web-app-client-credentials.md)]

## Startup.cs

Your web app needs to acquire a token for the downstream API. You specify it by adding the `.EnableTokenAcquisitionToCallDownstreamApi()` line after `.AddMicrosoftIdentityWebApp(Configuration)`. This line exposes the `IAuthorizationHeaderProvider` service that you can use in your controller and page actions. However, as you see in the following two options, it can be done more simply. You also need to choose a token cache implementation, for example `.AddInMemoryTokenCaches()`, in *Startup.cs*:

   ```csharp
   using Microsoft.Identity.Web;

   public class Startup
   {
     // ...
     public void ConfigureServices(IServiceCollection services)
     {
     // ...
     services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
             .AddMicrosoftIdentityWebApp(Configuration, "AzureAd")
               .EnableTokenAcquisitionToCallDownstreamApi(new string[]{"user.read" })
               .AddInMemoryTokenCaches();
      // ...
     }
     // ...
   }
   ```

The scopes passed to `EnableTokenAcquisitionToCallDownstreamApi` are optional, and enable your web app to request the scopes and the user's consent to those scopes when they sign in. If you don't specify the scopes, *Microsoft.Identity.Web* enables an incremental consent experience.

*Microsoft.Identity.Web* offers two mechanisms for calling a web API from a web app without you having to acquire a token. The option you choose depends on whether you want to call Microsoft Graph or another API.

### Option 1: Call Microsoft Graph

If you want to call Microsoft Graph, *Microsoft.Identity.Web* enables you to directly use the `GraphServiceClient` (exposed by the Microsoft Graph SDK) in your API actions. To expose Microsoft Graph:

1. Add the [Microsoft.Identity.Web.GraphServiceClient](https://www.nuget.org/packages/Microsoft.Identity.Web.GraphServiceClient) NuGet package to your project.
1. Add `.AddMicrosoftGraph()` after `.EnableTokenAcquisitionToCallDownstreamApi()` in the *Startup.cs* file. `.AddMicrosoftGraph()` has several overrides. Using the override that takes a configuration section as a parameter, the code becomes:

   ```csharp
   using Microsoft.Identity.Web;

   public class Startup
   {
     // ...
     public void ConfigureServices(IServiceCollection services)
     {
     // ...
     services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
             .AddMicrosoftIdentityWebApp(Configuration, "AzureAd")
               .EnableTokenAcquisitionToCallDownstreamApi(new string[]{"user.read" })
                  .AddMicrosoftGraph(Configuration.GetSection("GraphBeta"))
               .AddInMemoryTokenCaches();
      // ...
     }
     // ...
   }
   ```

### Option 2: Call a downstream web API other than Microsoft Graph

If you want to call an API other than Microsoft Graph, *Microsoft.Identity.Web* enables you to use the `IDownstreamApi` interface in your API actions. To use this interface:

1. Add the [Microsoft.Identity.Web.DownstreamApi](https://www.nuget.org/packages/Microsoft.Identity.Web.DownstreamApi) NuGet package to your project.
1. Add `.AddDownstreamApi()` after `.EnableTokenAcquisitionToCallDownstreamApi()` in the *Startup.cs* file. `.AddDownstreamApi()` has two arguments, and is shown in the following snippet:
   - The name of a service (API), which is used in your controller actions to reference the corresponding configuration
   - a configuration section representing the parameters used to call the downstream web API.


   ```csharp
   using Microsoft.Identity.Web;

   public class Startup
   {
     // ...
     public void ConfigureServices(IServiceCollection services)
     {
     // ...
     services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
             .AddMicrosoftIdentityWebApp(Configuration, "AzureAd")
               .EnableTokenAcquisitionToCallDownstreamApi(new string[]{"user.read" })
                  .AddDownstreamApi("MyApi", Configuration.GetSection("GraphBeta"))
               .AddInMemoryTokenCaches();
      // ...
     }
     // ...
   }
   ```

### Summary

As with web APIs, you can choose various token cache implementations. For details, see [Microsoft.Identity.Web - Token cache serialization](https://aka.ms/ms-id-web/token-cache-serialization) on GitHub.

The following image shows the various possibilities of *Microsoft.Identity.Web* and their effect on the *Startup.cs* file:

:::image type="content" source="media/scenarios/microsoft-identity-web-startup-cs.svg" alt-text="Block diagram showing service configuration options in startup dot C S for calling a web API and specifying a token cache implementation":::

> [!NOTE]
> To fully understand the code examples here, be familiar with [ASP.NET Core fundamentals](/aspnet/core/fundamentals), and in particular with [dependency injection](/aspnet/core/fundamentals/dependency-injection) and [options](/aspnet/core/fundamentals/configuration/options).

# [ASP.NET](#tab/aspnet)


## Client secrets or client certificates

[!INCLUDE [web-app-client-credentials.md](./includes/web-app-client-credentials.md)]

## Startup.Auth.cs

Your web app needs to acquire a token for the downstream API, *Microsoft.Identity.Web* provides two mechanisms for calling a web API from a web app. The option you choose depends on whether you want to call Microsoft Graph or another API.

### Option 1: Call Microsoft Graph

If you want to call Microsoft Graph, *Microsoft.Identity.Web* enables you to directly use the `GraphServiceClient` (exposed by the Microsoft Graph SDK) in your API actions. To expose Microsoft Graph:

1. Add the [Microsoft.Identity.Web.GraphServiceClient](https://www.nuget.org/packages/Microsoft.Identity.Web.GraphServiceClient) NuGet package to your project.
1. Add `.AddMicrosoftGraph()` to the service collection in the *Startup.Auth.cs* file. `.AddMicrosoftGraph()` has several overrides. Using the override that takes a configuration section as a parameter, the code becomes:

  ```csharp
  using Microsoft.Extensions.DependencyInjection;
  using Microsoft.Identity.Client;
  using Microsoft.Identity.Web;
  using Microsoft.Identity.Web.OWIN;
  using Microsoft.Identity.Web.TokenCacheProviders.InMemory;
  using Microsoft.IdentityModel.Validators;
  using Microsoft.Owin.Security;
  using Microsoft.Owin.Security.Cookies;
  using Owin;

  namespace WebApp
  {
      public partial class Startup
      {
          public void ConfigureAuth(IAppBuilder app)
          {
              app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

              app.UseCookieAuthentication(new CookieAuthenticationOptions());

              // Get an TokenAcquirerFactory specialized for OWIN
              OwinTokenAcquirerFactory owinTokenAcquirerFactory = TokenAcquirerFactory.GetDefaultInstance<OwinTokenAcquirerFactory>();

              // Configure the web app.
              app.AddMicrosoftIdentityWebApp(owinTokenAcquirerFactory,
                                            updateOptions: options => {});

              // Add the services you need.
              owinTokenAcquirerFactory.Services
                  .Configure<ConfidentialClientApplicationOptions>(options => 
                        { options.RedirectUri = "https://localhost:44326/"; })
                  .AddMicrosoftGraph()
                  .AddInMemoryTokenCaches();
              owinTokenAcquirerFactory.Build();
          }
      }
  }
  ```

### Option 2: Call a downstream web API other than Microsoft Graph

If you want to call an API other than Microsoft Graph, *Microsoft.Identity.Web* enables you to use the `IDownstreamApi` interface in your API actions. To use this interface:

1. Add the [Microsoft.Identity.Web.DownstreamApi](https://www.nuget.org/packages/Microsoft.Identity.Web.DownstreamApi) NuGet package to your project.
1. Add `.AddDownstreamApi()` after `.EnableTokenAcquisitionToCallDownstreamApi()` in the *Startup.cs* file. `.AddDownstreamApi()` has two arguments:
   - The name of a service (api): you use this name in your controller actions to reference the corresponding configuration
   - a configuration section representing the parameters used to call the downstream web API.

Here's the code:

   ```csharp
  using Microsoft.Extensions.DependencyInjection;
  using Microsoft.Identity.Client;
  using Microsoft.Identity.Web;
  using Microsoft.Identity.Web.OWIN;
  using Microsoft.Identity.Web.TokenCacheProviders.InMemory;
  using Microsoft.IdentityModel.Validators;
  using Microsoft.Owin.Security;
  using Microsoft.Owin.Security.Cookies;
  using Owin;

  namespace WebApp
  {
      public partial class Startup
      {
          public void ConfigureAuth(IAppBuilder app)
          {
              app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

              app.UseCookieAuthentication(new CookieAuthenticationOptions());

              // Get an TokenAcquirerFactory specialized for OWIN.
              OwinTokenAcquirerFactory owinTokenAcquirerFactory = TokenAcquirerFactory.GetDefaultInstance<OwinTokenAcquirerFactory>();

              // Configure the web app.
              app.AddMicrosoftIdentityWebApp(owinTokenAcquirerFactory,
                                            updateOptions: options => {});

              // Add the services you need.
              owinTokenAcquirerFactory.Services
                  .Configure<ConfidentialClientApplicationOptions>(options => 
                        { options.RedirectUri = "https://localhost:44326/"; })
                  .AddDownstreamApi("Graph", owinTokenAcquirerFactory.Configuration.GetSection("GraphBeta"))
                  .AddInMemoryTokenCaches();
              owinTokenAcquirerFactory.Build();
          }
      }
  }
   ```

### Summary

You can choose various token cache implementations. For details, see [Microsoft.Identity.Web - Token cache serialization](https://aka.ms/ms-id-web/token-cache-serialization) on GitHub.

The following image shows the various possibilities of *Microsoft.Identity.Web* and their effect on the *Startup.cs* file:

:::image type="content" source="media/scenarios/microsoft-identity-web-startup-cs.svg" alt-text="Block diagram showing service configuration options in startup dot C S for calling a web API and specifying a token cache implementation":::

> [!NOTE]
> To fully understand the code examples here, be familiar with [ASP.NET Core fundamentals](/aspnet/core/fundamentals), and in particular with [dependency injection](/aspnet/core/fundamentals/dependency-injection) and [options](/aspnet/core/fundamentals/configuration/options).

Code examples in this article and the following one are extracted from the [ASP.NET Web app sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect). You might want to refer to that sample for full implementation details.

# [Java](#tab/java)

Code examples in this article and the following one are extracted from the [Java web application that calls Microsoft Graph](https://github.com/Azure-Samples/ms-identity-java-webapp), a web-app sample that uses MSAL for Java.
The sample currently lets MSAL for Java produce the authorization-code URL and handles the navigation to the authorization endpoint for the Microsoft identity platform. It's also possible to use Sprint security to sign the user in. You might want to refer to the sample for full implementation details.

# [Node.js](#tab/nodejs)

Code examples in this article and the following one are extracted from the [Node.js & Express.js web application that calls Microsoft Graph](https://github.com/Azure-Samples/ms-identity-node), a web app sample that uses MSAL Node.

The sample currently lets MSAL Node produce the authorization-code URL and handles the navigation to the authorization endpoint for the Microsoft identity platform. This is shown below:

:::code language="js" source="~/ms-identity-node/App/auth/AuthProvider.js" range="187-232":::

# [Python](#tab/python)

Code snippets in this article and the following are extracted from the [Python web application calling Microsoft graph](https://github.com/Azure-Samples/ms-identity-python-webapp) sample using the [identity package](https://pypi.org/project/identity/) (a wrapper around MSAL Python).

The sample uses the identity package to produce the authorization-code URL and handles the navigation to the authorization endpoint for the Microsoft identity platform. You might want to refer to the sample for full implementation details.

---

## Code that redeems the authorization code

# [ASP.NET Core](#tab/aspnetcore)

Microsoft.Identity.Web simplifies your code by setting the correct OpenID Connect settings, subscribing to the code received event, and redeeming the code. No extra code is required to redeem the authorization code. See [Microsoft.Identity.Web source code](https://github.com/AzureAD/microsoft-identity-web/blob/c29f1a7950b940208440bebf0bcb524a7d6bee22/src/Microsoft.Identity.Web/WebAppExtensions/WebAppCallsWebApiAuthenticationBuilderExtensions.cs#L140) for details on how this works.

# [ASP.NET](#tab/aspnet)

*Microsoft.Identity.Web.OWIN* simplifies your code by setting the correct OpenID Connect settings, subscribing to the code received event, and redeeming the code. No extra code is required to redeem the authorization code. See [Microsoft.Identity.Web source code](https://github.com/AzureAD/microsoft-identity-web/blob/9fdcf15c66819b31b1049955eed5d3e5391656f5/src/Microsoft.Identity.Web.OWIN/AppBuilderExtension.cs#L95) for details on how this works.

# [Node.js](#tab/nodejs)

The *handleRedirect* method in **AuthProvider** class processes the authorization code received from Microsoft Entra ID. This is shown below:

:::code language="js" source="~/ms-identity-node/App/auth/AuthProvider.js" range="123-155":::

# [Java](#tab/java)

See [Web app that signs in users: Code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=java#initialization-code) to understand how the Java sample gets the authorization code. After the app receives the code, the [AuthFilter.java#L51-L56](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/java/com/microsoft/azure/msalwebsample/AuthFilter.java#L51-L56):

1. Delegates to the `AuthHelper.processAuthenticationCodeRedirect` method in [AuthHelper.java#L67-L97](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/java/com/microsoft/azure/msalwebsample/AuthHelper.java#L67-L97).
1. Calls `getAuthResultByAuthCode`.

```Java
class AuthHelper {
  // Code omitted
  void processAuthenticationCodeRedirect(HttpServletRequest httpRequest, String currentUri, String fullUrl)
            throws Throwable {

  // Code omitted
  AuthenticationResponse authResponse = AuthenticationResponseParser.parse(new URI(fullUrl), params);

  // Code omitted
  IAuthenticationResult result = getAuthResultByAuthCode(
                    httpRequest,
                    oidcResponse.getAuthorizationCode(),
                    currentUri);

// Code omitted
  }
}
```

The `getAuthResultByAuthCode` method is defined in [AuthHelper.java#L176](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/java/com/microsoft/azure/msalwebsample/AuthHelper.java#L176). It creates an MSAL `ConfidentialClientApplication`, and then calls `acquireToken()` with `AuthorizationCodeParameters` created from the authorization code.

```Java
   private IAuthenticationResult getAuthResultByAuthCode(
            HttpServletRequest httpServletRequest,
            AuthorizationCode authorizationCode,
            String currentUri) throws Throwable {

        IAuthenticationResult result;
        ConfidentialClientApplication app;
        try {
            app = createClientApplication();

            String authCode = authorizationCode.getValue();
            AuthorizationCodeParameters parameters = AuthorizationCodeParameters.builder(
                    authCode,
                    new URI(currentUri)).
                    build();

            Future<IAuthenticationResult> future = app.acquireToken(parameters);

            result = future.get();
        } catch (ExecutionException e) {
            throw e.getCause();
        }

        if (result == null) {
            throw new ServiceUnavailableException("authentication result was null");
        }

        SessionManagementHelper.storeTokenCacheInSession(httpServletRequest, app.tokenCache().serialize());

        return result;
    }

    private ConfidentialClientApplication createClientApplication() throws MalformedURLException {
        return ConfidentialClientApplication.builder(clientId, ClientCredentialFactory.create(clientSecret)).
                authority(authority).
                build();
    }
```

# [Python](#tab/python)

See [Web app that signs in users: Code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=python#initialization-code) to understand how the Python sample gets the authorization code. 

The Microsoft sign-in screen sends the authorization code to the `/getAToken` URL that was specified in the app registration. The `auth_response` route handles that URL, calling `auth.complete_login` to process the authorization code, and then either returning an error or redirecting to the home page.

:::code language="python" source="~/ms-identity-python-webapp-tutorial/app.py" range="36-41":::

See `app.py` for the full context of that code.

---

Instead of a client secret, the confidential client application can also prove its identity by using a client certificate or a client assertion.
The use of client assertions is an advanced scenario, detailed in [Client assertions](/entra/msal/dotnet/acquiring-tokens/msal-net-client-assertions).

## Token cache

> [!IMPORTANT]
> The token-cache implementation for web apps or web APIs is different from the implementation for desktop applications, which is often [file based](/entra/msal/dotnet/how-to/token-cache-serialization).
> For security and performance reasons, it's important to ensure that for web apps and web APIs there is one token cache per user account. You must serialize the token cache for each account.

# [ASP.NET Core](#tab/aspnetcore)

The ASP.NET core tutorial uses dependency injection to let you decide the token cache implementation in the Startup.cs file for your application. Microsoft.Identity.Web comes with prebuilt token-cache serializers described in [Token cache serialization](/entra/msal/dotnet/how-to/token-cache-serialization). An interesting possibility is to choose ASP.NET Core [distributed memory caches](/aspnet/core/performance/caching/distributed#distributed-memory-cache):

```csharp
// Use a distributed token cache by adding:
    services.AddMicrosoftIdentityWebAppAuthentication(Configuration, "AzureAd")
            .EnableTokenAcquisitionToCallDownstreamApi(
                initialScopes: new string[] { "user.read" })
            .AddDistributedTokenCaches();

// Then, choose your implementation.
// For instance, the distributed in-memory cache (not cleared when you stop the app):
services.AddDistributedMemoryCache();

// Or a Redis cache:
services.AddStackExchangeRedisCache(options =>
{
 options.Configuration = "localhost";
 options.InstanceName = "SampleInstance";
});

// Or even a SQL Server token cache:
services.AddDistributedSqlServerCache(options =>
{
 options.ConnectionString = _config["DistCache_ConnectionString"];
 options.SchemaName = "dbo";
 options.TableName = "TestCache";
});
```

For details about the token-cache providers, see also Microsoft.Identity.Web's [Token cache serialization](https://aka.ms/ms-id-web/token-cache-serialization) article, and the [ASP.NET Core Web app tutorials | Token caches](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-2-TokenCache) phase of the web apps tutorial.

# [ASP.NET](#tab/aspnet)

The ASP.NET tutorial uses dependency injection to let you decide the token cache implementation in the *Startup.Auth.cs* file for your application. *Microsoft.Identity.Web* comes with prebuilt token-cache serializers described in [Token cache serialization](/entra/msal/dotnet/how-to/token-cache-serialization). An interesting possibility is to choose ASP.NET Core [distributed memory caches](/aspnet/core/performance/caching/distributed#distributed-memory-cache):

```csharp
var services = owinTokenAcquirerFactory.Services;
// Use a distributed token cache by adding:
services.AddDistributedTokenCaches();

// Then, choose your implementation.
// For instance, the distributed in-memory cache (not cleared when you stop the app):
services.AddDistributedMemoryCache();

// Or a Redis cache:
services.AddStackExchangeRedisCache(options =>
{
 options.Configuration = "localhost";
 options.InstanceName = "SampleInstance";
});

// Or even a SQL Server token cache:
services.AddDistributedSqlServerCache(options =>
{
 options.ConnectionString = _config["DistCache_ConnectionString"];
 options.SchemaName = "dbo";
 options.TableName = "TestCache";
});
```

For details about the token-cache providers, see also the *Microsoft.Identity.Web* [Token cache serialization](https://aka.ms/ms-id-web/token-cache-serialization) article, and the [ASP.NET Core Web app tutorials | Token caches](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-2-TokenCache) phase of the web app's tutorial.

For details see [Token cache serialization for MSAL.NET](/entra/msal/dotnet/how-to/token-cache-serialization).

# [Java](#tab/java)

MSAL Java provides methods to serialize and deserialize the token cache. The Java sample handles the serialization from the session, as shown in the `getAuthResultBySilentFlow` method in [AuthHelper.java#L99-L122](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/java/com/microsoft/azure/msalwebsample/AuthHelper.java#L99-L122):

```Java
IAuthenticationResult getAuthResultBySilentFlow(HttpServletRequest httpRequest, HttpServletResponse httpResponse)
      throws Throwable {

  IAuthenticationResult result =  SessionManagementHelper.getAuthSessionObject(httpRequest);

  IConfidentialClientApplication app = createClientApplication();

  Object tokenCache = httpRequest.getSession().getAttribute("token_cache");
  if (tokenCache != null) {
      app.tokenCache().deserialize(tokenCache.toString());
  }

  SilentParameters parameters = SilentParameters.builder(
          Collections.singleton("User.Read"),
          result.account()).build();

  CompletableFuture<IAuthenticationResult> future = app.acquireTokenSilently(parameters);
  IAuthenticationResult updatedResult = future.get();

  // Update session with latest token cache.
  SessionManagementHelper.storeTokenCacheInSession(httpRequest, app.tokenCache().serialize());

  return updatedResult;
}
```

The detail of the `SessionManagementHelper` class is provided in the [MSAL sample for Java](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/java/com/microsoft/azure/msalwebsample/SessionManagementHelper.java).

# [Node.js](#tab/nodejs)

In the Node.js sample, the application session is used to store the token cache. Using MSAL Node cache methods, the token cache in session is read before a token request is made, and then updated once the token request is successfully completed. This is shown below:

:::code language="js" source="~/ms-identity-node/App/auth/AuthProvider.js" range="79-121":::

# [Python](#tab/python)

In the Python sample, the identity package takes care of the token cache, using the global `session` object for storage. 

Flask has built-in support for sessions stored in a cookie, but due to the length of the identity cookies, the sample uses the [Flask-session](https://flask-session.readthedocs.io/) package instead. Everything is initialized in *app.py*:

:::code language="python" source="~/ms-identity-python-webapp-tutorial/app.py" range="1-11,19-25" highlight="5,11":::

Due to the `SESSION_TYPE="filesystem"` setting in `app_config.py`, the Flask-session package stores sessions using the local file system.

For production, you should use [a setting](https://flask-session.readthedocs.io/en/latest/#configuration) that persists across multiple instances and deploys of your app, such as "sqlachemy" or "redis".

---

## Next steps

At this point, when the user signs in, a token is stored in the token cache. Let's see how it's then used in other parts of the web app.

# [ASP.NET Core](#tab/aspnetcore)

Move on to the next article in this scenario,
[Remove accounts from the cache on global sign out](scenario-web-app-call-api-sign-in.md?tabs=aspnetcore).

# [ASP.NET](#tab/aspnet)

Move on to the next article in this scenario,
[Remove accounts from the cache on global sign out](scenario-web-app-call-api-sign-in.md?tabs=aspnet).

# [Java](#tab/java)

Move on to the next article in this scenario,
[Remove accounts from the cache on global sign out](scenario-web-app-call-api-sign-in.md?tabs=java).

# [Node.js](#tab/nodejs)

Move on to the next article in this scenario,
[Remove accounts from the cache on global sign out](scenario-web-app-call-api-sign-in.md?tabs=nodejs).

# [Python](#tab/python)

Move on to the next article in this scenario,
[Remove accounts from the cache on global sign out](scenario-web-app-call-api-sign-in.md?tabs=python).

---
