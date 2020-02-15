---
title: Configure a web app that signs in users - Microsoft identity platform | Azure
description: Learn how to build a web app that signs in users (code configuration)
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
#Customer intent: As an application developer, I want to know how to write a web app that signs in users by using the Microsoft identity platform for developers.
---

# Web app that signs in users: Code configuration

Learn how to configure the code for your web app that signs in users.

## Libraries for protecting web apps

<!-- This section can be in an include for Web App and Web APIs -->
The libraries that are used to protect a web app (and a web API) are:

| Platform | Library | Description |
|----------|---------|-------------|
| ![.NET](media/sample-v2-code/logo_net.png) | [Identity Model Extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) | Used directly by ASP.NET and ASP.NET Core, Microsoft Identity Model Extensions for .NET proposes a set of DLLs running on both .NET Framework and .NET Core. From an ASP.NET or ASP.NET Core web app, you can control token validation by using the **TokenValidationParameters** class (in particular, in some partner scenarios). |
| ![Java](media/sample-v2-code/small_logo_java.png) | [MSAL Java](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki) | Support for Java web applications |
| ![Python](media/sample-v2-code/small_logo_python.png) | [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python/wiki) | Support for Python web applications |

Select the tab that corresponds to the platform you're interested in:

# [ASP.NET Core](#tab/aspnetcore)

Code snippets in this article and the following are extracted from the [ASP.NET Core web app incremental tutorial, chapter 1](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-1-MyOrg).

You might want to refer to this tutorial for full implementation details.

# [ASP.NET](#tab/aspnet)

Code snippets in this article and the following are extracted from the [ASP.NET web app sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect).

You might want to refer to this sample for full implementation details.

# [Java](#tab/java)

