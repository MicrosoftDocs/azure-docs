---
title: Configure a web app that calls web APIs - Microsoft identity platform | Azure
description: Learn how to configure the code of a web app that calls web APIs
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev, tracking-python
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform for developers.
---

# A web app that calls web APIs: Code configuration

As shown in the [Web app that signs in users](scenario-web-app-sign-user-overview.md) scenario, the web app uses the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md) to sign the user in. This flow has two steps:

1. Request an authorization code. This part delegates a private dialogue with the user to the Microsoft identity platform. During that dialogue, the user signs in and consents to the use of web APIs. When the private dialogue ends successfully, the web app receives an authorization code on its redirect URI.
1. Request an access token for the API by redeeming the authorization code.

The [Web app that signs in users](scenario-web-app-sign-user-overview.md) scenarios covered only the first step. Here you learn how to modify your web app so that it not only signs users in but also now calls web APIs.

## Libraries that support web-app scenarios

The following libraries in the Microsoft Authentication Library (MSAL) support the authorization code flow for web apps:

| MSAL library | Description |
|--------------|-------------|
| ![MSAL.NET](media/sample-v2-code/logo_NET.png) <br/> MSAL.NET  | Support for .NET Framework and .NET Core platforms. Not supported are Universal Windows Platform (UWP), Xamarin.iOS, and Xamarin.Android, because those platforms are used to build public client applications. For ASP.NET Core web apps and web APIs, MSAL.NET is encapsulated in a higher level library named Microsoft.Identity.Web|
| ![MSAL Python](media/sample-v2-code/logo_python.png) <br/> MSAL for Python | Support for Python web applications. |
| ![MSAL Java](media/sample-v2-code/logo_java.png) <br/> MSAL for Java | Support for Java web applications. |

Select the tab for the platform you're interested in:

# [ASP.NET Core](#tab/aspnetcore)

To enable your web app to call protected APIs when using Microsoft.Identity.Web, you need only to call `AddWebAppCallsProtectedWebApi` and specify a token cache serialization format (for example, in-memory token cache):

```C#
// This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services)
{
    // more code here

    services.AddSignIn(Configuration, "AzureAd")
            .AddWebAppCallsProtectedWebApi(Configuration,
                                           initialScopes: new string[] { "user.read" })
            .AddInMemoryTokenCaches();

    // more code here
}
```

If you're interested in understanding more about the token cache, see [Token cache serialization options](#token-cache)

