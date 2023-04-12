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
ms.date: 09/25/2020
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev, devx-track-python
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform.
---

# A web app that calls web APIs: Code configuration

As shown in the [Web app that signs in users](scenario-web-app-sign-user-overview.md) scenario, the web app uses the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md) to sign the user in. This flow has two steps:

1. Request an authorization code. This part delegates a private dialogue with the user to the Microsoft identity platform. During that dialogue, the user signs in and consents to the use of web APIs. When the private dialogue ends successfully, the web app receives an authorization code on its redirect URI.
1. Request an access token for the API by redeeming the authorization code.

The [Web app that signs in users](scenario-web-app-sign-user-overview.md) scenarios covered only the first step. Here you learn how to modify your web app so that it not only signs users in but also now calls web APIs.

## Microsoft libraries supporting web apps

The following Microsoft libraries support web apps:

[!INCLUDE [active-directory-develop-libraries-webapp](../../../includes/active-directory-develop-libraries-webapp.md)]

Select the tab for the platform you're interested in:

# [ASP.NET Core](#tab/aspnetcore)

## Client secrets or client certificates

Given that your web app now calls a downstream web API, provide a client secret or client certificate in the *appsettings.json* file. You can also add a section that specifies:

- The URL of the downstream web API
- The scopes required for calling the API

In the following example, the `GraphBeta` section specifies these settings.

```JSON
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Client_id-of-web-app-eg-2ec40e65-ba09-4853-bcde-bcb60029e596]",
    "TenantId": "common",

   // To call an API
   "ClientSecret": "[Copy the client secret added to the app from the Azure portal]",
   "ClientCertificates": [
  ]
 },
 "GraphBeta": {
    "BaseUrl": "https://graph.microsoft.com/beta",
    "Scopes": "user.read"
    }
}
```

Instead of a client secret, you can provide a client certificate. The following code snippet shows using a certificate stored in Azure Key Vault.

```JSON
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Client_id-of-web-app-eg-2ec40e65-ba09-4853-bcde-bcb60029e596]",
    "TenantId": "common",

   // To call an API
   "ClientCertificates": [
      {
        "SourceType": "KeyVault",
        "KeyVaultUrl": "https://msidentitywebsamples.vault.azure.net",
        "KeyVaultCertificateName": "MicrosoftIdentitySamplesCert"
      }
   ]
  },
  "GraphBeta": {
    "BaseUrl": "https://graph.microsoft.com/beta",
    "Scopes": "user.read"
  }
}
```