Code snippets in this article and the following are extracted from the [Java web application calling Microsoft graph](https://github.com/Azure-Samples/ms-identity-java-webapp) sample in MSAL Java.

You might want to refer to this sample for full implementation details.

# [Python](#tab/python)

Code snippets in this article and the following are extracted from the [Python web application calling Microsoft graph](https://github.com/Azure-Samples/ms-identity-python-webapp) sample in MSAL Python.

You might want to refer to this sample for full implementation details.

---

## Configuration files

Web applications that sign in users by using the Microsoft identity platform are usually configured through configuration files. The settings that you need to fill in are:

- The cloud instance (`Instance`) if you want your app to run in national clouds, for example
- The audience in the tenant ID (`TenantId`)
- The client ID (`ClientId`) for your application, as copied from the Azure portal

Sometimes, applications can be parametrized by `Authority`, which is a concatenation of `Instance` and `TenantId`.

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core, these settings are located in the [appsettings.json](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/bc564d68179c36546770bf4d6264ce72009bc65a/1-WebApp-OIDC/1-1-MyOrg/appsettings.json#L2-L8) file, in the "AzureAd" section.

```Json
{
  "AzureAd": {
    // Azure cloud instance among:
    // - "https://login.microsoftonline.com/" for Azure public cloud
    // - "https://login.microsoftonline.us/" for Azure US government
    // - "https://login.microsoftonline.de/" for Azure AD Germany
    // - "https://login.chinacloudapi.cn/" for Azure AD China operated by 21Vianet
    "Instance": "https://login.microsoftonline.com/",

    // Azure AD audience among:
    // - "TenantId" as a GUID obtained from the Azure portal to sign in users in your organization
    // - "organizations" to sign in users in any work or school account
    // - "common" to sign in users with any work or school account or Microsoft personal account
    // - "consumers" to sign in users with a Microsoft personal account only
    "TenantId": "[Enter the tenantId here]]",

    // Client ID (application ID) obtained from the Azure portal
    "ClientId": "[Enter the Client Id]",
    "CallbackPath": "/signin-oidc",
    "SignedOutCallbackPath ": "/signout-callback-oidc"
  }
}
```

In ASP.NET Core, another file ([properties\launchSettings.json](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/bc564d68179c36546770bf4d6264ce72009bc65a/1-WebApp-OIDC/1-1-MyOrg/Properties/launchSettings.json#L6-L7)) contains the URL (`applicationUrl`) and the SSL port (`sslPort`) for your application and various profiles.

```Json
{
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:3110/",
      "sslPort": 44321
    }
  },
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "webApp": {
      "commandName": "Project",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "applicationUrl": "http://localhost:3110/"
    }
  }
}
```

In the Azure portal, the reply URIs that you need to register on the **Authentication** page for your application need to match these URLs. For the two preceding configuration files, they would be `https://localhost:44321/signin-oidc`. The reason is that `applicationUrl` is `http://localhost:3110`, but `sslPort` is specified (44321). `CallbackPath` is `/signin-oidc`, as defined in `appsettings.json`.

In the same way, the sign-out URI would be set to `https://localhost:44321/signout-callback-oidc`.

# [ASP.NET](#tab/aspnet)

In ASP.NET, the application is configured through the [Web.config](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/Web.config#L12-L15) file, lines 12 to 15.

```XML
<?xml version="1.0" encoding="utf-8"?>
<!--
  For more information on how to configure your ASP.NET application, visit
  https://go.microsoft.com/fwlink/?LinkId=301880
  -->
<configuration>
  <appSettings>
    <add key="webpages:Version" value="3.0.0.0" />
    <add key="webpages:Enabled" value="false" />
    <add key="ClientValidationEnabled" value="true" />
    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
    <add key="ida:ClientId" value="[Enter your client ID, as obtained from the app registration portal]" />
    <add key="ida:ClientSecret" value="[Enter your client secret, as obtained from the app registration portal]" />
    <add key="ida:AADInstance" value="https://login.microsoftonline.com/{0}{1}" />
    <add key="ida:RedirectUri" value="https://localhost:44326/" />
    <add key="vs:EnableBrowserLink" value="false" />
  </appSettings>
```

In the Azure portal, the reply URIs that you need to register on the **Authentication** page for your application need to match these URLs. That is, they should be `https://localhost:44326/`.

# [Java](#tab/java)

In Java, the configuration is located in the [application.properties](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/resources/application.properties) file located under `src/main/resources`.

```Java
aad.clientId=Enter_the_Application_Id_here
aad.authority=https://login.microsoftonline.com/Enter_the_Tenant_Info_Here/
aad.secretKey=Enter_the_Client_Secret_Here
aad.redirectUriSignin=http://localhost:8080/msal4jsample/secure/aad
aad.redirectUriGraph=http://localhost:8080/msal4jsample/graph/me
```

In the Azure portal, the reply URIs that you need to register on the **Authentication** page for your application need to match the `redirectUri` instances that the application defines. That is, they should be `http://localhost:8080/msal4jsample/secure/aad` and `http://localhost:8080/msal4jsample/graph/me`.

# [Python](#tab/python)

Here's the Python configuration file in [app_config.py](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/0.1.0/app_config.py):

```Python
CLIENT_SECRET = "Enter_the_Client_Secret_Here"
AUTHORITY = "https://login.microsoftonline.com/common""
CLIENT_ID = "Enter_the_Application_Id_here"
ENDPOINT = 'https://graph.microsoft.com/v1.0/users'
SCOPE = ["User.ReadBasic.All"]
SESSION_TYPE = "filesystem"  # So the token cache will be stored in a server-side session
```

> [!NOTE]
> This quickstart proposes to store the client secret in the configuration file for simplicity. In your production app, you'd want to use other ways to store your secret, such as a key vault or an environment variable as described in [Flask's documentation](https://flask.palletsprojects.com/en/1.1.x/config/#configuring-from-environment-variables).
>
> ```python
> CLIENT_SECRET = os.getenv("CLIENT_SECRET")
> if not CLIENT_SECRET:
>     raise ValueError("Need to define CLIENT_SECRET environment variable")
> ```

---

## Initialization code

The initialization code is different depending on the platform. For ASP.NET Core and ASP.NET, signing in users is delegated to the OpenID Connect middleware. The ASP.NET or ASP.NET Core template generates web applications for the Azure Active Directory (Azure AD) v1.0 endpoint. Some configuration is required to adapt them to the Microsoft identity platform (v2.0) endpoint. In the case of Java, it's handled by Spring with the cooperation of the application.

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core web apps (and web APIs), the application is protected because you have a `[Authorize]` attribute on the controllers or the controller actions. This attribute checks that the user is authenticated. The code that's initializing the application is in the Startup.cs file.

To add authentication with the Microsoft identity platform (formerly Azure AD v2.0), you'll need to add the following code. The comments in the code should be self-explanatory.

> [!NOTE]
> If you start your project with the default ASP.NET Core web project within Visual studio or by using `dotnet new mvc`, the method `AddAzureAD` is available by default. That's because the related packages are automatically loaded.
>
> If you build a project from scratch and are trying to use the following code, we suggest that you add the NuGet package **Microsoft.AspNetCore.Authentication.AzureAD.UI** to your project to make the `AddAzureAD` method available.

The following code is available from [Startup.cs#L33-L34](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/faa94fd49c2da46b22d6694c4f5c5895795af26d/1-WebApp-OIDC/1-1-MyOrg/Startup.cs#L33-L34).

```csharp
public class Startup
{
 ...

  // This method is called by the runtime. Use this method to add services to the container.
  public void ConfigureServices(IServiceCollection services)
  {
    ...
      // Sign in users with the Microsoft identity platform
      services.AddMicrosoftIdentityPlatformAuthentication(Configuration);

      services.AddMvc(options =>
      {
          var policy = new AuthorizationPolicyBuilder()
              .RequireAuthenticatedUser()
              .Build();
            options.Filters.Add(new AuthorizeFilter(policy));
            })
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
    }
```

The `AddMicrosoftIdentityPlatformAuthentication` extension method is defined in [Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L23](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/faa94fd49c2da46b22d6694c4f5c5895795af26d/Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L23). It:

- Adds the authentication service.
- Configures options to read the configuration file.
- Configures the OpenID Connect options so that the used authority is the Microsoft identity platform (formerly Azure AD v2.0) endpoint.
- Validates the issuer of the token.
- Ensures that the claims corresponding to name are mapped from the `preferred_username` claim in the ID token.

In addition to the configuration, you can specify the name of the configuration section when calling `AddMicrosoftIdentityPlatformAuthentication`. By default, it's `AzureAd`.

Tracing OpenId Connect middleware events can help you troubleshoot your web application if authentication doesn't work. Setting `subscribeToOpenIdConnectMiddlewareDiagnosticsEvents` to `true` will show you how information gets elaborated by the set of ASP.NET Core middleware as it progresses from the HTTP response to the identity of the user in `HttpContext.User`.

```csharp
/// <summary>
/// Add authentication with the Microsoft identity platform.
/// This method expects the configuration file to have a section named "AzureAd" with the necessary settings to initialize authentication options.
/// </summary>
/// <param name="services">Service collection to which to add this authentication scheme</param>
/// <param name="configuration">The Configuration object</param>
/// <param name="subscribeToOpenIdConnectMiddlewareDiagnosticsEvents">
/// Set to true if you want to debug, or just understand the OpenID Connect events.
/// </param>
/// <returns></returns>
public static IServiceCollection AddMicrosoftIdentityPlatformAuthentication(
  this IServiceCollection services,
  IConfiguration configuration,
  string configSectionName = "AzureAd",
  bool subscribeToOpenIdConnectMiddlewareDiagnosticsEvents = false)
{
  services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
      .AddAzureAD(options => configuration.Bind(configSectionName, options));
  services.Configure<AzureADOptions>(options => configuration.Bind(configSectionName, options));

  services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
  {
      // Per the following code, this application signs in users in any work or school
      // accounts and any Microsoft personal accounts.
      // If you want to direct Azure AD to restrict the users who can sign in, change
      // the tenant value of the appsettings.json file in the following way:
      // - Only work or school accounts => 'organizations'
      // - Only Microsoft personal accounts => 'consumers'
      // - Work or school and personal accounts => 'common'
      // If you want to restrict the users who can sign in to only one tenant,
      // set the tenant value in the appsettings.json file to the tenant ID
      // or domain of this organization.
      options.Authority = options.Authority + "/v2.0/";

      // If you want to restrict the users who can sign in to several organizations,
      // set the tenant value in the appsettings.json file to 'organizations', and add the
      // issuers you want to accept to the options.TokenValidationParameters.ValidIssuers collection.
      options.TokenValidationParameters.IssuerValidator = AadIssuerValidator.GetIssuerValidator(options.Authority).Validate;

      // Set nameClaimType to be preferred_username.
      // This change is needed because certain token claims from the Azure AD v1 endpoint
      // (on which the original .NET Core template is based) are different from the Microsoft identity platform endpoint.
      // For more details, see [ID tokens](https://docs.microsoft.com/azure/active-directory/develop/id-tokens)
      // and [Access tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens).
      options.TokenValidationParameters.NameClaimType = "preferred_username";

      // ...

      if (subscribeToOpenIdConnectMiddlewareDiagnosticsEvents)
      {
          OpenIdConnectMiddlewareDiagnostics.Subscribe(options.Events);
      }
  });
  return services;
}
  ...
```

The `AadIssuerValidator` class enables the issuer of the token to be validated in many cases. This class works with a v1.0 or v2.0 token, a single-tenant or multitenant application, or an application that signs in users with their personal Microsoft accounts in the Azure public cloud or national clouds. It's available from [Microsoft.Identity.Web/Resource/AadIssuerValidator.cs](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/Microsoft.Identity.Web/Resource/AadIssuerValidator.cs).

# [ASP.NET](#tab/aspnet)

The code related to authentication in an ASP.NET web app and web APIs is located in the [App_Start/Startup.Auth.cs](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/App_Start/Startup.Auth.cs#L17-L61) file.

```csharp
 public void ConfigureAuth(IAppBuilder app)
 {
  app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

  app.UseCookieAuthentication(new CookieAuthenticationOptions());

  app.UseOpenIdConnectAuthentication(
    new OpenIdConnectAuthenticationOptions
    {
     // `Authority` represents the identity platform endpoint - https://login.microsoftonline.com/common/v2.0.
     // `Scope` describes the initial permissions that your app will need.
     //  See https://azure.microsoft.com/documentation/articles/active-directory-v2-scopes/.
     ClientId = clientId,
     Authority = String.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0"),
     RedirectUri = redirectUri,
     Scope = "openid profile",
     PostLogoutRedirectUri = redirectUri,
    });
 }
```

# [Java](#tab/java)

The Java sample uses the Spring framework. The application is protected because you implement a filter, which intercepts each HTTP response. In the quickstart for Java web apps, this filter is `AuthFilter` in `src/main/java/com/microsoft/azure/msalwebsample/AuthFilter.java`.

The filter processes the OAuth 2.0 authorization code flow and checks if the user is authenticated (`isAuthenticated()` method). If the user isn't authenticated, it computes the URL of the Azure AD authorization endpoints, and redirects the browser to this URI.

When the response arrives, containing the authorization code, it acquires the token by using MSAL Java. When it finally receives the token from the token endpoint (on the redirect URI), the user is signed in.

For details, see the `doFilter()` method in [AuthFilter.java](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/master/src/main/java/com/microsoft/azure/msalwebsample/AuthFilter.java).

> [!NOTE]
> The code of the `doFilter()` is written in a slightly different order, but the flow is the one described.

For details about the authorization code flow that this method triggers, see [Microsoft identity platform and OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

# [Python](#tab/python)

The Python sample uses Flask. The initialization of Flask and MSAL Python is done in [app.py#L1-L28](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/e03be352914bfbd58be0d4170eba1fb7a4951d84/app.py#L1-L28).

```Python
import uuid
import requests
from flask import Flask, render_template, session, request, redirect, url_for
from flask_session import Session  # https://pythonhosted.org/Flask-Session
import msal
import app_config


app = Flask(__name__)
app.config.from_object(app_config)
Session(app)
```

---

## Next steps

In the next article, you'll learn how to trigger sign-in and sign-out.

# [ASP.NET Core](#tab/aspnetcore)

> [!div class="nextstepaction"]
> [Sign in and sign out](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-sign-user-sign-in?tabs=aspnetcore)

# [ASP.NET](#tab/aspnet)

> [!div class="nextstepaction"]
> [Sign in and sign out](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-sign-user-sign-in?tabs=aspnet)

# [Java](#tab/java)

> [!div class="nextstepaction"]
> [Sign in and sign out](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-sign-user-sign-in?tabs=java)

# [Python](#tab/python)

> [!div class="nextstepaction"]
> [Sign in and sign out](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-sign-user-sign-in?tabs=python)

---