> [!NOTE]
> To fully understand the code examples here, you need to be familiar with [ASP.NET Core fundamentals](https://docs.microsoft.com/aspnet/core/fundamentals), and in particular with [dependency injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection) and [options](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/options).

# [ASP.NET](#tab/aspnet)

Because user sign-in is delegated to the Open ID connect (OIDC) middleware, you must interact with the OIDC process. How you interact depends on the framework you use.

For ASP.NET, you'll subscribe to middleware OIDC events:

- You'll let ASP.NET Core request an authorization code by means of the Open ID Connect middleware. ASP.NET or ASP.NET Core will let the user sign in and consent.
- You'll subscribe the web app to receive the authorization code. This subscription is done by using a C# delegate.
- When the authorization code is received, you'll use MSAL libraries to redeem it. The resulting access tokens and refresh tokens are stored in the token cache. The cache can be used in other parts of the application, such as controllers, to acquire other tokens silently.

Code examples in this article and the following one are extracted from the [ASP.NET Web app sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect). You might want to refer to that sample for full implementation details.

# [Java](#tab/java)

Code examples in this article and the following one are extracted from the [Java web application that calls Microsoft Graph](https://github.com/Azure-Samples/ms-identity-java-webapp), a web-app sample that uses MSAL for Java.
The sample currently lets MSAL for Java produce the authorization-code URL and handles the navigation to the authorization endpoint for the Microsoft identity platform. It's also possible to use Sprint security to sign the user in. You might want to refer to the sample for full implementation details.

# [Python](#tab/python)

Code examples in this article and the following one are extracted from the [Python web application calling Microsoft Graph](https://github.com/Azure-Samples/ms-identity-python-webapp), a web-app sample that uses MSAL.Python.
The sample currently lets MSAL.Python produce the authorization-code URL and handles the navigation to the authorization endpoint for the Microsoft identity platform. You might want to refer to the sample for full implementation details.

---

## Code that redeems the authorization code

# [ASP.NET Core](#tab/aspnetcore)

Microsoft.Identity.Web simplifies your code by setting the correct OpenID Connect settings, subscribing to the code received event, and redeeming the code. No additional code is required to redeem the authorization code.

# [ASP.NET](#tab/aspnet)

ASP.NET handles things similarly to ASP.NET Core, except that the configuration of OpenID Connect and the subscription to the `OnAuthorizationCodeReceived` event happen in the [App_Start\Startup.Auth.cs](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/App_Start/Startup.Auth.cs) file. The concepts are also similar to those in ASP.NET Core, except that in ASP.NET you must specify the `RedirectUri` in [Web.config#L15](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/master/WebApp/Web.config#L15). This configuration is a bit less robust than the one in ASP.NET Core, because you'll need to change it when you deploy your application.

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

The authorization code flow is requested as shown in [Web app that signs in users: Code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=python#initialization-code). The code is then received on the `authorized` function, which Flask routes from the `/getAToken` URL. See [app.py#L30-L44](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/e03be352914bfbd58be0d4170eba1fb7a4951d84/app.py#L30-L44) for the full context of this code:

```python
 @app.route("/getAToken")  # Its absolute URL must match your app's redirect_uri set in AAD.
def authorized():
    if request.args['state'] != session.get("state"):
        return redirect(url_for("login"))
    cache = _load_cache()
    result = _build_msal_app(cache).acquire_token_by_authorization_code(
        request.args['code'],
        scopes=app_config.SCOPE,  # Misspelled scope would cause an HTTP 400 error here.
        redirect_uri=url_for("authorized", _external=True))
    if "error" in result:
        return "Login failure: %s, %s" % (
            result["error"], result.get("error_description"))
    session["user"] = result.get("id_token_claims")
    _save_cache(cache)
    return redirect(url_for("index"))
```

---

Instead of a client secret, the confidential client application can also prove its identity by using a client certificate, or a client assertion.
The use of client assertions is an advanced scenario, detailed in [Client assertions](msal-net-client-assertions.md).

## Token cache

> [!IMPORTANT]
> The token-cache implementation for web apps or web APIs is different from the implementation for desktop applications, which is often [file based](scenario-desktop-acquire-token.md#file-based-token-cache).
> For security and performance reasons, it's important to ensure that for web apps and web APIs there is one token cache per user account. You must serialize the token cache for each account.

# [ASP.NET Core](#tab/aspnetcore)

The ASP.NET core tutorial uses dependency injection to let you decide the token cache implementation in the Startup.cs file for your application. Microsoft.Identity.Web comes with pre-built token-cache serializers described in [Token cache serialization](msal-net-token-cache-serialization.md#token-cache-for-a-web-app-confidential-client-application). An interesting possibility is to choose ASP.NET Core [distributed memory caches](https://docs.microsoft.com/aspnet/core/performance/caching/distributed#distributed-memory-cache):

```csharp
// Use a distributed token cache by adding:
    services.AddSignIn(Configuration, "AzureAd")
            .AddWebAppCallsProtectedWebApi(Configuration,
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

For details about the token-cache providers, see also the [ASP.NET Core Web app tutorials | Token caches](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-2-TokenCache) phase of the tutorial.

# [ASP.NET](#tab/aspnet)

The token-cache implementation for web apps or web APIs is different from the implementation for desktop applications, which is often [file based](scenario-desktop-acquire-token.md#file-based-token-cache).

The web-app implementation can use the ASP.NET session or the server memory. For example, see how the cache implementation is hooked after the creation of the MSAL.NET application in [MsalAppBuilder.cs#L39-L51](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/Utils/MsalAppBuilder.cs#L39-L51):

```csharp
public static class MsalAppBuilder
{
 // Omitted code
    public static IConfidentialClientApplication BuildConfidentialClientApplication(ClaimsPrincipal currentUser)
    {
      IConfidentialClientApplication clientapp = ConfidentialClientApplicationBuilder.Create(AuthenticationConfig.ClientId)
            .WithClientSecret(AuthenticationConfig.ClientSecret)
            .WithRedirectUri(AuthenticationConfig.RedirectUri)
            .WithAuthority(new Uri(AuthenticationConfig.Authority))
            .Build();

      // After the ConfidentialClientApplication is created, we overwrite its default UserTokenCache with our implementation.
      MSALPerUserMemoryTokenCache userTokenCache = new MSALPerUserMemoryTokenCache(clientapp.UserTokenCache, currentUser ?? ClaimsPrincipal.Current);

      return clientapp;
  }
```

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

In the Python sample, one cache per account is ensured by recreating a confidential client application for each request and then serializing it in the Flask session cache:

```python
from flask import Flask, render_template, session, request, redirect, url_for
from flask_session import Session  # https://pythonhosted.org/Flask-Session
import msal
import app_config


app = Flask(__name__)
app.config.from_object(app_config)
Session(app)

# Code omitted here for simplicity

def _load_cache():
    cache = msal.SerializableTokenCache()
    if session.get("token_cache"):
        cache.deserialize(session["token_cache"])
    return cache

def _save_cache(cache):
    if cache.has_state_changed:
        session["token_cache"] = cache.serialize()

def _build_msal_app(cache=None):
    return msal.ConfidentialClientApplication(
        app_config.CLIENT_ID, authority=app_config.AUTHORITY,
        client_credential=app_config.CLIENT_SECRET, token_cache=cache)
```

---

## Next steps

At this point, when the user signs in, a token is stored in the token cache. Let's see how it's then used in other parts of the web app.

> [!div class="nextstepaction"]
> [A web app that calls web APIs: Remove accounts from the cache on global sign-out](scenario-web-app-call-api-sign-in.md)
