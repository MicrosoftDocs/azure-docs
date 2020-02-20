---
title: Configure a web app that calls web APIs - Microsoft identity platform | Azure
description: Learn how to configure the code of a web app that calls web APIs
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
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev
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
| ![MSAL.NET](media/sample-v2-code/logo_NET.png) <br/> MSAL.NET  | Support for .NET Framework and .NET Core platforms. Not supported are Universal Windows Platform (UWP), Xamarin.iOS, and Xamarin.Android, because those platforms are used to build public client applications. |
| ![MSAL Python](media/sample-v2-code/logo_python.png) <br/> MSAL for Python | Support for Python web applications. |
| ![MSAL Java](media/sample-v2-code/logo_java.png) <br/> MSAL for Java | Support for Java web applications. |

Select the tab for the platform you're interested in:

# [ASP.NET Core](#tab/aspnetcore)

Because user sign-in is delegated to the Open ID connect (OIDC) middleware, you must interact with the OIDC process. How you interact depends on the framework you use.

For ASP.NET Core, you'll subscribe to middleware OIDC events:

- You'll let ASP.NET Core request an authorization code by means of the Open ID Connect middleware. ASP.NET or ASP.NET Core will let the user sign in and consent.
- You'll subscribe the web app to receive the authorization code. This subscription is done by using a C# delegate.
- When the authorization code is received, you'll use MSAL libraries to redeem it. The resulting access tokens and refresh tokens are stored in the token cache. The cache can be used in other parts of the application, such as controllers, to acquire other tokens silently.

Code examples in this article and the following one are extracted from the [ASP.NET Core web app incremental tutorial, chapter 2](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-1-Call-MSGraph). You might want to refer to that tutorial for full implementation details.

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

### Startup.cs

In ASP.NET Core, in the `Startup.cs` file, you subscribe to the `OnAuthorizationCodeReceived` OpenID Connect event. From this event, call the MSAL.NET `AcquireTokenFromAuthorizationCode` method. This method stores the following tokens in the token cache:

- The *access token* for the requested `scopes`.
- A *refresh token*. This token will be used to refresh the access token when it's close to expiry, or to get another token on behalf of the same user but for a different resource.

The [ASP.NET Core Web app tutorial](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2) provides you with reusable code for your web apps.

