---
title: Web app that signs in users (code configuration) - Microsoft identity platform
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
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a Web app that signs-in users using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that signs-in users - code configuration

Learn how to configure the code for your Web app that signs-in users.

## Libraries used to protect Web Apps

<!-- This section can be in an include for Web App and Web APIs -->
The libraries used to protect a Web App (and a Web API) are:

| Platform | Library | Description |
|----------|---------|-------------|
| ![.NET](media/sample-v2-code/logo_net.png) | [Identity model extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) | Used directly by ASP.NET and ASP.NET Core, Microsoft Identity Extensions for .NET proposes a set of DLLs running both on .NET Framework and .NET Core. From an ASP.NET/ASP.NET Core Web app, you can control token validation using the **TokenValidationParameters** class (in particular in some ISV scenarios) |
| ![.NET](media/sample-v2-code/logo_java.png) | [msal4j](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki) | MSAL for Java |

Code snippets in this article and the following are extracted from:

- the [ASP.NET Core Web app incremental tutorial, chapter 1](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-1-MyOrg).
- the [ASP.NET Web app sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect)
- the [Java web application calling Microsoft graph](https://github.com/Azure-Samples/ms-identity-java-webapp) msal4j sample

You might want to refer to these tutorials and sample for full implementation details.

## Configuration files

Web applications that sign in users with the Microsoft identity platform are usually configured through configuration files. The settings that you need to fill in are:

- the cloud `Instance` if you want your app to run (for instance in national clouds)
- the audience in `tenantId`
- the `clientId` for your application, as copied from the Azure portal.

Sometimes, applications can be parametrized by the `authority`, which is the concatenation of the `instance` and the `tenantId`

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core, these settings are usually located in the `appsettings.json` file, in the "AzureAD" section.

```JSon
{
  "AzureAd": {
    // Azure Cloud instance among:
    // "https://login.microsoftonline.com/" for Azure Public cloud.
    // "https://login.microsoftonline.us/" for Azure US government.
    // "https://login.microsoftonline.de/" for Azure AD Germany
    // "https://login.chinacloudapi.cn/" for Azure AD China operated by 21Vianet
    "Instance": "https://login.microsoftonline.com/",

    // Azure AD Audience among:
    // - the tenant Id as a GUID obtained from the azure portal to sign-in users in your organization
    // - "organizations" to sign-in users in any work or school accounts
    // - "common" to sign-in users with any work and school account or Microsoft personal account
    // - "consumers" to sign-in users with Microsoft personal account only
    "TenantId": "[Enter the tenantId here]]",

    // Client Id (Application ID) obtained from the Azure portal
    "ClientId": "[Enter the Client Id]",
    "CallbackPath": "/signin-oidc",
    "SignedOutCallbackPath ": "/signout-callback-oidc"
  }
}
```

In ASP.NET Core, there's another file (`properties\launchSettings.json`) that contains the URL (`applicationUrl`) and the SSL Port (`sslPort`) for your application and various profiles.

```JSon
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

In the Azure portal, the reply URIs that you need to register in the **Authentication** page for your application needs to match these URLs; that is, for the two configuration files above, they would be `https://localhost:44321/signin-oidc` as the applicationUrl is `http://localhost:3110` but the `sslPort` is specified (44321), and the `CallbackPath` is `/signin-oidc` as defined in the `appsettings.json`.
  
In the same way, the sign-out URI would be set to `https://localhost:44321/signout-callback-oidc`.

# [ASP.NET](#tab/aspnet)

In ASP.NET, the application is configured through the `Web.Config` file

```XML
<?xml version="1.0" encoding="utf-8"?>
<!--
  For more information on how to configure your ASP.NET application, please visit
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

In the Azure portal, the reply URIs that you need to register in the **Authentication** page for your application needs to match these URLs; that is `https://localhost:44326/`.

# [Java](#tab/java)

In Java, the configuration is located in the `application.properties` file located under `src/main/resources`

```Java
aad.clientId=Enter_the_Application_Id_here
aad.authority=https://login.microsoftonline.com/Enter_the_Tenant_Info_Here/
aad.secretKey=Enter_the_Client_Secret_Here
aad.redirectUriSignin=http://localhost:8080/msal4jsample/secure/aad
aad.redirectUriGraphUsers=http://localhost:8080/msal4jsample/graph/users
```

In the Azure portal, the reply URIs that you need to register in the **Authentication** page for your application needs to match the redirectUris defined by the application, that is `http://localhost:8080/msal4jsample/secure/aad` and `http://localhost:8080/msal4jsample/graph/users`

---

## Initialization code

The initialization code is different depending on the platform. For ASP.NET Core and ASP.NET, signing in users is delegated to the OpenIDConnect middleware. Today the ASP.NET / ASP.NET Core template generate web applications for the Azure AD v1.0 endpoint. Therefore, a bit of configuration is required to adapt them to the Microsoft identity platform (v2.0) endpoint. In the case of Java, it's handled by spring with the cooperation of the application.

# [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core Web Apps (and Web APIs), the application is protected because you have a `[Authorize]` attribute on the controllers or the controller actions. This checks that the user is authenticated. The code doing the application initialization is located in the `Startup.cs` file, and, to add authentication with the Microsoft identity platform (formerly Azure AD v2.0), you'll need to add the following code. The comments in the code should be self-explanatory.

  > [!NOTE]
  > If you start your project with default ASP.NET core web project within Visual studio or using `dotnet new mvc` the method `AddAzureAD` is available by default because the related packages are automatically loaded.
  > However if you build a project from scratch and are trying to use the below code we suggest you to add the NuGet Package **"Microsoft.AspNetCore.Authentication.AzureAD.UI"** to your project to make the `AddAzureAD` method available.
  
```CSharp
 services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
         .AddAzureAD(options => configuration.Bind("AzureAd", options));

 services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
 {
  // The ASP.NET core templates are currently using Azure AD v1.0, and compute
  // the authority (as {Instance}/{TenantID}). We want to use the Microsoft identity platform endpoint
  options.Authority = options.Authority + "/v2.0/";

  // If you want to restrict the users that can sign-in to specific organizations
  // Set the tenant value in the appsettings.json file to 'organizations', and add the
  // issuers you want to accept to options.TokenValidationParameters.ValidIssuers collection.
  // Otherwise validate the issuer
  options.TokenValidationParameters.IssuerValidator = AadIssuerValidator.ForAadInstance(options.Authority).ValidateAadIssuer;

  // Set the nameClaimType to be preferred_username.
  // This change is needed because certain token claims from Azure AD v1.0 endpoint
  // (on which the original .NET core template is based) are different in Microsoft identity platform endpoint.
  // For more details see [ID Tokens](https://docs.microsoft.com/azure/active-directory/develop/id-tokens)
  // and [Access Tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens)
  options.TokenValidationParameters.NameClaimType = "preferred_username";
  ...
```

# [ASP.NET](#tab/aspnet)

The code related to authentication in ASP.NET Web app / Web APIs is located in the `App_Start/Startup.Auth.cs` file.

```CSharp
 public void ConfigureAuth(IAppBuilder app)
 {
  app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

  app.UseCookieAuthentication(new CookieAuthenticationOptions());

  app.UseOpenIdConnectAuthentication(
    new OpenIdConnectAuthenticationOptions
    {
     // The `Authority` represents the identity platform endpoint - https://login.microsoftonline.com/common/v2.0
     // The `Scope` describes the initial permissions that your app will need.
     //  See https://azure.microsoft.com/documentation/articles/active-directory-v2-scopes/
     ClientId = clientId,
     Authority = String.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0"),
     RedirectUri = redirectUri,
     Scope = "openid profile",
     PostLogoutRedirectUri = redirectUri,
    });
 }
```

# [Java](#tab/java)

The Java sample uses the Spring framework. The application is protected because you implement a Filter, which gets each Http response. In the Java Web app quickstart, this is `AuthFilter` in `src/main/java/com/microsoft/azure/msalwebsample/AuthFilter.java`. The filter process the OAuth 2.0 authorization code flow and therefore:

- verifies if the user is authenticated (`isAuthenticated()` method)
- if the user is not authenticated, it computes the url of the Azure AD authorize endpoints, and redirects the browser to this URI
- when the response arrives, containing the auth code flow it let's msal4j acquiring the token.
- when it finally receives the token from the token endpoint (on the redirect Uri), the user is signed in.

For details see the `doFilter()` method in [AuthFilter.java](https://github.com/Azure-Samples/ms-identity-java-webapp/blob/master/src/main/java/com/microsoft/azure/msalwebsample/AuthFilter.java)

> [!NOTE]
> The code of the `doFilter()` is written in a slightly different order, but the flow is the one described.

See [Microsoft identity platform and OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md) for details about the authorization code flow triggered by this method

---

## Next steps

In the next article, you'll learn how to trigger the sign-in and sign-out.

> [!div class="nextstepaction"]
> [Sign in and sign out](scenario-web-app-sign-user-sign-in.md)
