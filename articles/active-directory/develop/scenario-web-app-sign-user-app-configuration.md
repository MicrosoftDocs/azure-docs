---
title: Configure a web app that signs in users
description: Learn how to build a web app that signs in users (code configuration)
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 07/14/2020
ms.author: jmprieur
ms.custom: aaddev, devx-track-python
#Customer intent: As an application developer, I want to know how to write a web app that signs in users by using the Microsoft identity platform.
---

# Web app that signs in users: Code configuration

Learn how to configure the code for your web app that signs in users.

## Microsoft libraries supporting web apps

<!-- This section can be in an include for web app and web APIs -->
The following Microsoft libraries are used to protect a web app (and a web API):

[!INCLUDE [active-directory-develop-libraries-webapp](../../../includes/active-directory-develop-libraries-webapp.md)]

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

# [Node.js](#tab/nodejs)

Code snippets in this article and the following are extracted from the [Node.js web application signing users in](https://github.com/Azure-Samples/ms-identity-node) sample in MSAL Node.

You might want to refer to this sample for full implementation details.

# [Python](#tab/python)

Code snippets in this article and the following are extracted from the [Python web application calling Microsoft graph](https://github.com/Azure-Samples/ms-identity-python-webapp) sample in MSAL Python.

You might want to refer to this sample for full implementation details.

---

## Configuration files

Web applications that sign in users by using the Microsoft identity platform are configured through configuration files. These are the values you're required to specify in the configuration:

- The cloud instance (`Instance`) if you want your app to run in national clouds, for example
- The audience in the tenant ID (`TenantId`)
- The client ID (`ClientId`) for your application, as copied from the Azure portal

You might also see references to the `Authority`. The `Authority` value is the concatenation of the `Instance` and `TenantId` values.

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core, these settings are located in the [appsettings.json](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/bc564d68179c36546770bf4d6264ce72009bc65a/1-WebApp-OIDC/1-1-MyOrg/appsettings.json#L2-L8) file, in the "AzureAd" section.

```Json
{
  "AzureAd": {
    // Azure cloud instance among:
    // - "https://login.microsoftonline.com/" for Azure public cloud
    // - "https://login.microsoftonline.us/" for Azure US government
    // - "https://login.microsoftonline.de/" for Azure AD Germany
    // - "https://login.partner.microsoftonline.cn/common" for Azure AD China operated by 21Vianet
    "Instance": "https://login.microsoftonline.com/",

    // Azure AD audience among:
    // - "TenantId" as a GUID obtained from the Azure portal to sign in users in your organization
    // - "organizations" to sign in users in any work or school account
    // - "common" to sign in users with any work or school account or Microsoft personal account
    // - "consumers" to sign in users with a Microsoft personal account only
    "TenantId": "[Enter the tenantId here]",

    // Client ID (application ID) obtained from the Azure portal
    "ClientId": "[Enter the Client Id]",
    "CallbackPath": "/signin-oidc",
    "SignedOutCallbackPath": "/signout-oidc"
  }
}
```

In ASP.NET Core, another file ([properties\launchSettings.json](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/bc564d68179c36546770bf4d6264ce72009bc65a/1-WebApp-OIDC/1-1-MyOrg/Properties/launchSettings.json#L6-L7)) contains the URL (`applicationUrl`) and the TLS/SSL port (`sslPort`) for your application and various profiles.

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

In the Azure portal, the redirect URIs that you register on the **Authentication** page for your application need to match these URLs. For the two preceding configuration files, they would be `https://localhost:44321/signin-oidc`. The reason is that `applicationUrl` is `http://localhost:3110`, but `sslPort` is specified (44321). `CallbackPath` is `/signin-oidc`, as defined in `appsettings.json`.

In the same way, the sign-out URI would be set to `https://localhost:44321/signout-oidc`.
> [!NOTE]
> SignedOutCallbackPath should set either to portal or the application to avoid conflict while handling the event.

# [ASP.NET](#tab/aspnet)

In ASP.NET, the application is configured through the [Web.config](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/a2da310539aa613b77da1f9e1c17585311ab22b7/WebApp/Web.config#L12-L15) file, lines 12 to 15.

```xml
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

In the Azure portal, the reply URIs that you register on the **Authentication** page for your application need to match these URLs. That is, they should be `https://localhost:44326/`.

# [Java](#tab/java)

In Java, the configuration is located in the [application.properties](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/d55ee4ac0ce2c43378f2c99fd6e6856d41bdf144/src/main/resources/application.properties) file located under `src/main/resources`.

```Java
aad.clientId=Enter_the_Application_Id_here
aad.authority=https://login.microsoftonline.com/Enter_the_Tenant_Info_Here/
aad.secretKey=Enter_the_Client_Secret_Here
aad.redirectUriSignin=http://localhost:8080/msal4jsample/secure/aad
aad.redirectUriGraph=http://localhost:8080/msal4jsample/graph/me
```

In the Azure portal, the reply URIs that you register on the **Authentication** page for your application need to match the `redirectUri` instances that the application defines. That is, they should be `http://localhost:8080/msal4jsample/secure/aad` and `http://localhost:8080/msal4jsample/graph/me`.

# [Node.js](#tab/nodejs)

Here, the configuration parameters reside in *.env* as environment variables:

:::code language="text" source="~/ms-identity-node/App/.env":::

These parameters are used to create a configuration object in *authConfig.js* file, which will eventually be used to initialize MSAL Node:

:::code language="js" source="~/ms-identity-node/App/authConfig.js":::

In the Azure portal, the reply URIs that you register on the Authentication page for your application need to match the redirectUri instances that the application defines (`http://localhost:3000/auth/redirect`).

> [!NOTE]
> This quickstart proposes to store the client secret in the configuration file for simplicity. In your production app, you'd want to use other ways to store your secret, such as a key vault or an environment variable.

# [Python](#tab/python)

Here's the Python configuration file in [app_config.py](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/0.1.0/app_config.py):

```Python
CLIENT_SECRET = "Enter_the_Client_Secret_Here"
AUTHORITY = "https://login.microsoftonline.com/common"
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

The initialization code is different depending on the platform. For ASP.NET Core and ASP.NET, signing in users is delegated to the OpenID Connect middleware. The ASP.NET or ASP.NET Core template generates web applications for the Azure Active Directory (Azure AD) v1.0 endpoint. Some configuration is required to adapt them to the Microsoft identity platform. In the case of Java, it's handled by Spring with the cooperation of the application.

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core web apps (and web APIs), the application is protected because you have a `[Authorize]` attribute on the controllers or the controller actions. This attribute checks that the user is authenticated. Prior to the release of .NET 6, the code that's initializing the application is in the *Startup.cs* file.  New ASP.NET Core projects with .NET 6 no longer contain a *Startup.cs* file.  Taking its place is the *Program.cs* file.  The rest of this tutorial pertains to .NET 5 or lower.

To add authentication with the Microsoft identity platform (formerly Azure AD v2.0), you'll need to add the following code. The comments in the code should be self-explanatory.

> [!NOTE]
> If you want to start directly with the new ASP.NET Core templates for Microsoft identity platform, that leverage Microsoft.Identity.Web, you can download a preview NuGet package containing project templates for .NET Core 3.1 and .NET 5.0. Then, once installed, you can directly instantiate ASP.NET Core web applications (MVC or Blazor). See [Microsoft.Identity.Web web app project templates](https://aka.ms/ms-id-web/webapp-project-templates) for details. This is the simplest approach as it will do all the steps below for you.
>
> If you prefer to start your project with the current default ASP.NET Core web project within Visual Studio or by using `dotnet new mvc --auth SingleOrg` or `dotnet new webapp --auth SingleOrg`, you'll see code like the following:
>
> ```c#
>  services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
>          .AddAzureAD(options => Configuration.Bind("AzureAd", options));
> ```
>
> This code uses the legacy **Microsoft.AspNetCore.Authentication.AzureAD.UI** NuGet package which is used to create an Azure AD v1.0 application. This article explains how to create a Microsoft identity platform (Azure AD v2.0) application which replaces that code.
>

1. Add the [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) and [Microsoft.Identity.Web.UI](https://www.nuget.org/packages/Microsoft.Identity.Web.UI) NuGet packages to your project. Remove the Microsoft.AspNetCore.Authentication.AzureAD.UI NuGet package if it is present.

2. Update the code in `ConfigureServices` so that it uses the `AddMicrosoftIdentityWebAppAuthentication` and `AddMicrosoftIdentityUI` methods.

   ```c#
   public class Startup
   {
    ...
    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
     services.AddMicrosoftIdentityWebAppAuthentication(Configuration, "AzureAd");

     services.AddRazorPages().AddMvcOptions(options =>
     {
      var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
      options.Filters.Add(new AuthorizeFilter(policy));
     }).AddMicrosoftIdentityUI();
    ```

3. In the `Configure` method in *Startup.cs*, enable authentication with a call to `app.UseAuthentication();` and `app.MapControllers();`.

   ```c#
   // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
   public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
   {
    // more code here
    app.UseAuthentication();
    app.UseAuthorization();
    
    app.MapRazorPages();
    app.MapControllers();
    // more code here
   }
   ```

In the code above:
- The `AddMicrosoftIdentityWebAppAuthentication` extension method is defined in **Microsoft.Identity.Web**. It:
  - Adds the authentication service.
  - Configures options to read the configuration file (here from the "AzureAD" section)
  - Configures the OpenID Connect options so that the authority is the Microsoft identity platform.
  - Validates the issuer of the token.
  - Ensures that the claims corresponding to name are mapped from the `preferred_username` claim in the ID token.

- In addition to the configuration object, you can specify the name of the configuration section when calling `AddMicrosoftIdentityWebAppAuthentication`. By default, it's `AzureAd`.

- `AddMicrosoftIdentityWebAppAuthentication` has other parameters for advanced scenarios. For example, tracing OpenID Connect middleware events can help you troubleshoot your web application if authentication doesn't work. Setting the optional parameter `subscribeToOpenIdConnectMiddlewareDiagnosticsEvents` to `true` will show you how information is processed by the set of ASP.NET Core middleware as it progresses from the HTTP response to the identity of the user in `HttpContext.User`.

- The `AddMicrosoftIdentityUI` extension method is defined in **Microsoft.Identity.Web.UI**. It provides a default controller to handle sign-in and sign-out.

For more information about how Microsoft.Identity.Web enables you to create web apps, see [Web Apps in microsoft-identity-web](https://aka.ms/ms-id-web/webapp).

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
     // Authority` represents the identity platform endpoint - https://login.microsoftonline.com/common/v2.0.
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

For details, see the `doFilter()` method in [AuthFilter.java](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/master/msal-java-webapp-sample/src/main/java/com/microsoft/azure/msalwebsample/AuthFilter.java).

> [!NOTE]
> The code of the `doFilter()` is written in a slightly different order, but the flow is the one described.

For details about the authorization code flow that this method triggers, see the [Microsoft identity platform and OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

# [Node.js](#tab/nodejs)

Node sample the Express framework. MSAL is initialized in *auth* route handler:

:::code language="js" source="~/ms-identity-node/App/routes/auth.js" range="6-16":::

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

Move on to the next article in this scenario,
[Sign in and sign out](./scenario-web-app-sign-user-sign-in.md?tabs=aspnetcore).

# [ASP.NET](#tab/aspnet)

Move on to the next article in this scenario,
[Sign in and sign out](./scenario-web-app-sign-user-sign-in.md?tabs=aspnet).

# [Java](#tab/java)

Move on to the next article in this scenario,
[Sign in and sign out](./scenario-web-app-sign-user-sign-in.md?tabs=java).

# [Node.js](#tab/nodejs)

Move on to the next article in this scenario,
[Sign in](./scenario-web-app-sign-user-sign-in.md?tabs=nodejs).

# [Python](#tab/python)

Move on to the next article in this scenario,
[Sign in and sign out](./scenario-web-app-sign-user-sign-in.md?tabs=python).

---