Following is the code from [Startup.cs#L40-L42](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/bc564d68179c36546770bf4d6264ce72009bc65a/2-WebApp-graph-user/2-1-Call-MSGraph/Startup.cs#L40-L42). It features calls to:

- The `AddMicrosoftIdentityPlatformAuthentication` method, which adds authentication to the web app.
- The `AddMsal` method, which adds the capability of calling Web APIs.
- The `AddInMemoryTokenCaches` method, which is about choosing a token-cache implementation.

```csharp
public class Startup
{
  // Code not shown here

  public void ConfigureServices(IServiceCollection services)
  {
      // Token acquisition service based on MSAL.NET
      // and chosen token-cache implementation
      services.AddMicrosoftIdentityPlatformAuthentication(Configuration)
          .AddMsal(Configuration, new string[] { Constants.ScopeUserRead })
          .AddInMemoryTokenCaches();
  }

  // Code not shown here
}
```

`Constants.ScopeUserRead` is defined in [Constants.cs#L5](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/bc564d68179c36546770bf4d6264ce72009bc65a/2-WebApp-graph-user/2-1-Call-MSGraph/Infrastructure/Constants.cs#L5):

```csharp
public static class Constants
{
    public const string ScopeUserRead = "User.Read";
}
```

You've already studied the content of `AddMicrosoftIdentityPlatformAuthentication` in [Web app that signs in users - code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=aspnetcore#initialization-code).

### The AddMsal method

The code for `AddMsal` is located in [Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L108-L159](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/bc564d68179c36546770bf4d6264ce72009bc65a/Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L108-L159).

```csharp

/// <summary>
/// Extensions for IServiceCollection for startup initialization
/// </summary>
public static class WebAppServiceCollectionExtensions
{
  // Code omitted here

  /// <summary>
  /// Add MSAL support to the web app or web API.
  /// </summary>
  /// <param name="services">Service collection to which to add authentication</param>
  /// <param name="initialScopes">Initial scopes to request at sign-in</param>
  /// <returns></returns>
  public static IServiceCollection AddMsal(this IServiceCollection services, IConfiguration configuration, IEnumerable<string> initialScopes, string configSectionName = "AzureAd")
  {
      // Ensure that configuration options for MSAL.NET, HttpContext accessor and the Token acquisition service
      // (encapsulating MSAL.NET) are available through dependency injection.
      services.Configure<ConfidentialClientApplicationOptions>(options => configuration.Bind(configSectionName, options));
      services.AddHttpContextAccessor();
      services.AddTokenAcquisition();

      services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
      {
          // Response type
          options.ResponseType = OpenIdConnectResponseType.CodeIdToken;

          // This scope is needed to get a refresh token when users sign in by using their personal Microsoft accounts.
          // (It's required by MSAL.NET and automatically provided when users sign in by using work or school accounts.)
          options.Scope.Add("offline_access");
          if (initialScopes != null)
          {
              foreach (string scope in initialScopes)
              {
                  if (!options.Scope.Contains(scope))
                  {
                      options.Scope.Add(scope);
                  }
              }
          }

          // Handle the auth redemption by MSAL.NET so that a token is available in the token cache,
          // where it will be usable from controllers later (by means of the TokenAcquisition service).
          var handler = options.Events.OnAuthorizationCodeReceived;
          options.Events.OnAuthorizationCodeReceived = async context =>
          {
              var tokenAcquisition = context.HttpContext.RequestServices.GetRequiredService<ITokenAcquisition>();
              await tokenAcquisition.AddAccountToCacheFromAuthorizationCodeAsync(context, options.Scope).ConfigureAwait(false);
              await handler(context).ConfigureAwait(false);
          };
      });
      return services;
  }
}
```

The `AddMsal` method ensures that:

- The ASP.NET Core web app requests both an ID token for the user and an authentication code (`options.ResponseType = OpenIdConnectResponseType.CodeIdToken`).
- The `offline_access` scope is added. This scope obtains user consent for the application to get a refresh token.
- The app subscribes to the OIDC `OnAuthorizationCodeReceived` event and redeems the call by using MSAL.NET, which is encapsulated here into a reusable component implementing `ITokenAcquisition`.

### The TokenAcquisition.AddAccountToCacheFromAuthorizationCodeAsync method

The `TokenAcquisition.AddAccountToCacheFromAuthorizationCodeAsync` method is located in [Microsoft.Identity.Web/TokenAcquisition.cs#L101-L145](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/4b12ba02e73f62e3e3137f5f4b9ef43cec7c14fd/Microsoft.Identity.Web/TokenAcquisition.cs#L101-L145). It ensures that:

- ASP.NET does not attempt to redeem the authentication code in parallel to MSAL.NET (`context.HandleCodeRedemption();`).
- The claims in the ID token are available for MSAL to compute a token cache key for the account of the user.
- An instance of the MSAL.NET application is created if necessary.
- The code is redeemed by the MSAL.NET application.
- The new ID token is shared with ASP.NET Core during the call to `context.HandleCodeRedemption(null, result.IdToken);`. The access token is not shared with ASP.NET Core. It remains in the MSAL.NET token cache associated with the user, where it's ready to be used in ASP.NET Core controllers.

Here's the relevant code for `TokenAcquisition`:

```csharp
public class TokenAcquisition : ITokenAcquisition
{
  string[] scopesRequestedByMsalNet = new string[]{ "openid", "profile", "offline_access" };

  // Code omitted here for clarity


  public async Task AddAccountToCacheFromAuthorizationCodeAsync(AuthorizationCodeReceivedContext context, IEnumerable<string> scopes)
  {
   // Code omitted here for clarity

    try
    {
      // Because AcquireTokenByAuthorizationCodeAsync is asynchronous, we tell ASP.NET core that we're handing the code
      // even if it's not done yet, so that it doesn't concurrently call the token endpoint. Otherwise, there will be a
      // race condition that causes an Azure AD error message ("code already redeemed").
      context.HandleCodeRedemption();

      // The cache needs the claims from the ID token.
      // If they're not yet in the HttpContext.User's claims, add them here.
      if (!context.HttpContext.User.Claims.Any())
      {
          (context.HttpContext.User.Identity as ClaimsIdentity).AddClaims(context.Principal.Claims);
      }

      var application = GetOrBuildConfidentialClientApplication();

      // Don't share the access token with ASP.NET Core. If we share it, ASP.NET will cache it and won't send the OAuth 2.0 request if
      // a further call to AcquireTokenByAuthorizationCodeAsync is required later for incremental consent (getting a code requesting more scopes).
      // Do share the ID token, however.
      var result = await application
          .AcquireTokenByAuthorizationCode(scopes.Except(_scopesRequestedByMsalNet), context.ProtocolMessage.Code)
          .ExecuteAsync()
          .ConfigureAwait(false);

      context.HandleCodeRedemption(null, result.IdToken);
  }
  catch (MsalException ex)
  {
      Debug.WriteLine(ex.Message);
      throw;
  }
 }
```

### The TokenAcquisition.BuildConfidentialClientApplication method

In ASP.NET Core, building the confidential client application uses information that's in the `HttpContext`. The `HttpContext` associated with the request is accessed by using the `CurrentHttpContext` property. `HttpContext` has information about the URL for the web app and about the signed-in user (in a  `ClaimsPrincipal`). 

The `BuildConfidentialClientApplication` method also uses the ASP.NET Core configuration. The configuration has an "AzureAD" section, and also is bound to  both of the following elements:

- The `_applicationOptions` data structure of type [ConfidentialClientApplicationOptions](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.confidentialclientapplicationoptions?view=azure-dotnet).
- The `azureAdOptions` instance of type [AzureAdOptions](https://github.com/aspnet/AspNetCore/blob/master/src/Azure/AzureAD/Authentication.AzureAD.UI/src/AzureADOptions.cs), defined in ASP.NET Core `Authentication.AzureAD.UI`.

Finally, the application needs to maintain token caches. You'll learn more about that in the next section.

The code for the `GetOrBuildConfidentialClientApplication()` method is in [Microsoft.Identity.Web/TokenAcquisition.cs#L290-L333](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/4b12ba02e73f62e3e3137f5f4b9ef43cec7c14fd/Microsoft.Identity.Web/TokenAcquisition.cs#L290-L333). It uses members that were injected by dependency injection (passed in the constructor of `TokenAcquisition` in [Microsoft.Identity.Web/TokenAcquisition.cs#L47-L59](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/4b12ba02e73f62e3e3137f5f4b9ef43cec7c14fd/Microsoft.Identity.Web/TokenAcquisition.cs#L47-L59)).

Here's the code for `GetOrBuildConfidentialClientApplication`:

```csharp
public class TokenAcquisition : ITokenAcquisition
{
  // Code omitted here for clarity

  // Members
  private IConfidentialClientApplication application;
  private HttpContext CurrentHttpContext => _httpContextAccessor.HttpContext;

  // The following members are set by dependency injection in the TokenAcquisition constructor.
  private readonly AzureADOptions _azureAdOptions;
  private readonly ConfidentialClientApplicationOptions _applicationOptions;
  private readonly IMsalAppTokenCacheProvider _appTokenCacheProvider;
  private readonly IMsalUserTokenCacheProvider _userTokenCacheProvider;
  private readonly IHttpContextAccessor _httpContextAccessor;

  /// <summary>
  /// Creates an MSAL confidential client application, if needed.
  /// </summary>
  private IConfidentialClientApplication GetOrBuildConfidentialClientApplication()
  {
    if (application == null)
    {
        application = BuildConfidentialClientApplication();
    }
    return application;
  }

  /// <summary>
  /// Creates an MSAL Confidential client application
  /// </summary>
  /// <param name="claimsPrincipal"></param>
  /// <returns></returns>
  private IConfidentialClientApplication BuildConfidentialClientApplication()
  {
    var request = CurrentHttpContext.Request;
    var azureAdOptions = _azureAdOptions;
    var applicationOptions = _applicationOptions;
    string currentUri = UriHelper.BuildAbsolute(
        request.Scheme,
        request.Host,
        request.PathBase,
        azureAdOptions.CallbackPath ?? string.Empty);

    string authority = $"{applicationOptions.Instance}{applicationOptions.TenantId}/";

    var app = ConfidentialClientApplicationBuilder
        .CreateWithApplicationOptions(applicationOptions)
        .WithRedirectUri(currentUri)
        .WithAuthority(authority)
        .Build();

    // Initialize token cache providers
    _appTokenCacheProvider?.InitializeAsync(app.AppTokenCache);
    _userTokenCacheProvider?.InitializeAsync(app.UserTokenCache);

    return app;
  }

```

### Summary

`AcquireTokenByAuthorizationCode` is really the method that redeems the authorization code that ASP.NET requests, and that gets the tokens that are added to MSAL.NET user-token cache. From the cache, the tokens are then used in the ASP.NET Core controllers.

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

The ASP.NET core tutorial uses dependency injection to let you decide the token cache implementation in the Startup.cs file for your application. Microsoft.Identity.Web comes with pre-built token-cache serializers described in [Token cache serialization](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/Microsoft.Identity.Web/README.md#token-cache-serialization). An interesting possibility is to choose ASP.NET Core [distributed memory caches](https://docs.microsoft.com/aspnet/core/performance/caching/distributed#distributed-memory-cache):

```csharp
// Use a distributed token cache by adding:
    services.AddMicrosoftIdentityPlatformAuthentication(Configuration)
            .AddMsal(new string[] { scopesToRequest })
            .AddDistributedTokenCaches();

// Then, choose your implementation.

// For instance, the distributed in-memory cache (not cleared when you stop the app):
services.AddDistributedMemoryCache()

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