*Microsoft.Identity.Web* provides several ways to describe certificates, both by configuration or by code. For details, see [Microsoft.Identity.Web - Using certificates](https://github.com/AzureAD/microsoft-identity-web/wiki/Using-certificates) on GitHub.

## Startup.cs

Your web app needs to acquire a token for the downstream API. You specify it by adding the `.EnableTokenAcquisitionToCallDownstreamApi()` line after `.AddMicrosoftIdentityWebApp(Configuration)`. This line exposes the `ITokenAcquisition` service that you can use in your controller and page actions. However, as you'll see in the following two options, it can be done more simply. You'll also need to choose a token cache implementation, for example `.AddInMemoryTokenCaches()`, in *Startup.cs*:

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

If you don't want to acquire the token yourself, *Microsoft.Identity.Web* provides two mechanisms for calling a web API from a web app. The option you choose depends on whether you want to call Microsoft Graph or another API.

### Option 1: Call Microsoft Graph

If you want to call Microsoft Graph, *Microsoft.Identity.Web* enables you to directly use the `GraphServiceClient` (exposed by the Microsoft Graph SDK) in your API actions. To expose Microsoft Graph:

1. Add the [Microsoft.Identity.Web.MicrosoftGraph](https://www.nuget.org/packages/Microsoft.Identity.Web.MicrosoftGraph) NuGet package to your project.
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

To call a web API other than Microsoft Graph, *Microsoft.Identity.Web* provides `.AddDownstreamWebApi()`, which requests tokens and calls the downstream web API.

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
                  .AddDownstreamWebApi("MyApi", Configuration.GetSection("GraphBeta"))
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

Because user sign-in is delegated to the OpenID Connect (OIDC) middleware, you must interact with the OIDC process. How you interact depends on the framework you use.

For ASP.NET, you'll subscribe to middleware OIDC events:

- You'll let ASP.NET Core request an authorization code by means of the Open ID Connect middleware. ASP.NET or ASP.NET Core will let the user sign in and consent.
- You'll subscribe the web app to receive the authorization code. This subscription is done by using a C# delegate.
- When the authorization code is received, the code uses MSAL libraries to redeem it. The resulting access tokens and refresh tokens are stored in the token cache. The cache can be used in other parts of the application, such as controllers, to acquire other tokens silently.

Code examples in this article and the following one are extracted from the [ASP.NET Web app sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect). You might want to refer to that sample for full implementation details.

# [Java](#tab/java)

Code examples in this article and the following one are extracted from the [Java web application that calls Microsoft Graph](https://github.com/Azure-Samples/ms-identity-java-webapp), a web-app sample that uses MSAL for Java.
The sample currently lets MSAL for Java produce the authorization-code URL and handles the navigation to the authorization endpoint for the Microsoft identity platform. It's also possible to use Sprint security to sign the user in. You might want to refer to the sample for full implementation details.

# [Python](#tab/python)

Code snippets in this article and the following are extracted from the [Python web application calling Microsoft graph](https://github.com/Azure-Samples/ms-identity-python-webapp) sample using the [identity package](https://pypi.org/project/identity/) (a wrapper around MSAL Python).

The sample uses the identity package to produce the authorization-code URL and handles the navigation to the authorization endpoint for the Microsoft identity platform. You might want to refer to the sample for full implementation details.

---

## Code that redeems the authorization code

# [ASP.NET Core](#tab/aspnetcore)

Microsoft.Identity.Web simplifies your code by setting the correct OpenID Connect settings, subscribing to the code received event, and redeeming the code. No extra code is required to redeem the authorization code. See [Microsoft.Identity.Web source code](https://github.com/AzureAD/microsoft-identity-web/blob/c29f1a7950b940208440bebf0bcb524a7d6bee22/src/Microsoft.Identity.Web/WebAppExtensions/WebAppCallsWebApiAuthenticationBuilderExtensions.cs#L140) for details on how this works.

# [ASP.NET](#tab/aspnet)

ASP.NET handles things similarly to ASP.NET Core, except that the configuration of OpenID Connect and the subscription to the `OnAuthorizationCodeReceived` event happen in the [App_Start\Startup.Auth.cs](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/App_Start/Startup.Auth.cs) file. The concepts are also similar to those in ASP.NET Core, except that in ASP.NET you must specify the `RedirectUri` in [Web.config#L15](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/master/WebApp/Web.config#L15). This configuration is a bit less robust than the one in ASP.NET Core, because you need to change it when you deploy your application.

Here's the code for Startup.Auth.cs:

```csharp
public partial class Startup
{
  public void ConfigureAuth(IAppBuilder app)
  {
    app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

    app.UseCookieAuthentication(new CookieAuthenticationOptions());

    // Custom middleware initialization. This is activated when the code obtained from a code_grant is present in the query string (&code=<code>).
    app.UseOAuth2CodeRedeemer(
        new OAuth2CodeRedeemerOptions
        {
            ClientId = AuthenticationConfig.ClientId,
            ClientSecret = AuthenticationConfig.ClientSecret,
            RedirectUri = AuthenticationConfig.RedirectUri
        }
      );

  app.UseOpenIdConnectAuthentication(
      new OpenIdConnectAuthenticationOptions
      {
        // The `Authority` represents the v2.0 endpoint - https://login.microsoftonline.com/common/v2.0.
        Authority = AuthenticationConfig.Authority,
        ClientId = AuthenticationConfig.ClientId,
        RedirectUri = AuthenticationConfig.RedirectUri,
        PostLogoutRedirectUri = AuthenticationConfig.RedirectUri,
        Scope = AuthenticationConfig.BasicSignInScopes + " Mail.Read", // A basic set of permissions for user sign-in and profile access "openid profile offline_access"
        TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            // In a real application, you would use IssuerValidator for additional checks, such as making sure the user's organization has signed up for your app.
            //     IssuerValidator = (issuer, token, tvp) =>
            //     {
            //        //if(MyCustomTenantValidation(issuer))
            //        return issuer;
            //        //else
            //        //    throw new SecurityTokenInvalidIssuerException("Invalid issuer");
            //    },
            //NameClaimType = "name",
        },
        Notifications = new OpenIdConnectAuthenticationNotifications()
        {
            AuthorizationCodeReceived = OnAuthorizationCodeReceived,
            AuthenticationFailed = OnAuthenticationFailed,
        }
      });
  }

  private async Task OnAuthorizationCodeReceived(AuthorizationCodeReceivedNotification context)
  {
      // Upon successful sign-in, get the access token and cache it by using MSAL.
      IConfidentialClientApplication clientApp = MsalAppBuilder.BuildConfidentialClientApplication(new ClaimsPrincipal(context.AuthenticationTicket.Identity));
      AuthenticationResult result = await clientApp.AcquireTokenByAuthorizationCode(new[] { "Mail.Read" }, context.Code).ExecuteAsync();
  }

  private Task OnAuthenticationFailed(AuthenticationFailedNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> notification)
  {
      notification.HandleResponse();
      notification.Response.Redirect("/Error?message=" + notification.Exception.Message);
      return Task.FromResult(0);
  }
}
```

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

See [app.py](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/0.5.0/app.py#L36-41) for the full context of that code.

---

Instead of a client secret, the confidential client application can also prove its identity by using a client certificate or a client assertion.
The use of client assertions is an advanced scenario, detailed in [Client assertions](msal-net-client-assertions.md).

## Token cache

> [!IMPORTANT]
> The token-cache implementation for web apps or web APIs is different from the implementation for desktop applications, which is often [file based](msal-net-token-cache-serialization.md).
> For security and performance reasons, it's important to ensure that for web apps and web APIs there is one token cache per user account. You must serialize the token cache for each account.

# [ASP.NET Core](#tab/aspnetcore)

The ASP.NET core tutorial uses dependency injection to let you decide the token cache implementation in the Startup.cs file for your application. Microsoft.Identity.Web comes with prebuilt token-cache serializers described in [Token cache serialization](msal-net-token-cache-serialization.md). An interesting possibility is to choose ASP.NET Core [distributed memory caches](/aspnet/core/performance/caching/distributed#distributed-memory-cache):

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

The token-cache implementation for web apps or web APIs is different from the implementation for desktop applications, which is often [file based](msal-net-token-cache-serialization.md).

The web-app implementation can use the ASP.NET session or the server memory. For example, see how the cache implementation is hooked after the creation of the MSAL.NET application in [MsalAppBuilder.cs#L39-L51](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/79e3e1f084cd78f9170a8ca4077869f217735a1a/WebApp/Utils/MsalAppBuilder.cs#L57-L58):


First, to use these implementations:
- add the Microsoft.Identity.Web NuGet package. These token cache serializers aren't brought in MSAL.NET directly to avoid unwanted dependencies. In addition to a higher level for ASP.NET Core, Microsoft.Identity.Web brings classes that are helpers for MSAL.NET, 
- In your code, use the Microsoft.Identity.Web namespace:

  ```csharp
  #using Microsoft.Identity.Web
  ```
- Once you have built your confidential client application, add the token cache serialization of your choice.

```csharp
public static class MsalAppBuilder
{
  private static IConfidentialClientApplication clientapp;

  public static IConfidentialClientApplication BuildConfidentialClientApplication()
  {
    if (clientapp == null)
    {
      clientapp = ConfidentialClientApplicationBuilder.Create(AuthenticationConfig.ClientId)
            .WithClientSecret(AuthenticationConfig.ClientSecret)
            .WithRedirectUri(AuthenticationConfig.RedirectUri)
            .WithAuthority(new Uri(AuthenticationConfig.Authority))
            .Build();

      // After the ConfidentialClientApplication is created, we overwrite its default UserTokenCache serialization with our implementation
      clientapp.AddInMemoryTokenCache();
    }
    return clientapp;
  }
```

Instead of `clientapp.AddInMemoryTokenCache()`, you can also use more advanced cache serialization implementations like Redis, SQL, Cosmos DB, or distributed memory. Here's an example for Redis:

```csharp
  clientapp.AddDistributedTokenCache(services =>
  {
    services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = "localhost";
        options.InstanceName = "SampleInstance";
    });
  });
```

For details see [Token cache serialization for MSAL.NET](./msal-net-token-cache-serialization.md).

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

# [Python](#tab/python)

Move on to the next article in this scenario,
[Remove accounts from the cache on global sign out](scenario-web-app-call-api-sign-in.md?tabs=python).

---